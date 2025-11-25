import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { FilesService } from './files.service';
import { TracksService } from '../tracks/tracks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';

@Controller('files')
@UseGuards(JwtAuthGuard) // Protéger l'endpoint avec JWT
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly tracksService: TracksService, // Injecter TracksService
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', new FilesService().getMulterConfig()),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('projectId') projectId: string,
    @Body('name') trackName: string, // Nom optionnel pour la track
  ) {
    // Vérifier que le fichier a bien été uploadé
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Vérifier que projectId est présent
    if (!projectId) {
      // Supprimer le fichier temporaire si projectId manquant
      const tempPath = path.join(
        process.cwd(),
        'storage',
        'temp',
        file.filename,
      );
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      throw new BadRequestException('projectId is required');
    }

    // Construire le chemin de destination final (chemin absolu)
    const finalDir = path.join(
      process.cwd(),
      'storage',
      'projects',
      projectId,
      'tracks',
    );
    const finalPath = path.join(finalDir, file.filename);
    const tempPath = path.join(process.cwd(), 'storage', 'temp', file.filename);

    // Créer le dossier de destination s'il n'existe pas
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    // Déplacer le fichier du dossier temp vers le dossier final
    try {
      // Vérifier que le fichier temp existe
      if (!fs.existsSync(tempPath)) {
        throw new BadRequestException('Temporary file not found');
      }
      fs.renameSync(tempPath, finalPath);
    } catch (error) {
      // Si erreur, supprimer le fichier temp
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      // Logger l'erreur pour debug
      console.error('Error moving file:', error);
      throw new BadRequestException(
        `Failed to move file to destination: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    // Créer la track en base de données
    // Utiliser le nom fourni ou le nom original du fichier
    const name = trackName || file.originalname.replace(/\.[^/.]+$/, ''); // Enlever l'extension

    const track = await this.tracksService.create(
      name, // Nom de la track
      projectId, // ID du projet
      file.originalname, // Nom original du fichier
      finalPath, // Chemin complet du fichier
      undefined, // Duration (à extraire plus tard)
      file.size, // Taille du fichier
    );

    // Retourner la track créée avec les infos du fichier
    return {
      track, // La track créée en base
      file: {
        filename: file.filename,
        originalName: file.originalname,
        path: finalPath,
        size: file.size,
        mimetype: file.mimetype,
      },
    };
  }

  @Get(':filename/download')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    // Construire le chemin du fichier
    // Note: En production, il faudrait stocker le chemin complet en DB
    // Pour l'instant, on cherche dans tous les dossiers projects
    const storagePath = path.join(process.cwd(), 'storage', 'projects');

    // Chercher le fichier récursivement
    const filePath = this.findFileRecursive(storagePath, filename);

    if (!filePath) {
      throw new BadRequestException('File not found');
    }

    // Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    // Envoyer le fichier
    res.sendFile(path.resolve(filePath));
  }

  // Méthode helper pour trouver un fichier récursivement
  private findFileRecursive(dir: string, filename: string): string | null {
    if (!fs.existsSync(dir)) {
      return null;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Si c'est un dossier, chercher dedans
        const found = this.findFileRecursive(filePath, filename);
        if (found) {
          return found;
        }
      } else if (file === filename) {
        // Si c'est le fichier qu'on cherche
        return filePath;
      }
    }

    return null;
  }
}
