import React, { useState, useEffect } from 'react';
import {
  Cast,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Heart,
  Volume2,
  Clock,
  Mic,
  MessageSquare,
  Plus,
  Trash2,
  Maximize2
} from 'lucide-react';
import { BirthdayEvent, MediaItem } from '../../types';
import { soundEngine } from '../../utils/audioSynth';

interface LiveControlRoomProps {
  event: BirthdayEvent;
  onUpdateEvent: (updated: BirthdayEvent) => void;
  onLaunchFullscreenShow: (slideIndex?: number) => void;
}

export const LiveControlRoom: React.FC<LiveControlRoomProps> = ({
  event,
  onUpdateEvent,
  onLaunchFullscreenShow,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPausedForToast, setIsPausedForToast] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [newHostNote, setNewHostNote] = useState<string>('');
  const [liveConfettiActive, setLiveConfettiActive] = useState<boolean>(false);
  const [connectedGuestsCount] = useState<number>(24);

  const activeSlides: MediaItem[] = event.mediaItems.filter((m) => m.includeInShow);
  const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0];
  const nextSlide = activeSlides[(currentSlideIndex + 1) % activeSlides.length];

  // Elapsed timer clock
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (activeSlides.length === 0) return;
    setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    if (activeSlides.length === 0) return;
    setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleTriggerConfetti = () => {
    setLiveConfettiActive(true);
    soundEngine.playCelebrationChime();
    setTimeout(() => setLiveConfettiActive(false), 3000);
  };

  const handleAddHostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHostNote.trim()) return;
    const updated = {
      ...event,
      hostNotes: [...event.hostNotes, newHostNote.trim()],
    };
    onUpdateEvent(updated);
    setNewHostNote('');
  };

  const handleDeleteHostNote = (index: number) => {
    const updated = {
      ...event,
      hostNotes: event.hostNotes.filter((_, i) => i !== index),
    };
    onUpdateEvent(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Console Bar */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Projector Stage Console</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-stone-800 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Elapsed: {formatTimer(elapsedSeconds)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">
              {connectedGuestsCount} Guests Paired
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Live Show Control Room
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Manage big-screen projector transitions, speaker cues, speech holds, and real-time guest applause from your host device.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onLaunchFullscreenShow(currentSlideIndex)}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Cast className="w-3.5 h-3.5" />
            Launch Fullscreen Projector
          </button>
        </div>
      </div>

      {/* Confetti banner indicator */}
      {liveConfettiActive && (
        <div className="p-3 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 text-white text-xs font-semibold rounded-xl text-center shadow-md animate-bounce">
          ✨ Live Confetti Blast & Fanfare Triggered on Stage! ✨
        </div>
      )}

      {/* Main Dual-Screen Stage Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* On-Air Slide (Current) - 7 cols */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider">
                ON AIR
              </span>
              <span className="text-xs text-stone-300">
                Scene {currentSlideIndex + 1} of {activeSlides.length}
              </span>
            </div>

            <div className="text-xs font-mono text-stone-400">
              {isPausedForToast ? 'PAUSED FOR TOAST' : `Auto-advances (${currentSlide?.durationSeconds || 7}s)`}
            </div>
          </div>

          {/* Current Frame Image */}
          <div className="relative aspect-16/10 bg-black flex items-center justify-center overflow-hidden">
            {currentSlide && (
              <>
                <img
                  src={currentSlide.url}
                  alt={currentSlide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-[11px] text-indigo-300 font-medium">
                    {currentSlide.ageMilestone} · {currentSlide.year} · By {currentSlide.contributorName}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                    {currentSlide.title}
                  </h3>
                  <p className="text-xs text-stone-200 italic line-clamp-2">
                    “{currentSlide.caption}”
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Host tactile playback bar */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg flex items-center gap-1 shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => setIsPausedForToast(!isPausedForToast)}
                className={`px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                  isPausedForToast
                    ? 'bg-amber-600 text-white'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {isPausedForToast ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPausedForToast ? 'Resume Timer' : 'Pause for Toast'}
              </button>
              <button
                onClick={handleNext}
                className="px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg flex items-center gap-1 shadow-2xs"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerConfetti}
                className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Confetti Blast
              </button>
              <button
                onClick={() => onLaunchFullscreenShow(currentSlideIndex)}
                className="p-2 text-stone-600 hover:text-stone-900 border border-stone-300 bg-white rounded-lg"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Up Next Preview & Audio status - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Next Slide Card */}
          <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider">
              <span>Up Next (Ready to Air)</span>
              <span className="text-[11px] font-normal text-stone-400">
                Scene {(currentSlideIndex + 1) % activeSlides.length + 1}
              </span>
            </div>

            {nextSlide && (
              <div className="flex gap-3.5 items-center p-2 rounded-lg bg-stone-50 border border-stone-100">
                <img
                  src={nextSlide.url}
                  alt={nextSlide.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-14 object-cover rounded-md shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-semibold text-stone-900 truncate">
                    {nextSlide.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">
                    {nextSlide.caption}
                  </p>
                  <span className="text-[10px] text-indigo-600 font-medium">
                    Transition: {nextSlide.transition}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Audio & Venue Atmosphere */}
          <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-600" />
                Atmosphere & Music
              </span>
              <span className="text-emerald-700 text-[11px] font-medium">Playing Live</span>
            </div>

            <p className="text-xs text-stone-600">
              Track: <span className="font-medium text-stone-900">{event.musicTrack}</span>
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => soundEngine.playCelebrationChime()}
                className="flex-1 py-1.5 px-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors text-center"
              >
                Play Chime Fanfare
              </button>
              <button
                onClick={() => setIsPausedForToast(!isPausedForToast)}
                className="flex-1 py-1.5 px-2 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors text-center"
              >
                Duck Audio for Toast
              </button>
            </div>
          </div>

          {/* Live Audience Reactions Feed */}
          <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                Live Guest Reactions Feed
              </span>
              <span className="text-stone-400 text-[11px]">Auto-streaming</span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto text-xs">
              <div className="p-2 rounded bg-stone-50 border border-stone-100 flex items-center justify-between">
                <span className="text-stone-700">Elena Chen sent ❤️ (Love)</span>
                <span className="text-[10px] text-stone-400">10s ago</span>
              </div>
              <div className="p-2 rounded bg-stone-50 border border-stone-100 flex items-center justify-between">
                <span className="text-stone-700">Marcus Chen sent 👏 (Applause)</span>
                <span className="text-[10px] text-stone-400">35s ago</span>
              </div>
              <div className="p-2 rounded bg-stone-50 border border-stone-100 flex items-center justify-between">
                <span className="text-stone-700">Sarah Jenkins sent 🥂 (Cheers)</span>
                <span className="text-[10px] text-stone-400">1m ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Host Cue Cards & Speaker Notes */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-stone-900">
              Host Cue Cards & Speaking Schedule
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            Private notes visible only to the presenter
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {event.hostNotes.map((note, index) => (
            <div
              key={index}
              className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition-colors flex items-start justify-between gap-2"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-semibold text-indigo-700">
                  CUE #{index + 1}
                </span>
                <p className="text-xs text-stone-800 leading-relaxed">{note}</p>
              </div>
              <button
                onClick={() => handleDeleteHostNote(index)}
                className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                title="Remove cue note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Cue Note Form */}
        <form onSubmit={handleAddHostNote} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newHostNote}
            onChange={(e) => setNewHostNote(e.target.value)}
            placeholder="Add a speaker note or reminder for the celebration..."
            className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Cue
          </button>
        </form>
      </div>
    </div>
  );
};
