import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Heart,
  Sparkles,
} from 'lucide-react';
import { BirthdayEvent, MediaItem } from '../../types';
import { soundEngine } from '../../utils/audioSynth';

interface CinematicShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: BirthdayEvent;
  initialSlideIndex?: number;
}

interface FloatingReaction {
  id: number;
  emoji: string;
  left: number;
}

export const CinematicShowModal: React.FC<CinematicShowModalProps> = ({
  isOpen,
  onClose,
  event,
  initialSlideIndex = 0,
}) => {
  const [countdown, setCountdown] = useState<number | null>(5);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Active slides that are marked to be included in show
  const slides: MediaItem[] = event.mediaItems.filter((m) => m.includeInShow);
  const currentSlide = slides[currentSlideIndex] || slides[0];

  // Handle countdown logic
  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      soundEngine.stopAmbientSoundtrack();
      return;
    }

    setCountdown(5);
    setCurrentSlideIndex(initialSlideIndex);
    setSlideProgress(0);

    let count = 5;
    soundEngine.playCountdownTick(count);

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        soundEngine.playCountdownTick(count);
      } else {
        clearInterval(timer);
        setCountdown(null);
        soundEngine.playCelebrationChime();
        soundEngine.startAmbientSoundtrack();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      soundEngine.stopAmbientSoundtrack();
    };
  }, [isOpen, initialSlideIndex]);

  // Handle sound mute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  const handleNext = useCallback(() => {
    if (slides.length === 0) return;
    setSlideProgress(0);
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    if (slides.length === 0) return;
    setSlideProgress(0);
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Slideshow advance timer when countdown is completed and isPlaying is true
  useEffect(() => {
    if (!isOpen || countdown !== null || !isPlaying || !currentSlide) return;

    const duration = (currentSlide.durationSeconds || 7) * 1000;
    const intervalMs = 50;
    const increment = (intervalMs / duration) * 100;

    const timer = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, countdown, isPlaying, currentSlide, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Add floating reaction
  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = 60 + Math.random() * 30; // 60% to 90% horizontal position
    setReactions((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2400);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black text-white select-none overflow-hidden flex flex-col items-center justify-between font-sans"
    >
      {/* 5-to-1 Cinematic Countdown Overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
          <div className="text-center space-y-6">
            <p className="text-stone-400 text-sm tracking-widest uppercase">
              The Celebration Begins In
            </p>

            <div className="relative flex items-center justify-center w-36 h-36 mx-auto">
              {/* Circular ring */}
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-stone-800"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-indigo-500 transition-all duration-1000 ease-linear"
                  strokeWidth="4"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * (6 - countdown)) / 5}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              <span
                key={countdown}
                className="absolute text-7xl font-serif font-bold text-white tracking-tighter animate-in zoom-in-75 duration-300"
              >
                {countdown}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-serif text-stone-100">
                {event.celebrantName}’s {event.milestoneAge}th Birthday Show
              </h2>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                {event.tagline}
              </p>
            </div>

            <button
              onClick={() => {
                setCountdown(null);
                soundEngine.playCelebrationChime();
                soundEngine.startAmbientSoundtrack();
              }}
              className="px-4 py-1.5 text-xs text-stone-400 hover:text-white border border-stone-800 hover:border-stone-600 rounded-md transition-colors"
            >
              Skip Countdown
            </button>
          </div>
        </div>
      )}

      {/* Floating live reaction particles */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {reactions.map((r) => (
          <div
            key={r.id}
            style={{ left: `${r.left}%` }}
            className="absolute bottom-16 text-3xl animate-in slide-in-from-bottom duration-1000 transition-transform opacity-90 transform -translate-y-48"
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Top Header Bar */}
      <div className="relative z-30 w-full px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            {event.celebrantName} · {event.milestoneAge}th Celebration
          </span>
          <span className="text-stone-500 text-xs">/</span>
          <span className="text-xs text-stone-300">
            Scene {currentSlideIndex + 1} of {slides.length}
          </span>
        </div>

        {/* Progress ticks for each slide */}
        <div className="hidden sm:flex items-center gap-1.5 max-w-xs w-full mx-4">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => {
                setCurrentSlideIndex(idx);
                setSlideProgress(0);
              }}
              className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:bg-white/40 transition-colors"
            >
              <div
                className={`h-full bg-white transition-all ${
                  idx < currentSlideIndex
                    ? 'w-full'
                    : idx === currentSlideIndex
                    ? 'duration-75'
                    : 'w-0'
                }`}
                style={{
                  width:
                    idx < currentSlideIndex
                      ? '100%'
                      : idx === currentSlideIndex
                      ? `${slideProgress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title={isMuted ? 'Unmute music' : 'Mute music'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Exit Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      {currentSlide && (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* Background image with Ken Burns pan & zoom */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              key={currentSlide.id}
              src={currentSlide.url}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover select-none transition-opacity duration-700 ${
                currentSlide.kenBurns ? 'animate-kenburns' : ''
              }`}
            />
            {/* Scrim gradient ensuring text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
          </div>

          {/* Slide Content Overlay */}
          <div className="relative z-20 max-w-4xl mx-auto px-6 py-12 text-center space-y-4">
            {/* Editorial Metadata (Zero-pill compliant) */}
            <div className="flex items-center justify-center gap-2 text-xs text-indigo-300/90 font-medium">
              <span>{currentSlide.ageMilestone || `Milestone`}</span>
              <span aria-hidden="true">·</span>
              <span>{currentSlide.year || 2026}</span>
              <span aria-hidden="true">·</span>
              <span>Shared by {currentSlide.contributorName} ({currentSlide.contributorRelation})</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white drop-shadow-md text-balance">
              {currentSlide.title}
            </h1>

            {/* Heartfelt Quote / Caption */}
            {currentSlide.caption && (
              <p className="text-base sm:text-lg text-stone-200/90 max-w-2xl mx-auto italic font-serif leading-relaxed drop-shadow-sm text-balance">
                “{currentSlide.caption}”
              </p>
            )}
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="relative z-30 w-full px-6 py-4 flex items-center justify-between bg-gradient-to-t from-black/85 via-black/50 to-transparent">
        {/* Left: Previous / Play / Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Previous Scene (Left Arrow)"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 text-stone-900 bg-white hover:bg-stone-200 rounded-full transition-transform active:scale-95 shadow-md"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={handleNext}
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Next Scene (Right Arrow)"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Sound track display */}
        <div className="hidden md:flex items-center gap-2 text-xs text-stone-400">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>Soundtrack: {event.musicTrack}</span>
        </div>

        {/* Right: Live guest reaction triggers */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-stone-400 hidden sm:inline mr-1">React:</span>
          <button
            onClick={() => triggerReaction('❤️')}
            className="p-1.5 text-lg hover:scale-125 transition-transform"
            title="Send Heart"
          >
            <Heart className="w-5 h-5 text-rose-400 fill-current" />
          </button>
          <button
            onClick={() => triggerReaction('👏')}
            className="p-1.5 text-lg hover:scale-125 transition-transform"
            title="Send Applause"
          >
            👏
          </button>
          <button
            onClick={() => triggerReaction('🥂')}
            className="p-1.5 text-lg hover:scale-125 transition-transform"
            title="Cheers Toast"
          >
            🥂
          </button>
          <button
            onClick={() => {
              triggerReaction('✨');
              soundEngine.playCelebrationChime();
            }}
            className="p-1.5 text-lg hover:scale-125 transition-transform"
            title="Sparkle Chime"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
