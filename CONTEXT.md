# Armed App - Contexte Général

## 🎵 Vision du Projet

**Armed App** est une plateforme de gestion et de partage de projets musicaux, inspirée de **SoundCloud**, conçue pour les artistes et producteurs musicaux. L'application combine la gestion de projets DAW (Digital Audio Workstation) avec un système de streaming et de partage social.

### Concept Principal

L'application permet aux artistes de :
- **Gérer leurs projets musicaux** (EPs, albums, tracks)
- **Partager et découvrir** de la musique (feed social)
- **Organiser leurs fichiers audio** et projets DAW
- **Écouter et prévisualiser** leurs créations
- **Collaborer** avec d'autres artistes

## 🏗️ Architecture Globale

### Stack Technique

- **Frontend** : React + TypeScript + Vite
- **Backend** : NestJS + TypeScript
- **Desktop** : Electron (application native)
- **Base de données** : PostgreSQL
- **ORM** : TypeORM
- **Authentification** : JWT
- **Design System** : shadcn/ui + Tailwind CSS

### Structure Monorepo

```
armedApp/
├── frontend/          # Application React (web + Electron)
├── backend/          # API NestJS
├── electron/         # Configuration Electron
└── shared/           # Code partagé (futur)
```

## 🎯 Modèle SoundCloud-like

### Structure des Pages

#### **Home (`/`) = Feed de l'Utilisateur**
- Timeline d'activité musicale
- Tracks récemment ajoutées par les artistes suivis
- Découvertes et recommandations
- Posts/updates des projets suivis
- Nouveautés de la communauté

#### **Profil (`/profile` ou `/@username`) = Nos EP, Nos Tracks**
- **Section Tracks** : Liste de toutes les tracks publiées
- **Section EPs/Albums** : Projets et collections
- **Stats** : Plays, likes, followers, following
- **Bio** : Description, avatar, couverture
- **Filtres** : Tracks, Albums, Playlists, Likes, Reposts
- **Activité** : Historique des actions

#### **Autres Pages Clés**
- `/discover` : Exploration et découverte de nouveaux artistes
- `/upload` : Upload de tracks et création de projets
- `/project/:id` : Page détail d'un projet/EP
- `/track/:id` : Page détail d'une track (waveform, commentaires, stats)
- `/search` : Recherche d'artistes, tracks, projets

### Fonctionnalités Sociales

- **Follow/Unfollow** : Suivre des artistes
- **Likes/Favorites** : Ajouter des tracks aux favoris
- **Reposts** : Partager des tracks
- **Commentaires** : Commenter sur les tracks
- **Playlists** : Créer et partager des playlists
- **Partage** : Partager vers les réseaux sociaux

## 📊 Modèle de Données

### Entités Principales

#### User (Artiste)
- Informations de profil (nom, email, bio, avatar)
- Statistiques (followers, following, tracks count)
- Paramètres et préférences

#### Project (EP/Album)
- Métadonnées (nom, description, artwork)
- Référence vers projet DAW (Ableton, Logic, etc.)
- Tracks associées
- Propriétaire et collaborateurs

#### Track
- Fichier audio (WAV, MP3, FLAC, etc.)
- Métadonnées (durée, waveform, BPM, key)
- Statistiques (plays, likes, reposts)
- Commentaires et interactions

### Relations

```
User
  ├── Projects (1:N)
  │     └── Tracks (1:N)
  ├── Followers (N:N)
  ├── Following (N:N)
  └── Likes (N:N) → Tracks
```

## 🎨 Design & UX

### Principes de Design

- **Style Apple-like** : Interface épurée et moderne
- **Player global** : Music player fixe en bas de l'écran
- **Waveform interactive** : Visualisation et navigation dans les tracks
- **Dark/Light mode** : Support du thème sombre
- **Responsive** : Mobile-first, adaptatif desktop

### Composants Clés

- **MusicPlayer** : Player global avec waveform et contrôles
- **Sidebar** : Navigation principale
- **Feed** : Timeline d'activité
- **TrackCard** : Carte de présentation d'une track
- **ProfileHeader** : En-tête de profil avec stats

## 🚀 Roadmap Générale

### Phase 1 : V1 - Base (✅ En cours)
- [x] Authentification (login/register)
- [x] Design system (shadcn/ui)
- [x] Music player avec waveform
- [x] Layout et navigation
- [ ] CRUD Projects
- [ ] CRUD Tracks
- [ ] Upload de fichiers audio

### Phase 2 : V2 - Social (Feed & Profil)
- [ ] Page Home = Feed utilisateur
- [ ] Page Profil avec tracks/EPs
- [ ] Système de follow/unfollow
- [ ] Likes et favorites
- [ ] Commentaires sur tracks
- [ ] Recherche et découverte

### Phase 3 : V3 - Avancé
- [ ] Playlists
- [ ] Partage social
- [ ] Notifications
- [ ] Collaboration (multi-utilisateurs sur projets)
- [ ] Intégration DAW (lancement de projets)

### Phase 4 : V4 - Production
- [ ] Optimisations performance
- [ ] Tests complets
- [ ] Documentation API
- [ ] Déploiement
- [ ] Monitoring et analytics

## 📁 Organisation du Code

### Frontend
- `src/pages/` : Pages principales (Home, Login, Register, Profile, etc.)
- `src/components/` : Composants réutilisables
- `src/services/` : Services API et logique métier
- `src/contexts/` : Contextes React (Auth, etc.)
- `src/lib/` : Utilitaires et helpers

### Backend
- `src/modules/` : Modules NestJS (auth, users, projects, tracks)
- `src/entities/` : Entités TypeORM
- `src/config/` : Configuration
- `src/guards/` : Guards d'authentification

## 🔗 Liens Utiles

- [Documentation Backend](./backend/BACKEND.md)
- [Documentation Frontend](./frontend/FRONTEND.md)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Electron Documentation](https://www.electronjs.org/)

---

**Dernière mise à jour :** Décembre 2024  
**Version actuelle :** V1.0 (Frontend) - V1.0 (Backend)

