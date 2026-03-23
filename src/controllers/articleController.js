// src/controllers/articleController.js
// Contrôleurs : logique métier pour chaque endpoint

const Article = require('../models/Article');

// ──────────────────────────────────────────────────────────────────
//  POST /api/articles — Créer un article
// ──────────────────────────────────────────────────────────────────
const createArticle = async (req, res) => {
  try {
    const { titre, contenu, auteur, categorie, tags } = req.body;
    const id = await Article.create({ titre, contenu, auteur, categorie, tags });

    return res.status(201).json({
      success: true,
      message: 'Article créé avec succès.',
      data: { id },
    });
  } catch (error) {
    console.error('[createArticle]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'article.',
    });
  }
};

// ──────────────────────────────────────────────────────────────────
//  GET /api/articles — Lister tous les articles (filtres optionnels)
//  Query params : ?categorie=Tech&auteur=Alice&date=2026-03-18
// ──────────────────────────────────────────────────────────────────
const getAllArticles = async (req, res) => {
  try {
    const { categorie, auteur, date } = req.query;
    const articles = await Article.findAll({ categorie, auteur, date });

    return res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error('[getAllArticles]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des articles.',
    });
  }
};

// ──────────────────────────────────────────────────────────────────
//  GET /api/articles/:id — Lire un article précis
// ──────────────────────────────────────────────────────────────────
const getArticleById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID invalide.' });
    }

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: `Article avec l'ID ${id} introuvable.`,
      });
    }

    return res.status(200).json({ success: true, data: article });
  } catch (error) {
    console.error('[getArticleById]', error.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ──────────────────────────────────────────────────────────────────
//  PUT /api/articles/:id — Mettre à jour un article
// ──────────────────────────────────────────────────────────────────
const updateArticle = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID invalide.' });
    }

    // Vérifier existence
    const existing = await Article.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Article avec l'ID ${id} introuvable.`,
      });
    }

    const { titre, contenu, categorie, tags } = req.body;
    const affected = await Article.update(id, { titre, contenu, categorie, tags });

    if (affected === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun champ à mettre à jour fourni.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Article ${id} mis à jour avec succès.`,
    });
  } catch (error) {
    console.error('[updateArticle]', error.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ──────────────────────────────────────────────────────────────────
//  DELETE /api/articles/:id — Supprimer un article
// ──────────────────────────────────────────────────────────────────
const deleteArticle = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID invalide.' });
    }

    const affected = await Article.delete(id);
    if (affected === 0) {
      return res.status(404).json({
        success: false,
        message: `Article avec l'ID ${id} introuvable.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Article ${id} supprimé avec succès.`,
    });
  } catch (error) {
    console.error('[deleteArticle]', error.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ──────────────────────────────────────────────────────────────────
//  GET /api/articles/search?q=nodejs — Recherche plein texte
// ──────────────────────────────────────────────────────────────────
const searchArticles = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Le paramètre "q" (terme de recherche) est obligatoire.',
      });
    }

    const results = await Article.search(q.trim());
    return res.status(200).json({
      success: true,
      count: results.length,
      query: q,
      data: results,
    });
  } catch (error) {
    console.error('[searchArticles]', error.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles,
};
