# Backend - Documentation

## 📋 Contexte du Projet

**Armed App** est un gestionnaire de projets pour artistes musicaux. L'application permet de :
- Créer et gérer des projets musicaux
- Ajouter et organiser des tracks/stems audio
- Écouter les fichiers audio via l'application
- Référencer des projets DAW (Ableton, Logic, etc.) pour les lancer depuis l'app
- Gérer un compte utilisateur avec authentification

## 🏗️ Architecture

- **Framework** : NestJS (Node.js)
- **Base de données** : PostgreSQL
- **ORM** : TypeORM
- **Authentification** : JWT (JSON Web Tokens)
- **Port** : 3000 (par défaut)

## ✅ État Actuel - Version 2.0 (Phase 2 Social)

### Infrastructure

- ✅ NestJS configuré et fonctionnel
- ✅ PostgreSQL connecté et configuré
- ✅ TypeORM intégré avec synchronisation automatique
- ✅ Variables d'environnement configurées (`.env`)
- ✅ CORS activé pour la communication avec Electron

### Modules Implémentés

#### 1. **AuthModule** - Authentification
- ✅ Inscription (`POST /auth/register`)
- ✅ Connexion (`POST /auth/login`)
- ✅ JWT Strategy configurée
- ✅ Guards JWT pour protéger les endpoints
- ✅ Hashage des mots de passe avec bcrypt

**Endpoints :**
```
POST /auth/register
Body: { email, password, name? }
Response: { access_token, user }

POST /auth/login
Body: { email, password }
Response: { access_token, user }
```

#### 2. **UsersModule** - Gestion des Utilisateurs
- ✅ Création d'utilisateur
- ✅ Recherche par email
- ✅ Recherche par ID
- ✅ Profil utilisateur complet avec statistiques

**Endpoints :**
```
POST /users
Body: { email, password, name? }
Response: User

GET /users/:id
Response: User

GET /users/:id/profile
Headers: Authorization: Bearer <token>
Response: {
  user: User,
  stats: { followers, following, tracks, likes, comments },
  projects: Project[],
  isFollowing: boolean,
  isOwnProfile: boolean
}
```

#### 3. **ProjectsModule** - Gestion des Projets
- ✅ Création de projet (protégé par JWT)
- ✅ Liste des projets par utilisateur (protégé par JWT)
- ✅ Récupération d'un projet (protégé par JWT)
- ✅ Mise à jour d'un projet (protégé par JWT)
- ✅ Suppression d'un projet (protégé par JWT)

**Endpoints :**
```
POST /projects
Headers: Authorization: Bearer <token>
Body: { name, description?, dawType?, dawProjectPath? }
Response: Project

GET /projects
Headers: Authorization: Bearer <token>
Response: Project[]

GET /projects/:id
Headers: Authorization: Bearer <token>
Response: Project

PUT /projects/:id
Headers: Authorization: Bearer <token>
Body: Partial<Project>
Response: Project

DELETE /projects/:id
Headers: Authorization: Bearer <token>
Response: void
```

#### 4. **TracksModule** - Gestion des Tracks/Stems
- ✅ Création de track (protégé par JWT)
- ✅ Liste des tracks par projet (protégé par JWT)
- ✅ Récupération d'un track (protégé par JWT)
- ✅ Suppression d'un track (protégé par JWT)

**Endpoints :**
```
POST /tracks
Headers: Authorization: Bearer <token>
Body: { name, projectId, filename, filePath, duration?, fileSize? }
Response: Track

GET /tracks?projectId=<id>
Headers: Authorization: Bearer <token>
Response: Track[]

GET /tracks/:id
Headers: Authorization: Bearer <token>
Response: Track

DELETE /tracks/:id
Headers: Authorization: Bearer <token>
Response: void
```

