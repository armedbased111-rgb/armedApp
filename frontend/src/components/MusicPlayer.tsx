import {
  AudioPlayerProvider,
  AudioPlayerButton,
  AudioPlayerTime,
  AudioPlayerDuration,
  AudioPlayerSpeed,
  useAudioPlayer,
  useAudioPlayerTime,
} from './ui/audio-player';
import { Waveform } from './ui/waveform';
import { Card, CardContent } from './ui/card';
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Fonction pour générer des données de waveform de manière déterministe
function generateWaveformData(length: number, seed: number = 42): number[] {
  const random = (seedValue: number) => {
    const x = Math.sin(seedValue) * 10000;
    return x - Math.floor(x);
  };
  
  return Array.from({ length }, (_, i) => 0.2 + random(seed + i) * 0.6);
}

function WaveformScrubber({
  data,
  currentTime,
  duration,
  onSeek,
  className,
}: {
  data: number[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? currentTime / duration : 0;
  const localProgress = isDragging && dragProgress !== null ? dragProgress : progress;

  const handleScrub = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const newProgress = x / rect.width;
      const newTime = newProgress * duration;

      setDragProgress(newProgress);
      onSeek(newTime);
    },
    [duration, onSeek]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    handleScrub(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleScrub(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragProgress(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleScrub]);

  const [waveformHeight, setWaveformHeight] = useState(20);
  const [barWidth, setBarWidth] = useState(2);
  const [barGap, setBarGap] = useState(1);

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth < 640) {
        setWaveformHeight(18); // Mobile
        setBarWidth(1.5);
        setBarGap(0.5);
      } else if (window.innerWidth < 768) {
        setWaveformHeight(20); // Tablet
        setBarWidth(2);
        setBarGap(1);
      } else {
        setWaveformHeight(20); // Desktop
        setBarWidth(2);
        setBarGap(1);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative cursor-pointer select-none flex items-center', className)}
      onMouseDown={handleMouseDown}
      role="slider"
      tabIndex={0}
      style={{ height: `${waveformHeight}px` }}
    >
      <Waveform
        data={data}
        height={waveformHeight}
        barWidth={barWidth}
        barGap={barGap}
        barRadius={1}
        barColor="hsl(var(--foreground))"
        fadeEdges={false}
        className="w-full"
      />
      {/* Overlay pour la partie jouée */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 bg-neutral-900/10 dark:bg-neutral-100/10"
        style={{ width: `${localProgress * 100}%` }}
      />
      {/* Ligne de progression */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-neutral-50"
        style={{ left: `${localProgress * 100}%` }}
      />
    </div>
  );
}

function MusicPlayerContent() {
  const player = useAudioPlayer();
  const currentTime = useAudioPlayerTime();
  
  // Générer des données de waveform (à remplacer plus tard par de vraies données)
  const waveformData = useMemo(() => {
    return generateWaveformData(200, 42);
  }, []);

  const handleSeek = (time: number) => {
    player.seek(time);
  };

  return (
    <Card className="mx-auto my-2 sm:my-4 shadow-lg border-0 bg-neutral-50 dark:bg-neutral-800 z-20 relative w-full max-w-3xl sm:max-w-4xl md:max-w-5xl rounded-full">
      <CardContent className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
          {/* Bouton Play/Pause */}
          <div className="shrink-0 flex items-center">
            <AudioPlayerButton />
          </div>

          {/* Temps actuel */}
          <div className="shrink-0 text-[9px] sm:text-[10px] md:text-[11px] text-neutral-500 dark:text-neutral-400">
            <AudioPlayerTime />
          </div>

          {/* Waveform avec scrubber */}
          <div className="flex-1 min-w-0">
            <WaveformScrubber
              data={waveformData}
              currentTime={currentTime}
              duration={player.duration || 100}
              onSeek={handleSeek}
              className="w-full"
            />
          </div>

          {/* Durée totale */}
          <div className="shrink-0 text-[9px] sm:text-[10px] md:text-[11px] text-neutral-500 dark:text-neutral-400">
            <AudioPlayerDuration />
          </div>

          {/* Contrôle de vitesse - masqué sur très petit écran */}
          <div className="hidden sm:block shrink-0">
            <AudioPlayerSpeed />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MusicPlayer() {
  return (
    <AudioPlayerProvider>
      <MusicPlayerContent />
    </AudioPlayerProvider>
  );
}

