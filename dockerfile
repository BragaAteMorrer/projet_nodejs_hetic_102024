# Utilise une image de Node.js
FROM node:20

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie uniquement les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers dans le conteneur
COPY . .

# Expose le port (optionnel selon ton utilisation)
EXPOSE 3000

# Démarre l'application
CMD ["node", "/app/src/app.js"]