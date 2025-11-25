# Frontend - Documentation

## 📋 Contexte du Projet

**Armed App** est une plateforme de gestion et de partage de projets musicaux, inspirée de **SoundCloud**. Le frontend est construit avec React, TypeScript et Vite, et peut être exécuté en application web ou desktop via Electron.

## 🏗️ Architecture

- **Framework** : React 18 + TypeScript
- **Build Tool** : Vite
- **Routing** : React Router v6
- **Styling** : Tailwind CSS
- **UI Components** : shadcn/ui
- **State Management** : React Context API
- **HTTP Client** : Fetch API (via services)
- **Desktop** : Electron (optionnel)

## ✅ État Actuel - Version 1.0

### Infrastructure

- ✅ React + TypeScript configuré et fonctionnel
- ✅ Vite configuré avec HMR
- ✅ Tailwind CSS intégré
- ✅ shadcn/ui installé et configuré
- ✅ React Router configuré
- ✅ Structure de dossiers organisée
- ✅ Variables d'environnement configurées

### Pages Implémentées

#### 1. **Home (`/`)**
- ✅ Page d'accueil avec message de bienvenue
- ✅ Affichage conditionnel selon l'état d'authentification
- ✅ Liens vers connexion/inscription
- ⚠️ **À transformer en Feed utilisateur** (V2)

#### 2. **Login (`/login`)**
- ✅ Formulaire de connexion moderne (LoginForm)
- ✅ Intégration avec AuthContext
- ✅ Gestion des erreurs
- ✅ Redirection après connexion
- ✅ Lien vers inscription

#### 3. **Register (`/register`)**
- ✅ Formulaire d'inscription moderne (RegisterForm)
- ✅ Champ nom optionnel
- ✅ Intégration avec AuthContext
- ✅ Gestion des erreurs
- ✅ Redirection après inscription
- ✅ Lien vers connexion

### Composants Implémentés

#### 1. **Layout**
- ✅ Layout principal avec sidebar
- ✅ Navigation entre pages
- ✅ Gestion de l'authentification dans la sidebar

#### 2. **AppSidebar**
- ✅ Navigation principale
- ✅ Menu utilisateur
- ✅ Déconnexion

#### 3. **MusicPlayer**
- ✅ Player audio global (style Apple-like)
- ✅ Waveform interactive avec scrubber
- ✅ Contrôles play/pause
- ✅ Affichage du temps (actuel et durée)
- ✅ Contrôle de vitesse
- ✅ Design arrondi et moderne
- ✅ Responsive (mobile, tablet, desktop)

#### 4. **LoginForm**
- ✅ Formulaire de connexion avec shadcn/ui
- ✅ Champs email et password
- ✅ Lien "Forgot password"
- ✅ Bouton GitHub (UI)
- ✅ Lien vers inscription

#### 5. **RegisterForm**
- ✅ Formulaire d'inscription avec shadcn/ui
- ✅ Champs name, email et password
- ✅ Bouton GitHub (UI)
- ✅ Lien vers connexion

#### 6. **UI Components (shadcn/ui)**
- ✅ Button
- ✅ Card
- ✅ Input
- ✅ Label
- ✅ Field (FieldGroup, Field, FieldLabel, FieldDescription, FieldSeparator)
- ✅ AudioPlayer (audio-player.tsx)
- ✅ Waveform
- ✅ Sidebar
- ✅ DropdownMenu

### Services Implémentés

#### 1. **AuthContext**
- ✅ Gestion de l'état d'authentification
- ✅ Fonctions login/register/logout
- ✅ Persistance du token (localStorage)
- ✅ Vérification automatique au chargement
- ✅ Protection des routes

#### 2. **api.ts**
- ✅ Service API de base
- ✅ Configuration des headers
- ✅ Gestion des tokens JWT
- ✅ Fonctions utilitaires pour les requêtes

#### 3. **auth.ts**
- ✅ Service d'authentification
- ✅ Endpoints login/register
- ✅ Gestion des erreurs

### Design System

- ✅ **Tailwind CSS** configuré
- ✅ **shadcn/ui** intégré
- ✅ **Dark mode** supporté (via CSS variables)
- ✅ **Responsive design** (mobile-first)
- ✅ **Thème cohérent** (couleurs, typographie, espacements)

## 🎨 Design & UX

### Style Apple-like