#### 5. **FilesModule** - Gestion des Fichiers
- ✅ Upload de fichiers audio (protégé par JWT)
- ✅ Validation des types de fichiers (MP3, WAV, etc.)
- ✅ Stockage organisé par projet
- ✅ Création automatique de track après upload
- ✅ Téléchargement de fichiers
- ✅ Suppression de fichiers

**Endpoints :**
```
POST /files/upload
Headers: Authorization: Bearer <token>
Body: FormData { file, projectId, name }
Response: { track: Track, file: FileInfo }

GET /files/:id/download
Headers: Authorization: Bearer <token>
Response: File stream

DELETE /files/:id
Headers: Authorization: Bearer <token>
Response: void
```

#### 6. **FollowsModule** - Système de Suivi
- ✅ Follow/Unfollow utilisateurs (protégé par JWT)
- ✅ Vérification du statut de suivi
- ✅ Liste des followers
- ✅ Liste des following

**Endpoints :**
```
POST /follows/:userId
Headers: Authorization: Bearer <token>
Response: Follow

DELETE /follows/:userId
Headers: Authorization: Bearer <token>
Response: { message: string }

GET /follows/:userId/status
Headers: Authorization: Bearer <token>
Response: { isFollowing: boolean }

GET /follows/:userId/followers
Headers: Authorization: Bearer <token>
Response: Follow[]

GET /follows/:userId/following
Headers: Authorization: Bearer <token>
Response: Follow[]
```

#### 7. **LikesModule** - Système de Likes
- ✅ Like/Unlike tracks (protégé par JWT)
- ✅ Vérification du statut de like
- ✅ Comptage des likes
- ✅ Liste des likes par track

**Endpoints :**
```
POST /likes/:trackId
Headers: Authorization: Bearer <token>
Response: Like

DELETE /likes/:trackId
Headers: Authorization: Bearer <token>
Response: { message: string }

GET /likes/:trackId/status
Headers: Authorization: Bearer <token>
Response: { isLiked: boolean }

GET /likes/:trackId
Response: Like[]

GET /likes/:trackId/count
Response: { count: number }
```

#### 8. **CommentsModule** - Système de Commentaires
- ✅ Création de commentaire (protégé par JWT)
- ✅ Modification de commentaire (vérification propriétaire)
- ✅ Suppression de commentaire (vérification propriétaire)
- ✅ Liste des commentaires par track
- ✅ Comptage des commentaires

**Endpoints :**
```
POST /comments
Headers: Authorization: Bearer <token>
Body: { trackId, content }
Response: Comment

PUT /comments/:id
Headers: Authorization: Bearer <token>
Body: { content }
Response: Comment

DELETE /comments/:id
Headers: Authorization: Bearer <token>
Response: { message: string }

GET /comments/track/:trackId
Response: Comment[]

GET /comments/:id
Response: Comment

GET /comments/track/:trackId/count
Response: { count: number }
```

#### 9. **FeedModule** - Feed Utilisateur
- ✅ Feed des tracks des utilisateurs suivis (protégé par JWT)
- ✅ Pagination (limit, offset)
- ✅ Stats par track (likes, commentaires, isLiked)

**Endpoints :**
```
GET /feed?limit=20&offset=0
Headers: Authorization: Bearer <token>
Response: {
  tracks: Track[],
  total: number,
  hasMore: boolean
}
```

### Modèles de Données (Entités)

#### User
```typescript
{
  id: string (UUID)
  email: string (unique)
  password: string (hashé)
  name: string (nullable)
  username: string (nullable, unique)
  avatar: string (nullable)
  bio: string (nullable)
  createdAt: Date
}
```

#### Project
```typescript
{
  id: string (UUID)
  name: string
  description: string (nullable)
  dawType: string (nullable) // 'ableton', 'logic', etc.
  dawProjectPath: string (nullable) // chemin vers le projet DAW
  userId: string (FK vers User)
  createdAt: Date
  tracks: Track[] (relation)
}
```

