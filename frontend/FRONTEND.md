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

## ✅ État Actuel - Version 2.1 (Phase 2 Social + Notifications)

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
- ✅ **Feed utilisateur** avec tracks des artistes suivis
- ✅ Affichage conditionnel selon l'état d'authentification
- ✅ Dialog de connexion automatique si non connecté
- ✅ Actions like/unlike sur les tracks
- ✅ Compteurs de likes et commentaires
- ✅ Informations auteur (nom, avatar, projet)

#### 2. **Login (`/login`)**
- ✅ Formulaire de connexion moderne (LoginForm)
- ✅ Design avec image à droite
- ✅ Intégration avec AuthContext
- ✅ Gestion des erreurs
- ✅ Redirection après connexion
- ✅ Lien vers inscription

#### 3. **Register (`/register`)**
- ✅ Formulaire d'inscription moderne (RegisterForm)
- ✅ Design avec image à droite (même style que Login)
- ✅ Champ nom optionnel
- ✅ Intégration avec AuthContext
- ✅ Gestion des erreurs
- ✅ Redirection après inscription
- ✅ Lien vers connexion

#### 4. **Profile (`/profile/:id`)**
- ✅ Page profil utilisateur complète
- ✅ Header avec avatar, nom, username, bio
- ✅ Statistiques (followers, following, tracks, likes, commentaires)
- ✅ Liste des projets avec leurs tracks
- ✅ Stats par projet (tracks, likes, commentaires)
- ✅ Bouton Follow/Unfollow
- ✅ Navigation depuis la sidebar

### Composants Implémentés

#### 1. **Layout**
- ✅ Layout principal avec sidebar
- ✅ Navigation entre pages
- ✅ Gestion de l'authentification dans la sidebar

#### 2. **AppSidebar / FloatingNav**
- ✅ Navigation principale (floating navbar)
- ✅ Recherche intégrée
- ✅ Menu utilisateur
- ✅ Déconnexion
- ✅ Design responsive

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
- ✅ Dialog (modal/popover)

#### 7. **Services API**
- ✅ projects.ts - Service pour gérer les projets
- ✅ tracks.ts - Service pour gérer les tracks
- ✅ files.ts - Service pour l'upload/download de fichiers

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

#### 4. **feed.ts**
- ✅ Service pour récupérer le feed
- ✅ Pagination (limit, offset)
- ✅ Types FeedTrack et FeedResponse

#### 5. **follows.ts**
- ✅ Service pour follow/unfollow
- ✅ Récupération des followers/following
- ✅ Vérification du statut de suivi

#### 6. **likes.ts**
- ✅ Service pour liker/unliker
- ✅ Récupération des likes
- ✅ Comptage des likes

#### 7. **comments.ts**
- ✅ Service pour commenter
- ✅ CRUD commentaires (create, update, delete)
- ✅ Récupération des commentaires par track

#### 8. **users.ts**
- ✅ Service pour récupérer le profil utilisateur
- ✅ Types UserProfile avec stats complètes

#### 9. **projects.ts**
- ✅ Service pour CRUD projets
- ✅ Récupération des projets de l'utilisateur

#### 10. **tracks.ts**
- ✅ Service pour CRUD tracks
- ✅ Récupération des tracks par projet

#### 11. **files.ts**
- ✅ Service pour upload de fichiers audio
- ✅ Service pour téléchargement de fichiers

#### 12. **search.ts**
- ✅ Service pour recherche globale
- ✅ Service pour recherche par type (users, tracks, projects)
- ✅ Types SearchResult, SearchUser, SearchTrack, SearchProject

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

### Phase 1 : V1 - Base (✅ Terminée)
- [x] Authentification (login/register)
- [x] Design system (shadcn/ui)
- [x] Music player avec waveform
- [x] Layout et navigation
- [x] CRUD Projects
- [x] CRUD Tracks
- [x] Upload de fichiers audio
- [x] Module Files (upload/download)
- [x] Page Projects (`/projects`)
- [x] Page Upload (`/upload`)

### Phase 2 : V2 - Social (Feed & Profil) (✅ Terminée)

#### 2.1 Transformation de Home en Feed
- [x] **Feed Timeline**
  - [x] Tracks récentes des artistes suivis
  - [x] Pagination (limit, offset)
  - [x] Stats par track (likes, commentaires)
  - [ ] Découvertes et recommandations
  - [ ] Filtres (All, Following, Discover)

- [x] **Système de Follow**
  - [x] Bouton follow/unfollow
  - [x] Liste des followers/following
  - [x] Vérification du statut de suivi
  - [ ] Suggestions de personnes à suivre

#### 2.2 Page Profil Complète
- [x] **Section Tracks**
  - [x] Liste de toutes les tracks par projet
  - [x] Stats par track
  - [ ] Filtres et tri

- [x] **Section EPs/Albums**
  - [x] Liste des projets avec stats
  - [x] Tracks d'un projet
  - [ ] Vue détail d'un EP

- [ ] **Section Playlists**
  - [ ] Création de playlist
  - [ ] Gestion des playlists
  - [ ] Partage de playlists

#### 2.3 Interactions Sociales
- [x] **Likes/Favorites**
  - [x] Bouton like sur les tracks
  - [x] Compteur de likes
  - [x] Vérification si track likée
  - [ ] Liste des tracks likées

- [x] **Commentaires**
  - [x] Système de commentaires sur les tracks
  - [x] CRUD commentaires (create, update, delete)
  - [x] Comptage des commentaires
  - [x] Dialog de commentaires avec shadcn/ui ✅
  - [ ] Réponses aux commentaires
  - [ ] Mentions (@username)

