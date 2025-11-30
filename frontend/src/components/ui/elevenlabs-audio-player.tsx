"use client"

import * as React from "react"
import { PauseIcon, PlayIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { AudioScrubber } from "@/components/ui/waveform2"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings } from "lucide-react"

export interface AudioPlayerItem<TData = unknown> {
  id: string | number
  src: string
  data?: TData
}

interface AudioPlayerContextValue<TData = unknown> {
  ref: React.RefObject<HTMLAudioElement>
  activeItem: AudioPlayerItem<TData> | null
  duration: number
  error: MediaError | null
  isPlaying: boolean
  isBuffering: boolean
  playbackRate: number
  isItemActive: (id: string | number) => boolean
  setActiveItem: (item: AudioPlayerItem<TData> | null) => void
  play: (item: AudioPlayerItem<TData>) => void
  pause: () => void
  seek: (time: number) => void
  setPlaybackRate: (rate: number) => void
}

const AudioPlayerContext = React.createContext<AudioPlayerContextValue | null>(null)

export function AudioPlayerProvider<TData = unknown>({
  children,
}: {
  children: React.ReactNode
}) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [activeItem, setActiveItem] = React.useState<AudioPlayerItem<TData> | null>(null)
  const [duration, setDuration] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [error, setError] = React.useState<MediaError | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isBuffering, setIsBuffering] = React.useState(false)
  const [playbackRate, setPlaybackRateState] = React.useState(1)
  const [isSeeking, setIsSeeking] = React.useState(false)

  const updateTime = React.useCallback(() => {
    if (audioRef.current && !isSeeking) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [isSeeking])

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
      setError(null)
    }

    const handleTimeUpdate = () => {
      updateTime()
    }

    const handlePlay = () => {
      setIsPlaying(true)
      setIsBuffering(false)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleWaiting = () => {
      setIsBuffering(true)
    }

    const handleCanPlay = () => {
      setIsBuffering(false)
    }

    const handleError = () => {
      setError(audio.error)
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleRateChange = () => {
      setPlaybackRateState(audio.playbackRate)
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("waiting", handleWaiting)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("error", handleError)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("ratechange", handleRateChange)

    // Use requestAnimationFrame for smooth updates
    let rafId: number
    const update = () => {
      updateTime()
      rafId = requestAnimationFrame(update)
    }
    rafId = requestAnimationFrame(update)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("waiting", handleWaiting)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("ratechange", handleRateChange)
      cancelAnimationFrame(rafId)
    }
  }, [updateTime])

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio || !activeItem) return

    audio.src = activeItem.src
    audio.load()
  }, [activeItem])

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = playbackRate
  }, [playbackRate])

  const play = React.useCallback((item: AudioPlayerItem<TData>) => {
    setActiveItem(item)
    const audio = audioRef.current
    if (!audio) return

    if (activeItem?.id === item.id && audio.paused) {
      audio.play().catch(() => {})
    } else {
      audio.src = item.src
      audio.load()
      audio.play().catch(() => {})
    }
  }, [activeItem])

  const pause = React.useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
    }
  }, [])

  const seek = React.useCallback((time: number) => {
    const audio = audioRef.current
    if (audio) {
      setIsSeeking(true)
      audio.currentTime = time
      setCurrentTime(time)
      setTimeout(() => setIsSeeking(false), 100)
    }
  }, [])

  const setPlaybackRate = React.useCallback((rate: number) => {
    setPlaybackRateState(rate)
  }, [])

  const isItemActive = React.useCallback(
    (id: string | number) => {
      return activeItem?.id === id
    },
    [activeItem]
  )

  const value: AudioPlayerContextValue<TData> = {
    ref: audioRef,
    activeItem,
    duration,
    error,
    isPlaying,
    isBuffering,
    playbackRate,
    isItemActive,
    setActiveItem,
    play,
    pause,
    seek,
    setPlaybackRate,
  }

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer<TData = unknown>(): AudioPlayerContextValue<TData> {
  const context = React.useContext(AudioPlayerContext)
  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider")
  }
  return context as AudioPlayerContextValue<TData>
}

export function useAudioPlayerTime(): number {
  const { ref } = useAudioPlayer()
  const [time, setTime] = React.useState(0)

  React.useEffect(() => {
    const audio = ref.current
    if (!audio) return

    const update = () => {
      setTime(audio.currentTime)
      requestAnimationFrame(update)
    }
    const rafId = requestAnimationFrame(update)

    return () => cancelAnimationFrame(rafId)
  }, [ref])

  return time
}

export function AudioPlayerButton<TData = unknown>({
  item,
  ...props
}: ButtonProps & {
  item?: AudioPlayerItem<TData>
}) {
  const player = useAudioPlayer<TData>()

  const handleClick = () => {
    if (item) {
      if (player.isItemActive(item.id) && player.isPlaying) {
        player.pause()
      } else {
        player.play(item)
      }
    } else {
      if (player.isPlaying) {
        player.pause()
      } else if (player.activeItem) {
        player.play(player.activeItem)
      }
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={!player.activeItem && !item}
      {...props}
    >
      {player.isBuffering ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : player.isPlaying && (item ? player.isItemActive(item.id) : true) ? (
        <PauseIcon className="h-4 w-4" />
      ) : (
        <PlayIcon className="h-4 w-4" />
      )}
    </Button>
  )
}

export function AudioPlayerProgress({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AudioScrubber>) {
  const player = useAudioPlayer()
  const time = useAudioPlayerTime()

  // Générer des données de waveform (à remplacer plus tard par de vraies données si disponibles)
  const waveformData = React.useMemo(() => {
    // Générer des données aléatoires basées sur l'ID de la track pour avoir une waveform unique
    const seed = typeof player.activeItem?.id === 'string' 
      ? player.activeItem.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : 42;
    const random = (seedValue: number) => {
      const x = Math.sin(seedValue) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 100 }, (_, i) => 0.2 + random(seed + i) * 0.6);
  }, [player.activeItem?.id]);

  return (
    <AudioScrubber
      className={cn("cursor-pointer w-full", className)}
      currentTime={time}
      duration={player.duration}
      onSeek={player.seek}
      data={waveformData}
      height={32}
      barWidth={2}
      barGap={1}
      barRadius={1}
      showHandle={false}
      {...props}
    />
  )
}

export function AudioPlayerTime({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  const time = useAudioPlayerTime()
  const formatted = formatTime(time)
  return (
    <span className={cn("tabular-nums", className)} {...props}>
      {formatted}
    </span>
  )
}

export function AudioPlayerDuration({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  const { duration } = useAudioPlayer()
  const formatted = duration > 0 ? formatTime(duration) : "--:--"
  return (
    <span className={cn("tabular-nums", className)} {...props}>
      {formatted}
    </span>
  )
}

export function AudioPlayerSpeed({
  speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  variant = "ghost",
  size = "icon",
  ...props
}: ButtonProps & {
  speeds?: readonly number[]
}) {
  const player = useAudioPlayer()

  const getSpeedLabel = (speed: number) => {
    if (speed === 1) return "Normal"
    return `${speed}x`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} {...props}>
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {speeds.map((speed) => (
          <DropdownMenuItem
            key={speed}
            onClick={() => player.setPlaybackRate(speed)}
            className={player.playbackRate === speed ? "bg-accent" : ""}
          >
            {getSpeedLabel(speed)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

