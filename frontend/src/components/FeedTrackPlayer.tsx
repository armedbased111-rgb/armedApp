import {
  AudioPlayerButton,
  AudioPlayerTime,
  AudioPlayerDuration,
  AudioPlayerProgress,
  AudioPlayerSpeed,
  type AudioPlayerItem,
  useAudioPlayer,
} from '@/components/ui/elevenlabs-audio-player';
import { cn } from '@/lib/utils';

interface FeedTrack {
  id: string;
  name: string;
  fileName: string;
  filePath: string;
  duration?: number;
}

interface FeedTrackPlayerProps {
  track: FeedTrack;
  className?: string;
}

// Helper pour construire l'URL du fichier audio
const getAudioUrl = (track: FeedTrack) => {
  // Utiliser fileName pour construire l'URL de téléchargement
  // Le backend sert les fichiers via /files/:filename/download
  const filename = track.fileName || track.filePath.split('/').pop() || track.id;
  return `http://localhost:3000/files/${encodeURIComponent(filename)}/download`;
};

export function FeedTrackPlayer({ track, className }: FeedTrackPlayerProps) {
  const audioItem: AudioPlayerItem<FeedTrack> = {
    id: track.id,
    src: getAudioUrl(track),
    data: track,
  };

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3 p-2 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-700", className)}>
      <AudioPlayerButton
        item={audioItem}
        variant="outline"
        size="icon"
        className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
      />
      <div className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0 h-8 sm:h-9">
        <AudioPlayerTime className="text-xs tabular-nums text-muted-foreground shrink-0" />
        <AudioPlayerProgress className="flex-1 h-full" />
        <AudioPlayerDuration className="text-xs tabular-nums text-muted-foreground shrink-0" />
        <AudioPlayerSpeed variant="ghost" size="icon" className="hidden sm:flex shrink-0" />
      </div>
    </div>
  );
}

