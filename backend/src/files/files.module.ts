import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  imports: [TracksModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService], // On exporte le service pour qu'il puisse être utilisé ailleurs si besoin
})
export class FilesModule {}
