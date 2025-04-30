# Utiliser une image officielle de Node.js
FROM node:20

# Créer un répertoire de travail pour le backend
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install
RUN npm install cors
# Copier le code source du backend dans le conteneur
COPY . .

# Exposer le port où ton serveur backend sera en écoute (par défaut 5000 pour un serveur Express)
EXPOSE 5000

# Lancer le serveur backend
CMD ["node", "server.js"]
