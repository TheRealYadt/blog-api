# 📝 Blog API — Node.js + Express + MySQL

API REST complète pour la gestion d'articles de blog avec documentation Swagger.

---

## 🚀 Installation & Démarrage

### Prérequis
- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) v8+
- npm

### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-username/blog-api.git
cd blog-api
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
```bash
cp .env.example .env
# Éditer .env avec vos identifiants MySQL
```

### 4. Initialiser la base de données
```bash
mysql -u root -p < docs/schema.sql
```

### 5. Lancer le serveur
```bash
# Mode développement (rechargement auto)
npm run dev

# Mode production
npm start
```

L'API sera accessible sur **http://localhost:3000**

---

## 📚 Documentation API (Swagger)

Ouvrir **http://localhost:3000/api/docs** dans votre navigateur.

---

## 🔌 Endpoints

| Méthode | Endpoint                    | Description                        |
|---------|-----------------------------|------------------------------------|
| `POST`  | `/api/articles`             | Créer un article                   |
| `GET`   | `/api/articles`             | Lister tous les articles           |
| `GET`   | `/api/articles?categorie=X` | Filtrer par catégorie              |
| `GET`   | `/api/articles?auteur=X`    | Filtrer par auteur                 |
| `GET`   | `/api/articles?date=YYYY-MM-DD` | Filtrer par date               |
| `GET`   | `/api/articles/:id`         | Récupérer un article               |
| `PUT`   | `/api/articles/:id`         | Modifier un article                |
| `DELETE`| `/api/articles/:id`         | Supprimer un article               |
| `GET`   | `/api/articles/search?q=X`  | Recherche plein texte              |

---

## 📋 Exemples d'utilisation

### Créer un article
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Mon premier article",
    "contenu": "Contenu de l art article...",
    "auteur": "Jean Dupont",
    "categorie": "Tech",
    "tags": ["nodejs", "api"]
  }'
```
**Réponse (201) :**
```json
{
  "success": true,
  "message": "Article créé avec succès.",
  "data": { "id": 4 }
}
```

---

### Lister tous les articles
```bash
curl http://localhost:3000/api/articles
```
**Réponse (200) :**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "titre": "Introduction à Node.js",
      "auteur": "Alice Dupont",
      "categorie": "Tech",
      "tags": ["nodejs", "javascript"],
      "date_creation": "2026-03-18T10:00:00.000Z"
    }
  ]
}
```

---

### Filtrer par catégorie et date
```bash
curl "http://localhost:3000/api/articles?categorie=Tech&date=2026-03-18"
```

---

### Récupérer un article
```bash
curl http://localhost:3000/api/articles/1
```

---

### Mettre à jour un article
```bash
curl -X PUT http://localhost:3000/api/articles/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Titre mis à jour",
    "categorie": "Tutoriel",
    "tags": ["node", "backend", "api"]
  }'
```
**Réponse (200) :**
```json
{
  "success": true,
  "message": "Article 1 mis à jour avec succès."
}
```

---

### Supprimer un article
```bash
curl -X DELETE http://localhost:3000/api/articles/1
```
**Réponse (200) :**
```json
{
  "success": true,
  "message": "Article 1 supprimé avec succès."
}
```

---

### Recherche plein texte
```bash
curl "http://localhost:3000/api/articles/search?q=nodejs"
```
**Réponse (200) :**
```json
{
  "success": true,
  "count": 2,
  "query": "nodejs",
  "data": [...]
}
```

---

## 🗂️ Structure du Projet

```
blog-api/
├── src/
│   ├── app.js                   # Point d'entrée, Swagger, middlewares
│   ├── config/
│   │   └── database.js          # Pool de connexions MySQL
│   ├── controllers/
│   │   └── articleController.js # Logique métier (CRUD)
│   ├── middleware/
│   │   └── validation.js        # Validation des données entrantes
│   ├── models/
│   │   └── Article.js           # Requêtes SQL (modèle)
│   └── routes/
│       └── articleRoutes.js     # Routes + annotations Swagger
├── docs/
│   └── schema.sql               # Script de création BDD
├── .env.example                 # Template de configuration
├── package.json
└── README.md
```

---

## 📐 Structure d'un Article

| Champ              | Type        | Obligatoire | Description                        |
|--------------------|-------------|-------------|------------------------------------|
| `id`               | integer     | Auto        | Identifiant unique auto-généré     |
| `titre`            | string      | ✅ Oui      | Titre non vide                     |
| `contenu`          | text        | ✅ Oui      | Corps de l'article                 |
| `auteur`           | string      | ✅ Oui      | Nom de l'auteur                    |
| `categorie`        | string      | Non         | Défaut : "Général"                 |
| `tags`             | array(JSON) | Non         | Liste de mots-clés                 |
| `date_creation`    | datetime    | Auto        | Automatique à la création          |
| `date_modification`| datetime    | Auto        | Mis à jour automatiquement         |

---

## ⚙️ Codes HTTP utilisés

| Code | Signification          |
|------|------------------------|
| 200  | Succès                 |
| 201  | Ressource créée        |
| 400  | Données invalides      |
| 404  | Ressource introuvable  |
| 500  | Erreur serveur         |

---

## 🛠️ Technologies

- **Node.js** — Environnement d'exécution JavaScript
- **Express.js** — Framework web minimaliste
- **MySQL2** — Driver MySQL pour Node.js
- **Swagger UI + JSDoc** — Documentation interactive
- **Helmet** — Sécurité des en-têtes HTTP
- **CORS** — Cross-Origin Resource Sharing
- **Morgan** — Logger de requêtes HTTP
- **dotenv** — Variables d'environnement
- **Nodemon** — Rechargement auto (développement)
