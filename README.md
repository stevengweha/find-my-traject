# 📱 Find My Traject

**Find My Traject** est une application mobile développée avec **React Native** et **Express.js**, permettant aux utilisateurs de planifier et de suivre leurs trajets en temps réel.

## 🚀 Fonctionnalités

- 🔐 Authentification sécurisée des utilisateurs
- 📍 Suivi et gestion des trajets
- 💬 Interface utilisateur simple et intuitive
- 📦 API backend Node.js/Express
- 🗺️ Intégration avec MongoDB via Mongoose


## 🛠️ Technologies utilisées

### Frontend

- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo](https://expo.dev/)

### Backend

- [Node.js](https://nodejs.org/) avec [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) pour la base de données
- [Mongoose](https://mongoosejs.com/) pour l'ORM

### Autres

- [Docker](https://www.docker.com/) pour la conteneurisation
- [dotenv](https://www.npmjs.com/package/dotenv) pour la gestion des variables d'environnement
- [cors](https://www.npmjs.com/package/cors) pour la gestion des politiques CORS

## 📁 Structure du projet

```
find-my-traject/
├── assets/               # Ressources statiques (images, icônes, etc.)
├── backend/              # Code source du backend Express.js
│   ├── routes/           # Définition des routes API
│   └── models/           # Modèles de données Mongoose
├── screens/              # Écrans de l'application mobile
├── App.js                # Point d'entrée principal de l'application React Native
├── index.js              # Point d'entrée principal du backend
├── Dockerfile.frontend   # Dockerfile pour le frontend
├── docker-compose.yml    # Configuration Docker Compose
├── package.json          # Dépendances et scripts du projet
└── .gitignore            # Fichiers et dossiers à ignorer par Git
```

## ⚙️ Installation et exécution

### Prérequis

- [Node.js](https://nodejs.org/) installé
- [Docker](https://www.docker.com/) installé (pour la conteneurisation)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installé globalement

### Étapes

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/stevengweha/find-my-traject.git
   cd find-my-traject
   ```


2. **Utiliser Docker (optionnel)**

   Pour exécuter l'application avec Docker :

   ```bash
   docker-compose up --build
   ```

## 🧪 Tests

Les tests unitaires et d'intégration peuvent être realiser à l'aide de frameworks tels que expo go pour le frontend et postman pour le backend.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.

## 🙌 Remerciements

Merci à tous les contributeurs et aux mainteneurs des bibliothèques open-source utilisées dans ce projet.