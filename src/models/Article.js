// src/models/Article.js
// Modèle Article - toutes les opérations en base de données

const { pool } = require('../config/database');

class Article {

  // ─── CRÉER UN ARTICLE ─────────────────────────────────────────
  static async create({ titre, contenu, auteur, categorie = 'Général', tags = [] }) {
    const tagsJson = JSON.stringify(tags);
    const [result] = await pool.execute(
      `INSERT INTO articles (titre, contenu, auteur, categorie, tags)
       VALUES (?, ?, ?, ?, ?)`,
      [titre, contenu, auteur, categorie, tagsJson]
    );
    return result.insertId;
  }

  // ─── LIRE TOUS LES ARTICLES (avec filtres optionnels) ──────────
  static async findAll(filters = {}) {
    let sql    = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (filters.categorie) {
      sql += ' AND LOWER(categorie) = LOWER(?)';
      params.push(filters.categorie);
    }
    if (filters.auteur) {
      sql += ' AND LOWER(auteur) LIKE LOWER(?)';
      params.push(`%${filters.auteur}%`);
    }
    if (filters.date) {
      sql += ' AND DATE(date_creation) = ?';
      params.push(filters.date);
    }

    sql += ' ORDER BY date_creation DESC';

    const [rows] = await pool.execute(sql, params);
    return rows.map(Article._format);
  }

  // ─── LIRE UN ARTICLE PAR ID ───────────────────────────────────
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return Article._format(rows[0]);
  }

  // ─── METTRE À JOUR UN ARTICLE ─────────────────────────────────
  static async update(id, { titre, contenu, categorie, tags }) {
    const sets   = [];
    const params = [];

    if (titre     !== undefined) { sets.push('titre = ?');     params.push(titre); }
    if (contenu   !== undefined) { sets.push('contenu = ?');   params.push(contenu); }
    if (categorie !== undefined) { sets.push('categorie = ?'); params.push(categorie); }
    if (tags      !== undefined) { sets.push('tags = ?');      params.push(JSON.stringify(tags)); }

    if (sets.length === 0) return 0;

    params.push(id);
    const [result] = await pool.execute(
      `UPDATE articles SET ${sets.join(', ')} WHERE id = ?`,
      params
    );
    return result.affectedRows;
  }

  // ─── SUPPRIMER UN ARTICLE ─────────────────────────────────────
  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM articles WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }

  // ─── RECHERCHE PLEIN TEXTE (titre + contenu) ──────────────────
  static async search(q) {
    const terme = `%${q}%`;
    const [rows] = await pool.execute(
      `SELECT * FROM articles
       WHERE titre LIKE ? OR contenu LIKE ?
       ORDER BY date_creation DESC`,
      [terme, terme]
    );
    return rows.map(Article._format);
  }

  // ─── HELPER : formater les tags JSON ──────────────────────────
  static _format(row) {
    return {
      ...row,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
    };
  }
}

module.exports = Article;
