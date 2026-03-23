// src/routes/articleRoutes.js
// Définition des routes + annotations Swagger (JSDoc)

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/articleController');
const { validateArticle, validatePartialArticle } = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Identifiant unique auto-généré
 *           example: 1
 *         titre:
 *           type: string
 *           description: Titre de l'article (non vide)
 *           example: "Introduction à Node.js"
 *         contenu:
 *           type: string
 *           description: Contenu complet de l'article
 *           example: "Node.js est un environnement d'exécution JavaScript..."
 *         auteur:
 *           type: string
 *           description: Nom de l'auteur (obligatoire)
 *           example: "Alice Dupont"
 *         categorie:
 *           type: string
 *           description: Catégorie de l'article
 *           example: "Tech"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste de tags
 *           example: ["nodejs", "javascript"]
 *         date_creation:
 *           type: string
 *           format: date-time
 *           description: Date de création automatique
 *         date_modification:
 *           type: string
 *           format: date-time
 *           description: Date de dernière modification
 *
 *     ArticleInput:
 *       type: object
 *       required:
 *         - titre
 *         - contenu
 *         - auteur
 *       properties:
 *         titre:
 *           type: string
 *           example: "Mon premier article"
 *         contenu:
 *           type: string
 *           example: "Voici le contenu de mon article..."
 *         auteur:
 *           type: string
 *           example: "Jean Dupont"
 *         categorie:
 *           type: string
 *           example: "Tutoriel"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["web", "backend"]
 *
 *     ArticleUpdate:
 *       type: object
 *       properties:
 *         titre:
 *           type: string
 *           example: "Titre modifié"
 *         contenu:
 *           type: string
 *           example: "Contenu mis à jour..."
 *         categorie:
 *           type: string
 *           example: "Tech"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["nodejs", "api"]
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 */

// ────────────────────────────────────────────────────────────────
// ROUTE SPÉCIALE : recherche (doit être AVANT /:id pour éviter conflit)
// ────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles par mot-clé
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Terme de recherche (cherche dans titre ET contenu)
 *         example: "nodejs"
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 query:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       400:
 *         description: Paramètre q manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/search', ctrl.searchArticles);

// ────────────────────────────────────────────────────────────────
// POST /api/articles — Créer
// ────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un nouvel article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Article créé avec succès."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 4
 *       400:
 *         description: Données invalides (titre vide, auteur manquant...)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 */
router.post('/', validateArticle, ctrl.createArticle);

// ────────────────────────────────────────────────────────────────
// GET /api/articles — Liste avec filtres optionnels
// ────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles (avec filtres optionnels)
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie (ex. Tech)
 *       - in: query
 *         name: auteur
 *         schema:
 *           type: string
 *         description: Filtrer par auteur (recherche partielle)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date de création (YYYY-MM-DD)
 *         example: "2026-03-18"
 *     responses:
 *       200:
 *         description: Liste des articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 */
router.get('/', ctrl.getAllArticles);

// ────────────────────────────────────────────────────────────────
// GET /api/articles/:id — Lire un article
// ────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article
 *     responses:
 *       200:
 *         description: Article trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', ctrl.getArticleById);

// ────────────────────────────────────────────────────────────────
// PUT /api/articles/:id — Mettre à jour
// ────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Mettre à jour un article existant
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleUpdate'
 *     responses:
 *       200:
 *         description: Article mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', validatePartialArticle, ctrl.updateArticle);

// ────────────────────────────────────────────────────────────────
// DELETE /api/articles/:id — Supprimer
// ────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article à supprimer
 *     responses:
 *       200:
 *         description: Article supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', ctrl.deleteArticle);

module.exports = router;