- [ ] **Reposts**
  - [ ] Bouton repost
  - [ ] Liste des reposts
  - [ ] Attribution

#### 2.4 Recherche et Navigation
- [x] **Page Search (`/search`)**
  - [x] Barre de recherche avec debounce
  - [x] Résultats par tabs (Tout, Artistes, Tracks, Projets)
  - [x] Affichage des résultats avec cards
  - [x] Intégration avec backend de recherche ✅

- [x] **Navbar Flottante**
  - [x] Navigation principale flottante
  - [x] Recherche intégrée dans la navbar
  - [x] Design responsive (icônes mobile, texte desktop)
  - [x] Affichage/masquage au scroll ✅

### Phase 3 : V3 - Avancé (À venir)

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
- [x] **Page Search (`/search`)** ✅ Terminé
  - [x] Barre de recherche
  - [x] Résultats (tracks, artistes, projets)
  - [x] Filtres par type (tabs)
  - [ ] Suggestions (à venir)

### Phase 4 : V4 - Production (À venir)

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
- [x] **Notifications** ✅
  - [x] Système de notifications (service, context)
  - [x] Notifications en temps réel (polling automatique)
  - [x] Badge de notifications dans la navbar
  - [x] Popover avec liste des notifications
  - [x] Marquage comme lu / tout marquer comme lu
  - [x] Types : LIKE, COMMENT, FOLLOW

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
│   │   ├── Home.tsx        # ✅ Feed utilisateur
│   │   ├── Login.tsx       # ✅ Connexion
│   │   ├── Register.tsx    # ✅ Inscription
│   │   ├── Profile.tsx     # ✅ Profil utilisateur
│   │   ├── Projects.tsx    # ✅ Liste projets
│   │   └── Upload.tsx      # ✅ Upload track
│   ├── components/         # Composants réutilisables
│   │   ├── Layout.tsx      # ✅ Layout principal
│   │   ├── AppSidebar.tsx  # ✅ Sidebar navigation
│   │   ├── MusicPlayer.tsx # ✅ Player audio
│   │   ├── login-form.tsx  # ✅ Formulaire login (avec image)
│   │   ├── register-form.tsx # ✅ Formulaire register (avec image)
│   │   └── ui/             # Composants UI (shadcn)
│   │       └── dialog.tsx  # ✅ Dialog/Modal
│   ├── contexts/           # Contextes React
│   │   └── AuthContext.tsx # ✅ Authentification
│   ├── services/           # Services API
│   │   ├── api.ts          # ✅ Service API base
│   │   ├── auth.ts         # ✅ Service auth
│   │   ├── feed.ts         # ✅ Service feed
│   │   ├── follows.ts      # ✅ Service follows
│   │   ├── likes.ts        # ✅ Service likes
│   │   ├── comments.ts     # ✅ Service comments
│   │   ├── users.ts        # ✅ Service users
│   │   ├── projects.ts     # ✅ Service projects
│   │   ├── tracks.ts       # ✅ Service tracks
│   │   └── files.ts        # ✅ Service files
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

**Authentification :**
- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription

**Utilisateurs :**
- `GET /users/:id` - Récupération utilisateur
- `GET /users/:id/profile` - Profil complet avec stats

**Projets :**
- `GET /projects` - Liste des projets
- `POST /projects` - Création de projet
- `PUT /projects/:id` - Modification de projet
- `DELETE /projects/:id` - Suppression de projet

**Tracks :**
- `GET /tracks` - Liste des tracks
- `POST /tracks` - Création de track
- `DELETE /tracks/:id` - Suppression de track

**Fichiers :**
- `POST /files/upload` - Upload de fichier audio
- `GET /files/:id/download` - Téléchargement de fichier

**Social :**
- `POST /follows/:userId` - Suivre un utilisateur
- `DELETE /follows/:userId` - Ne plus suivre
- `GET /follows/:userId/status` - Statut de suivi
- `GET /follows/:userId/followers` - Liste des followers
- `GET /follows/:userId/following` - Liste des following
- `POST /likes/:trackId` - Liker une track
- `DELETE /likes/:trackId` - Unliker
- `GET /likes/:trackId/status` - Statut de like
- `GET /likes/:trackId/count` - Nombre de likes
- `POST /comments` - Créer un commentaire
- `PUT /comments/:id` - Modifier un commentaire
- `DELETE /comments/:id` - Supprimer un commentaire
- `GET /comments/track/:trackId` - Commentaires d'une track
- `GET /feed` - Feed des tracks des utilisateurs suivis

### Configuration API

Le service API est configuré dans `src/services/api.ts` avec :
- Base URL depuis les variables d'environnement
- Headers JWT automatiques
- Gestion des erreurs

## 📋 Prochaines Étapes Immédiates

1. ~~**Composants UI pour commentaires**~~ ✅ Terminé - Dialog de commentaires avec shadcn/ui
2. ~~**Recherche**~~ ✅ Terminé - Page de recherche complète avec tabs
3. ~~**Navbar flottante**~~ ✅ Terminé - Navigation flottante avec recherche intégrée
4. ~~**Notifications** - Système de notifications pour likes/commentaires~~ ✅ Terminé
5. **Améliorations Feed** - Pagination infinie, filtres
6. **Améliorations Profile** - Édition du profil, statistiques détaillées

## 🎯 Objectif V2

Transformer l'application en une plateforme sociale type SoundCloud où :
- **Home** = Feed de l'utilisateur avec activité musicale
- **Profil** = Nos EPs, nos tracks avec stats et interactions
- **Découverte** = Exploration et recommandations
- **Social** = Follow, likes, commentaires, partage

---

**Dernière mise à jour :** Décembre 2024  
**Version :** V2.0 (Social) - Phase 2 terminée