#### Track
```typescript
{
  id: string (UUID)
  name: string
  fileName: string
  filePath: string // chemin local du fichier
  duration: number (nullable) // en secondes
  fileSize: number (nullable) // en bytes
  projectId: string (FK vers Project)
  createdAt: Date
}
```

#### Follow
```typescript
{
  id: string (UUID)
  followerId: string (FK vers User)
  followingId: string (FK vers User)
  createdAt: Date
}
```

#### Like
```typescript
{
  id: string (UUID)
  userId: string (FK vers User)
  trackId: string (FK vers Track)
  createdAt: Date
}
```

#### Comment
```typescript
{
  id: string (UUID)
  userId: string (FK vers User)
  trackId: string (FK vers Track)
  content: string (text)
  createdAt: Date
  updatedAt: Date
}
```

### Configuration

**Fichier `.env` :**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tripleseptinteractive
DB_PASSWORD=
DB_DATABASE=armed_app_db
JWT_SECRET=ton-secret-super-securise-change-en-production
```

**⚠️ Important :** 
- `synchronize: true` est activé en développement (à mettre à `false` en production)
- Le `JWT_SECRET` doit être changé en production
- Le mot de passe de la DB peut être vide en développement local

## 🚀 Roadmap - Fonctionnalités à Implémenter

### Phase 1 : Upload et Gestion de Fichiers (✅ Terminée)

#### 1.1 Module Files
- [x] Créer `FilesModule` pour gérer l'upload de fichiers
- [x] Endpoint `POST /files/upload` pour uploader des fichiers audio
- [x] Validation des types de fichiers (WAV, MP3, AIFF, FLAC, etc.)
- [x] Stockage local des fichiers dans `storage/projects/{projectId}/tracks/`
- [x] Génération automatique des métadonnées (duration, fileSize)
- [x] Endpoint `GET /files/:id/download` pour télécharger un fichier
- [x] Endpoint `DELETE /files/:id` pour supprimer un fichier

#### 1.2 Intégration avec Tracks
- [x] Lier l'upload de fichier à la création de track
- [x] Mise à jour automatique du `filePath` lors de l'upload
- [x] Extraction des métadonnées audio (durée, bitrate, etc.)

### Phase 2 : Social (✅ Terminée)

#### 2.1 Entités Sociales
- [x] Entité Follow (relations de suivi)
- [x] Entité Like (likes sur tracks)
- [x] Entité Comment (commentaires sur tracks)
- [x] Enrichissement de l'entité User (username, avatar, bio)

#### 2.2 Modules Sociaux
- [x] FollowsModule (follow/unfollow)
- [x] LikesModule (like/unlike)
- [x] CommentsModule (CRUD commentaires)
- [x] FeedModule (feed des utilisateurs suivis)

### Phase 3 : Amélioration de l'Authentification

- [ ] Refresh tokens pour renouveler les tokens JWT
- [ ] Endpoint de déconnexion
- [ ] Gestion des sessions utilisateur
- [ ] Validation d'email (optionnel)
- [ ] Réinitialisation de mot de passe
- [ ] OAuth (Google, etc.) - optionnel

### Phase 4 : Fonctionnalités Avancées

#### 3.1 Gestion de Projets
- [ ] Duplication de projet
- [ ] Export/Import de projet
- [ ] Partage de projet entre utilisateurs (collaboration)
- [ ] Tags/Catégories pour les projets
- [ ] Recherche et filtres avancés

#### 3.2 Gestion de Tracks
- [ ] Réorganisation des tracks (drag & drop)
- [ ] Métadonnées audio enrichies (BPM, key, etc.)
- [ ] Prévisualisation audio (waveform)
- [ ] Conversion de formats audio
- [ ] Compression/optimisation des fichiers

#### 3.3 Intégration DAW
- [ ] Module `DawModule` pour gérer les intégrations DAW
- [ ] Détection automatique des DAW installés
- [ ] Endpoint pour lister les DAW disponibles
- [ ] Endpoint pour lancer un projet DAW depuis l'app
- [ ] Support pour Ableton Live (.als)
- [ ] Support pour Logic Pro (.logicx)
- [ ] Support pour Pro Tools (.ptx)
- [ ] Support pour Reaper (.rpp)

### Phase 5 : Performance et Optimisation

- [ ] Pagination pour les listes (projects, tracks)
- [ ] Cache pour les requêtes fréquentes
- [ ] Optimisation des requêtes SQL
- [ ] Compression des réponses API
- [ ] Rate limiting pour protéger l'API
- [ ] Logging structuré (Winston, Pino)
- [ ] Monitoring et métriques (Prometheus)

### Phase 6 : Sécurité et Production

- [ ] Validation des entrées avec class-validator
- [ ] DTOs (Data Transfer Objects) pour toutes les entrées
- [ ] Gestion des erreurs centralisée
- [ ] Tests unitaires et d'intégration
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Migration de base de données (migrations TypeORM)
- [ ] Configuration pour différents environnements (dev, staging, prod)
- [ ] Backup automatique de la base de données
- [ ] HTTPS en production

### Phase 7 : Fonctionnalités Collaboratives (Optionnel)

- [ ] Système de permissions (owner, collaborator, viewer)
- [ ] Commentaires sur les projets/tracks
- [ ] Notifications en temps réel
- [ ] Historique des modifications
- [ ] Versioning des projets

## 📝 Notes Techniques

### Structure des Dossiers
```
backend/
├── src/
│   ├── auth/           # Module d'authentification
│   ├── users/          # Module utilisateurs
│   ├── projects/       # Module projets
│   ├── tracks/         # Module tracks
│   ├── files/          # Module fichiers (upload/download)
│   ├── follows/        # Module follow/unfollow
│   ├── likes/          # Module likes
│   ├── comments/       # Module commentaires
│   ├── feed/           # Module feed
│   ├── entities/       # Entités TypeORM
│   ├── config/         # Configuration
│   └── main.ts         # Point d'entrée
├── storage/            # Stockage des fichiers
│   └── projects/       # Fichiers organisés par projet
├── .env                # Variables d'environnement
└── package.json
```

### Commandes Utiles

```bash
# Démarrer en développement
npm run start:dev

