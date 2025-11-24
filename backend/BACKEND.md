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

## ✅ État Actuel - Version 1.0

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

**Endpoints :**
```
POST /users
Body: { email, password, name? }
Response: User

GET /users/:id
Response: User
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

### Modèles de Données (Entités)

#### User
```typescript
{
  id: string (UUID)
  email: string (unique)
  password: string (hashé)
  name: string (nullable)
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
  filename: string
  filePath: string // chemin local du fichier
  duration: number (nullable) // en secondes
  fileSize: number (nullable) // en bytes
  projectId: string (FK vers Project)
  createdAt: Date
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

### Phase 1 : Upload et Gestion de Fichiers

#### 1.1 Module Files
- [ ] Créer `FilesModule` pour gérer l'upload de fichiers
- [ ] Endpoint `POST /files/upload` pour uploader des fichiers audio
- [ ] Validation des types de fichiers (WAV, MP3, AIFF, FLAC, etc.)
- [ ] Stockage local des fichiers dans `storage/projects/{projectId}/tracks/`
- [ ] Génération automatique des métadonnées (duration, fileSize)
- [ ] Endpoint `GET /files/:id/download` pour télécharger un fichier
- [ ] Endpoint `DELETE /files/:id` pour supprimer un fichier

#### 1.2 Intégration avec Tracks
- [ ] Lier l'upload de fichier à la création de track
- [ ] Mise à jour automatique du `filePath` lors de l'upload
- [ ] Extraction des métadonnées audio (durée, bitrate, etc.)

### Phase 2 : Amélioration de l'Authentification

- [ ] Refresh tokens pour renouveler les tokens JWT
- [ ] Endpoint de déconnexion
- [ ] Gestion des sessions utilisateur
- [ ] Validation d'email (optionnel)
- [ ] Réinitialisation de mot de passe
- [ ] OAuth (Google, etc.) - optionnel

### Phase 3 : Fonctionnalités Avancées

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

### Phase 4 : Performance et Optimisation

- [ ] Pagination pour les listes (projects, tracks)
- [ ] Cache pour les requêtes fréquentes
- [ ] Optimisation des requêtes SQL
- [ ] Compression des réponses API
- [ ] Rate limiting pour protéger l'API
- [ ] Logging structuré (Winston, Pino)
- [ ] Monitoring et métriques (Prometheus)

### Phase 5 : Sécurité et Production

- [ ] Validation des entrées avec class-validator
- [ ] DTOs (Data Transfer Objects) pour toutes les entrées
- [ ] Gestion des erreurs centralisée
- [ ] Tests unitaires et d'intégration
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Migration de base de données (migrations TypeORM)
- [ ] Configuration pour différents environnements (dev, staging, prod)
- [ ] Backup automatique de la base de données
- [ ] HTTPS en production

### Phase 6 : Fonctionnalités Collaboratives (Optionnel)

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
│   ├── tracks/          # Module tracks
│   ├── entities/       # Entités TypeORM
│   ├── config/         # Configuration
│   └── main.ts         # Point d'entrée
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

1. **Créer le module Files** pour l'upload de fichiers
2. **Implémenter l'upload de fichiers audio** avec validation
3. **Intégrer l'upload avec la création de tracks**
4. **Créer les DTOs** pour valider les entrées
5. **Ajouter la gestion d'erreurs centralisée**

## 🔗 Liens Utiles

- [Documentation NestJS](https://docs.nestjs.com/)
- [Documentation TypeORM](https://typeorm.io/)
- [Documentation Passport JWT](https://github.com/mikenicholson/passport-jwt)

---

**Dernière mise à jour :** 24 novembre 2025  
**Version :** 1.0.0

