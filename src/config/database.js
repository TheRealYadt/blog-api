// src/config/database.js
// Configuration et connexion à MySQL via mysql2

const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de connexions pour gérer plusieurs requêtes simultanées
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'blog_db',
  charset:  'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test de la connexion au démarrage
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion MySQL établie avec succès');
    connection.release();
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL :', error.message);
    process.exit(1);
  }
};

module.exports = { pool, testConnection };
