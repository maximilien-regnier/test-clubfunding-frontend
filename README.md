# Test technique ClubFunding partie frontend

La partie frontend est réalisée avec React 17 comme demandé dans le document de test technique. 

Il s'agit d'une application React qui permet de gérer des projets et leurs tâches associées. Elle offre des fonctionnalités complètes de CRUD, pagination, filtrage et validation.

Pour la partie backend, une API REST Laravel est disponible dans un dépôt séparé. ici : https://github.com/maximilien-regnier/test-clubfunding-api
Consultez le README de ce dépôt pour les instructions d'installation et d'utilisation.

## Installation et Configuration

### Prérequis
- Node.js (version 16 ou supérieure)
- npm
- API Laravel configurée et démarrée

### Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
cd test-technique
```

2. Installer les dépendances
```bash
npm install
```

3. Configuration de l'environnement
```bash
cp .env.example .env
```

Modifier le fichier `.env` avec l'URL de votre API Laravel :

Si l'API est lancée via Docker + Sail l'URL est :

```
VITE_API_BASE_URL=http://localhost/api
```


4. Démarrer l'application en développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`


## Utilisation

### Navigation
- **Page d'accueil** : Liste des projets avec filtres et recherche
- **Détails du projet** : Vue détaillée avec liste des tâches
- **Formulaires** : Création/modification de projets et tâches

### Fonctionnalités Principales

1. **Créer un projet**
   - Cliquer sur "Nouveau Projet"
   - Remplir le nom du projet
   - Valider le formulaire

2. **Gérer les tâches**
   - Accéder aux détails d'un projet
   - Créer, modifier ou supprimer des tâches
   - Filtrer par statut

3. **Recherche et filtres**
   - Utiliser la barre de recherche
   - Appliquer des filtres par statut
   - Trier les résultats
