import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { extname } from 'path';

@Injectable()
export class FilesService {
  // Méthode pour configurer le stockage Multer
  getMulterConfig() {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // IMPORTANT: req.body n'est pas encore parsé à ce moment-là
          // On stocke temporairement dans un dossier temp
          // Utiliser un chemin absolu basé sur le répertoire du projet
          const tempPath = path.join(process.cwd(), 'storage', 'temp');

          // Créer le dossier temp s'il n'existe pas
          if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath, { recursive: true });
          }

          // Callback : null = pas d'erreur, tempPath = chemin temporaire
          cb(null, tempPath);
        },

        filename: (req, file, cb) => {
          // On génère un nom unique avec timestamp
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          // On nettoie le nom original (enlève les caractères spéciaux)
          const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');

          // On construit le nom final : timestamp-random-nom.extension
          const filename = `${uniqueSuffix}-${cleanName}`;

          // Callback : null = pas d'erreur, filename = nom du fichier
          cb(null, filename);
        },
      }),

      fileFilter: (req, file, cb) => {
        // Liste des types MIME acceptés pour les fichiers audio
        const allowedMimeTypes = [
          'audio/wav',
          'audio/wave',
          'audio/x-wav',
          'audio/mpeg', // MP3
          'audio/mp3',
          'audio/x-mpeg',
          'audio/x-mp3',
          'audio/mpeg3',
          'audio/x-mpeg-3',
          'audio/flac',
          'audio/x-flac',
          'audio/aiff',
          'audio/aif',
          'audio/x-aiff',
          'audio/x-aif',
          'audio/ogg',
          'audio/vorbis',
          'audio/webm',
          'audio/mp4',
          'audio/x-m4a',
          'audio/m4a',
        ];

        // Liste des extensions acceptées (en cas où le MIME type n'est pas reconnu)
        const allowedExtensions = [
          '.mp3',
          '.wav',
          '.flac',
          '.aiff',
          '.aif',
          '.ogg',
          '.webm',
          '.m4a',
          '.mp4',
        ];

        // Récupérer l'extension du fichier
        const fileExtension = extname(file.originalname).toLowerCase();

        // Vérifier le type MIME OU l'extension
        const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
        const isValidExtension = allowedExtensions.includes(fileExtension);

        // Logger pour debug (à retirer en production)
        if (!isValidMimeType && !isValidExtension) {
          console.log('File rejected:', {
            mimetype: file.mimetype,
            extension: fileExtension,
            originalname: file.originalname,
          });
        }

        if (isValidMimeType || isValidExtension) {
          // Fichier accepté : callback(null, true)
          cb(null, true);
        } else {
          // Fichier rejeté : callback avec erreur
          cb(
            new Error(
              `Only audio files are allowed. Received: ${file.mimetype || 'unknown'} (${fileExtension || 'no extension'})`,
            ),
            false,
          );
        }
      },

      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB en bytes
      },
    };
  }
}
