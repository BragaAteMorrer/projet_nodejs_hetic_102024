# Utilise une image de Node.js
FROM node:23

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie uniquement les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers dans le conteneur
COPY . .

# Démarre l'application
CMD ["node", "/app/src/app.js"]
