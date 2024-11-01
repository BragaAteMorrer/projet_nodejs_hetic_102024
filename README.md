
# Application de Gestion de Fichiers

Cette application permet aux utilisateurs d'enregistrer, de télécharger et de gérer leurs fichiers en ligne avec des fonctionnalités d'authentification et un système de quotas. Elle inclut un serveur d'API utilisant Node.js, Express, Sequelize avec MariaDB, et gère le stockage local des fichiers.

## Fonctionnalités

- **Enregistrement et Connexion des Utilisateurs**
- **Upload et Gestion des Fichiers avec quota personnalisé**
- **Liens de Téléchargement Temporaires**

## Prérequis

- Node.js (v14 ou supérieur)
- Base de données MariaDB
- Configurer les variables d'environnement suivantes pour MariaDB :
  - `DB_NAME` : Nom de la base de données
  - `DB_USER` : Utilisateur de la base de données
  - `DB_PASSWORD` : Mot de passe de la base de données
  - `DB_HOST` : Hôte de la base de données

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone <URL-du-dépôt>
   cd <dossier-du-projet>
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer la base de données**
   - Créer une base de données MariaDB.
   - Remplir les informations de connexion dans les variables d'environnement.

4. **Démarrer le serveur**
   ```bash
   node src/app.js
   ```
   L'application sera accessible à `http://localhost:3000/accueil`.

## Routes Principales

### Authentification
- **POST** `/auth/register` : Enregistre un nouvel utilisateur.
- **POST** `/auth/login` : Connecte un utilisateur et crée un cookie de session.
- **POST** `/auth/logout` : Déconnecte l'utilisateur et efface le cookie de session.

### Gestion des Fichiers
- **POST** `/files/upload` : Upload un fichier (nécessite un champ `file` en multipart/form-data).
- **GET** `/files/:id/download` : Télécharge un fichier via son lien temporaire.
- **GET** `/files` : Liste les fichiers de l'utilisateur authentifié avec leurs liens de téléchargement.

## Structure des Fichiers

- `app.js` : Point d'entrée de l'application, configure les routes et initialise les serveurs.
- `config.js` : Configuration de Sequelize pour MariaDB.
- `authController.js` : Gère l'authentification (enregistrement, connexion, déconnexion).
- `fileController.js` : Gère l'upload, le téléchargement et la récupération des fichiers.
- `user.js` : Modèle Sequelize pour les utilisateurs, incluant le quota.
- `file.js` : Modèle Sequelize pour les fichiers, incluant l'expiration.
- `authRoutes.js` : Routes pour l'authentification.
- `fileRoutes.js` : Routes pour la gestion des fichiers.
- `generatelink.js` : Génère des liens temporaires pour le téléchargement sécurisé.

## Utilisation

1. **Enregistrer un utilisateur** en envoyant une requête `POST` à `/auth/register` avec `username` et `password`.
2. **Se connecter** via `/auth/login` pour obtenir un cookie de session.
3. **Uploader des fichiers** en faisant une requête `POST` à `/files/upload` avec un fichier en pièce jointe.
4. **Télécharger un fichier** avec le lien temporaire fourni à l'upload.
5. **Lister les fichiers** de l'utilisateur connecté via `/files`.

## Notes Techniques

- **Stockage Local** : Les fichiers uploadés sont enregistrés dans le dossier `uploads` à la racine du projet.
- **Expiration des Liens** : Les liens générés pour chaque fichier expirent après une heure.
- **Quota d'Utilisateur** : Défini par défaut à 2 Go, mais peut être ajusté dans le modèle `user`.

