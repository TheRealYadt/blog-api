// src/app.js
// Point d'entrée principal de l'API Blog

require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const morgan        = require('morgan');
const swaggerUi     = require('swagger-ui-express');
const swaggerJsdoc  = require('swagger-jsdoc');

const { testConnection } = require('./config/database');
const articleRoutes      = require('./routes/articleRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// 
//  MIDDLEWARES GLOBAUX
// 
app.use(helmet({ contentSecurityPolicy: false })); // Sécurité HTTP headers
app.use(cors());                                    // Cross-Origin Resource Sharing
app.use(morgan('dev'));                             // Logger des requêtes
app.use(express.json());                           // Parser JSON
app.use(express.urlencoded({ extended: true }));   // Parser URL-encoded

// 
//  CONFIGURATION SWAGGER
// 
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '📝 Blog API',
      version: '1.0.0',
      description: `
## API REST de gestion de blog

Cette API permet de gérer des articles de blog avec les 4 principales actions de base sur une donnée.

### Fonctionnalités
-  Créer un article
-  Lister tous les articles (avec filtres)
-  Récupérer un article par ID
-  Mettre à jour un article
-  Supprimer un article
-  Recherche plein texte

### Technologies
- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : MySQL
- **Documentation** : Swagger / OpenAPI 3.0
      `,
      contact: {
        name: 'Dayt',
        email: 'yann.tiotsop@facsciences-uy.cm',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Serveur de développement local',
      },
    ],
    tags: [
      {
        name: 'Articles',
        description: 'Opérations CRUD sur les articles de blog',
      },
    ],
  },
  apis: ['./src/routes/*.js'],   // Fichiers contenant les annotations JSDoc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Route Swagger UI
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { background-color: #2C3E50; }',
    customSiteTitle: 'Blog API — Documentation',
  })
);

// JSON brut de la spec OpenAPI
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

//  ROUTES
app.use('/api/articles', articleRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Bienvenue sur Blog API !',
    version: '1.0.0',
    documentation: `http://localhost:${PORT}/api/docs`,
    endpoints: {
      articles: `http://localhost:${PORT}/api/articles`,
      search:   `http://localhost:${PORT}/api/articles/search?q=mot`,
      docs:     `http://localhost:${PORT}/api/docs`,
    },
  });
});

//  GESTION DES ERREURS 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} introuvable.`,
  });
});

//  GESTION DES ERREURS GLOBALES
app.use((err, req, res, next) => {
  console.error('Erreur non gérée :', err.stack);
  res.status(500).json({
    success: false,
    message: 'Une erreur interne est survenue.',
  });
});

//  DÉMARRAGE DU SERVEUR
const start = async () => {
  await testConnection();   // Vérifier la BD avant de démarrer
  app.listen(PORT, () => {
    console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 Documentation Swagger : http://localhost:${PORT}/api/docs`);
    console.log(`🌍 Environnement : ${process.env.NODE_ENV || 'development'}\n`);
  });
};

start();
