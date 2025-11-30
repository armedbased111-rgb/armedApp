# Scripts de Test

Ce dossier contient les scripts de test pour le système de notifications et autres fonctionnalités.

## Scripts disponibles

### Tests de notifications

- **`test-notifications.sh`** : Test général des notifications (nécessite un token valide)
- **`test-notifications-hidn.sh`** : Test avec deux comptes (HIDN et ZXRAN)
- **`test-comment-notification.sh`** : Test spécifique pour les notifications de commentaires
- **`test-like-notification.sh`** : Test spécifique pour les notifications de likes
- **`test-notifications-other-user.sh`** : Guide pour tester avec deux comptes différents

### Utilitaires

- **`get-tracks.sh`** : Récupère la liste des tracks disponibles
- **`get-feed-tracks.sh`** : Récupère les tracks du feed avec leurs propriétaires

## Utilisation

1. **Mettre à jour les tokens** dans les scripts si nécessaire
2. **S'assurer que le serveur backend est démarré** sur `http://localhost:3000`
3. **Exécuter les scripts** :
   ```bash
   cd tests
   ./test-notifications.sh
   ```

## Notes

- Les tokens JWT expirent après un certain temps, il faudra les mettre à jour
- Pour tester les notifications LIKE/COMMENT, il faut utiliser deux comptes différents (le propriétaire de la track et celui qui like/comment)