# Build pour production
npm run build

# Démarrer en production
npm run start:prod

# Tests
npm run test
npm run test:watch
npm run test:e2e

# Linting
npm run lint
```

### Prochaines Étapes Immédiates

1. **Recherche** - Endpoints de recherche d'utilisateurs/tracks
2. **Notifications** - Système de notifications pour likes/commentaires
3. **Améliorations Feed** - Filtres, recommandations
4. **DTOs** - Validation des entrées avec class-validator
5. **Gestion d'erreurs centralisée** - Exception filters

## 🔗 Liens Utiles

- [Documentation NestJS](https://docs.nestjs.com/)
- [Documentation TypeORM](https://typeorm.io/)
- [Documentation Passport JWT](https://github.com/mikenicholson/passport-jwt)

---

**Dernière mise à jour :** Décembre 2024  
**Version :** 2.0.0 - Phase 2 Social terminée

## 📝 État Actuel du Projet

### Phase 1 (V1) — ✅ Terminée
- Authentification (JWT)
- CRUD Projects
- CRUD Tracks
- Module Files (upload/download)
- Gestion des utilisateurs

### Phase 2 (V2 Social) — ✅ Terminée
- Entités sociales (Follow, Like, Comment)
- Enrichissement User (username, avatar, bio)
- FollowsModule (follow/unfollow)
- LikesModule (like/unlike)
- CommentsModule (CRUD commentaires)
- FeedModule (feed des utilisateurs suivis)
- Endpoint profil utilisateur avec stats

### Prochaines Étapes
1. Recherche d'utilisateurs/tracks
2. Notifications
3. Améliorations Feed (filtres, recommandations)
4. DTOs et validation (class-validator)
5. Gestion d'erreurs centralisée