- **Player arrondi** : `rounded-full` sur le MusicPlayer
- **Interface épurée** : Design minimaliste et moderne
- **Waveform interactive** : Navigation tactile dans les tracks
- **Animations fluides** : Transitions douces

### Composants Stylisés

- **Cards** : Ombres et bordures subtiles
- **Buttons** : Variants (default, outline, ghost)
- **Inputs** : Focus states et validation visuelle
- **Player** : Design compact et élégant

## 🚀 Roadmap - Fonctionnalités à Implémenter

### Phase 1 : V1 - Finalisation (En cours)

#### 1.1 Pages Manquantes
- [ ] Page Profile (`/profile`)
  - [ ] Header avec avatar, bio, stats
  - [ ] Liste des tracks publiées
  - [ ] Liste des projets/EPs
  - [ ] Filtres (Tracks, Albums, Playlists)
  - [ ] Actions (Edit profile, Settings)

- [ ] Page Projects (`/projects`)
  - [ ] Liste des projets de l'utilisateur
  - [ ] Création de projet
  - [ ] Édition/suppression de projet
  - [ ] Vue détail d'un projet

- [ ] Page Upload (`/upload`)
  - [ ] Formulaire d'upload de track
  - [ ] Sélection de fichier audio
  - [ ] Prévisualisation audio
  - [ ] Métadonnées (nom, description, projet)
  - [ ] Upload progress

#### 1.2 Composants Manquants
- [ ] **TrackCard** : Carte de présentation d'une track
  - [ ] Artwork/thumbnail
  - [ ] Titre et artiste
  - [ ] Durée et stats (plays, likes)
  - [ ] Actions (play, like, share)

- [ ] **ProjectCard** : Carte de présentation d'un projet
  - [ ] Artwork
  - [ ] Titre et description
  - [ ] Nombre de tracks
  - [ ] Actions

- [ ] **Feed** : Composant de timeline
  - [ ] Liste de tracks récentes
  - [ ] Activité des artistes suivis
  - [ ] Découvertes

- [ ] **ProfileHeader** : En-tête de profil
  - [ ] Avatar et couverture
  - [ ] Nom et bio
  - [ ] Stats (tracks, followers, following)
  - [ ] Boutons d'action (follow, edit)

### Phase 2 : V2 - Social (Feed & Profil)

#### 2.1 Transformation de Home en Feed
- [ ] **Feed Timeline**
  - [ ] Tracks récentes des artistes suivis
  - [ ] Découvertes et recommandations
  - [ ] Activité de la communauté
  - [ ] Filtres (All, Following, Discover)

- [ ] **Système de Follow**
  - [ ] Bouton follow/unfollow
  - [ ] Liste des followers/following
  - [ ] Suggestions de personnes à suivre

#### 2.2 Page Profil Complète
- [ ] **Section Tracks**
  - [ ] Grille/liste de toutes les tracks
  - [ ] Filtres et tri
  - [ ] Stats par track

- [ ] **Section EPs/Albums**
  - [ ] Liste des projets
  - [ ] Vue détail d'un EP
  - [ ] Tracks d'un EP

- [ ] **Section Playlists**
  - [ ] Création de playlist
  - [ ] Gestion des playlists
  - [ ] Partage de playlists

#### 2.3 Interactions Sociales
- [ ] **Likes/Favorites**
  - [ ] Bouton like sur les tracks
  - [ ] Liste des tracks likées
  - [ ] Compteur de likes

- [ ] **Commentaires**
  - [ ] Système de commentaires sur les tracks
  - [ ] Réponses aux commentaires
  - [ ] Mentions (@username)

- [ ] **Reposts**
  - [ ] Bouton repost
  - [ ] Liste des reposts
  - [ ] Attribution

### Phase 3 : V3 - Pages Avancées

#### 3.1 Pages de Détail
- [ ] **Page Track (`/track/:id`)**
  - [ ] Waveform complète
  - [ ] Métadonnées (BPM, key, etc.)
  - [ ] Commentaires
  - [ ] Actions (like, repost, share)
  - [ ] Tracks similaires

- [ ] **Page Project (`/project/:id`)**
  - [ ] Informations du projet
  - [ ] Liste des tracks
  - [ ] Artwork et description
  - [ ] Collaborateurs

- [ ] **Page Discover (`/discover`)**
  - [ ] Exploration par genres
  - [ ] Tracks tendances
  - [ ] Artistes émergents
  - [ ] Filtres avancés

