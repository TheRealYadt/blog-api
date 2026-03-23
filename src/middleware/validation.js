// src/middleware/validation.js
// Validation des données entrantes

const validateArticle = (req, res, next) => {
  const { titre, auteur } = req.body;
  const errors = [];

  // Titre : obligatoire et non vide
  if (titre === undefined || titre === null) {
    errors.push('Le champ "titre" est obligatoire.');
  } else if (typeof titre !== 'string' || titre.trim() === '') {
    errors.push('Le champ "titre" ne peut pas être vide.');
  }

  // Auteur : obligatoire
  if (auteur === undefined || auteur === null) {
    errors.push('Le champ "auteur" est obligatoire.');
  } else if (typeof auteur !== 'string' || auteur.trim() === '') {
    errors.push('Le champ "auteur" ne peut pas être vide.');
  }

  // Contenu : obligatoire
  if (!req.body.contenu || req.body.contenu.trim() === '') {
    errors.push('Le champ "contenu" est obligatoire.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors,
    });
  }
  next();
};

const validatePartialArticle = (req, res, next) => {
  const { titre, auteur } = req.body;

  if (titre !== undefined && (typeof titre !== 'string' || titre.trim() === '')) {
    return res.status(400).json({
      success: false,
      message: 'Le titre ne peut pas être vide.',
    });
  }
  if (auteur !== undefined && (typeof auteur !== 'string' || auteur.trim() === '')) {
    return res.status(400).json({
      success: false,
      message: "L'auteur ne peut pas être vide.",
    });
  }
  next();
};

module.exports = { validateArticle, validatePartialArticle };
