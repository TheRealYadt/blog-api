/*schémasql*/
-- Script SQL - Blog API
-- Base de données : blog_db

CREATE DATABASE IF NOT EXISTS blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blog_db;

-- Table des articles
CREATE TABLE IF NOT EXISTS articles (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  titre       VARCHAR(255) NOT NULL,
  contenu     LONGTEXT NOT NULL,
  auteur      VARCHAR(100) NOT NULL,
  categorie   VARCHAR(100) DEFAULT 'Général',
  tags        JSON DEFAULT NULL,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Contraintes
  CONSTRAINT chk_titre_non_vide CHECK (titre != ''),
  CONSTRAINT chk_auteur_non_vide CHECK (auteur != ''),
  
  -- Index pour optimiser les recherches
  INDEX idx_auteur (auteur),
  INDEX idx_categorie (categorie),
  INDEX idx_date (date_creation),
  FULLTEXT idx_recherche (titre, contenu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de test
INSERT INTO articles (titre, contenu, auteur, categorie, tags) VALUES
('Introduction à Node.js', 'Node.js est un environnement d''exécution JavaScript côté serveur basé sur le moteur V8 de Chrome. Il permet de créer des applications réseau rapides et évolutives.', 'Alice Dupont', 'Tech', '["nodejs", "javascript", "backend"]'),
('Les bases de MySQL', 'MySQL est un système de gestion de base de données relationnelle open source. Il est largement utilisé dans les applications web pour stocker et récupérer des données.', 'Bob Martin', 'Tech', '["mysql", "sql", "database"]'),
('Guide Express.js', 'Express.js est un framework web minimaliste pour Node.js. Il simplifie la création d''API REST et d''applications web.', 'Alice Dupont', 'Tutoriel', '["express", "nodejs", "api"]');

SELECT 'Base de données initialisée avec succès !' AS message;