#### 3.2 Recherche
- [ ] **Page Search (`/search`)**
  - [ ] Barre de recherche
  - [ ] Résultats (tracks, artistes, projets)
  - [ ] Filtres par type
  - [ ] Suggestions

### Phase 4 : V4 - Optimisations

#### 4.1 Performance
- [ ] **Lazy Loading**
  - [ ] Code splitting par route
  - [ ] Lazy loading des images
  - [ ] Virtual scrolling pour les listes

- [ ] **Caching**
  - [ ] Cache des données API
  - [ ] Service Worker (PWA)
  - [ ] Offline support

#### 4.2 UX Améliorations
- [ ] **Notifications**
  - [ ] Système de notifications
  - [ ] Notifications en temps réel
  - [ ] Badge de notifications

- [ ] **Animations**
  - [ ] Transitions de pages
  - [ ] Micro-interactions
  - [ ] Loading states

- [ ] **Accessibilité**
  - [ ] ARIA labels
  - [ ] Navigation au clavier
  - [ ] Contraste et lisibilité

#### 4.3 Features Avancées
- [ ] **Playlists**
  - [ ] Création et gestion
  - [ ] Partage de playlists
  - [ ] Playlists collaboratives

- [ ] **Partage Social**
  - [ ] Partage vers réseaux sociaux
  - [ ] Embed codes
  - [ ] Liens de partage

## 📝 Structure des Dossiers

```
frontend/
├── src/
│   ├── pages/              # Pages principales
│   │   ├── Home.tsx        # Feed (à transformer)
│   │   ├── Login.tsx       # ✅ Connexion
│   │   ├── Register.tsx    # ✅ Inscription
│   │   ├── Profile.tsx     # ⏳ Profil utilisateur
│   │   ├── Projects.tsx   # ⏳ Liste projets
│   │   └── Upload.tsx      # ⏳ Upload track
│   ├── components/         # Composants réutilisables
│   │   ├── Layout.tsx      # ✅ Layout principal
│   │   ├── AppSidebar.tsx  # ✅ Sidebar navigation
│   │   ├── MusicPlayer.tsx # ✅ Player audio
│   │   ├── login-form.tsx  # ✅ Formulaire login
│   │   ├── register-form.tsx # ✅ Formulaire register
│   │   └── ui/             # Composants UI (shadcn)
│   ├── contexts/           # Contextes React
│   │   └── AuthContext.tsx # ✅ Authentification
│   ├── services/           # Services API
│   │   ├── api.ts          # ✅ Service API base
│   │   └── auth.ts         # ✅ Service auth
│   ├── lib/                # Utilitaires
│   │   └── utils.ts        # ✅ Helpers
│   ├── App.tsx             # ✅ Composant racine
│   ├── main.tsx            # ✅ Point d'entrée
│   └── index.css           # ✅ Styles globaux
├── public/                 # Assets statiques
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🛠️ Commandes Utiles

```bash
# Démarrer en développement
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🔗 Intégration Backend

### Endpoints Utilisés

- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription
- `GET /users/:id` - Récupération utilisateur
- `GET /projects` - Liste des projets (à implémenter)
- `POST /projects` - Création de projet (à implémenter)
- `GET /tracks` - Liste des tracks (à implémenter)
- `POST /tracks` - Création de track (à implémenter)

### Configuration API

Le service API est configuré dans `src/services/api.ts` avec :
- Base URL depuis les variables d'environnement
- Headers JWT automatiques
- Gestion des erreurs

## 📋 Prochaines Étapes Immédiates

1. **Créer la page Profile** avec header et sections
2. **Créer le composant TrackCard** pour afficher les tracks
3. **Créer la page Projects** avec liste et CRUD
4. **Créer la page Upload** pour uploader des tracks
5. **Transformer Home en Feed** avec timeline d'activité
6. **Implémenter le système de follow** (backend + frontend)

## 🎯 Objectif V2

Transformer l'application en une plateforme sociale type SoundCloud où :
- **Home** = Feed de l'utilisateur avec activité musicale
- **Profil** = Nos EPs, nos tracks avec stats et interactions
- **Découverte** = Exploration et recommandations
- **Social** = Follow, likes, commentaires, partage

---

**Dernière mise à jour :** Décembre 2024  
**Version :** V1.0 (Base) → V2.0 (Social) en préparation

