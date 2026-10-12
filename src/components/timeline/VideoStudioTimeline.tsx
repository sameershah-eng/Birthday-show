import React, { useState } from 'react';
import {
  Clock,
  Play,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Sparkles,
  Download,
  Film,
  Music,
  Type,
  CheckCircle2,
  X,
  Volume2
} from 'lucide-react';
import { BirthdayEvent, MediaItem } from '../../types';

interface VideoStudioTimelineProps {
  event: BirthdayEvent;
  onUpdateEvent: (updated: BirthdayEvent) => void;
  onPreviewScene: (sceneIndex: number) => void;
}

export const VideoStudioTimeline: React.FC<VideoStudioTimelineProps> = ({
  event,
  onUpdateEvent,
  onPreviewScene,
}) => {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [scrubberPositionSec, setScrubberPositionSec] = useState<number>(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportPreset, setExportPreset] = useState<'4k' | 'social' | 'archive'>('4k');
  const [exportProgress, setExportProgress] = useState<number | null>(null);
  const [exportComplete, setExportComplete] = useState(false);

  const activeScenes = event.mediaItems.filter((m) => m.includeInShow);
  const totalDurationSec = activeScenes.reduce((acc, curr) => acc + curr.durationSeconds, 0);
  const selectedScene = activeScenes[selectedSceneIndex] || activeScenes[0];

  // Move scene left or right in the sequence
  const handleMoveScene = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeScenes.length) return;

    // Create reordered list of all media items
    const newActive = [...activeScenes];
    const [moved] = newActive.splice(index, 1);
    newActive.splice(targetIndex, 0, moved);

    // Merge with excluded items preserving state
    const excluded = event.mediaItems.filter((m) => !m.includeInShow);
    const updated = {
      ...event,
      mediaItems: [...newActive, ...excluded],
    };
    onUpdateEvent(updated);
    setSelectedSceneIndex(targetIndex);
  };

  const handleUpdateCurrentScene = (updatedFields: Partial<MediaItem>) => {
    if (!selectedScene) return;
    const updatedMediaItems = event.mediaItems.map((item) =>
      item.id === selectedScene.id ? { ...item, ...updatedFields } : item
    );
    onUpdateEvent({ ...event, mediaItems: updatedMediaItems });
  };

  const handleStartExport = () => {
    setExportProgress(0);
    setExportComplete(false);
    let progress = 0;
    const timer = setInterval(() => {
      progress += 12;
      if (progress >= 100) {
        clearInterval(timer);
        setExportProgress(100);
        setExportComplete(true);
      } else {
        setExportProgress(progress);
      }
    }, 280);
  };

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Studio Header */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Sequencing Studio</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{formatTime(totalDurationSec)} Master Runtime</span>
            <span aria-hidden="true">·</span>
            <span>{activeScenes.length} Active Scenes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Video Studio & Sequence Timeline
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Fine-tune scene durations, Ken Burns camera movement, smooth transition effects, and audio timing.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onPreviewScene(selectedSceneIndex)}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Preview Scene
          </button>
          <button
            onClick={() => {
              setIsExportModalOpen(true);
              setExportProgress(null);
              setExportComplete(false);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Master Reel
          </button>
        </div>
      </div>

      {/* Main Timeline Workspace Canvas */}
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Timeline Header & Scrubber Ruler */}
        <div className="bg-stone-50/80 px-6 py-3 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Scrubber Position:
            </span>
            <span className="font-mono tabular-nums bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-900 font-semibold">
              {formatTime(scrubberPositionSec)} / {formatTime(totalDurationSec)}
            </span>
          </div>

          <div className="text-xs text-stone-500">
            Click any scene card or time marker to inspect
          </div>
        </div>

        {/* Multi-Track Area */}
        <div className="p-6 space-y-5 overflow-x-auto no-scrollbar">
          {/* Timecode markers bar */}
          <div className="min-w-[700px] flex justify-between text-[11px] font-mono text-stone-400 border-b border-stone-200 pb-1.5 px-2">
            <span>00:00</span>
            <span>00:05</span>
            <span>00:10</span>
            <span>00:15</span>
            <span>00:20</span>
            <span>00:25</span>
            <span>00:30</span>
            <span>{formatTime(Math.max(35, totalDurationSec))}</span>
          </div>

          {/* Track 1: Video & Photo Scenes */}
          <div className="min-w-[700px] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
              <Film className="w-3.5 h-3.5 text-indigo-600" />
              <span>Track 1 · Visual Scenes & Transitions</span>
            </div>

            <div className="flex items-center gap-2">
              {activeScenes.map((scene, idx) => {
                const isSelected = idx === selectedSceneIndex;
                return (
                  <React.Fragment key={scene.id}>
                    {/* Scene Box */}
                    <div
                      onClick={() => {
                        setSelectedSceneIndex(idx);
                        // Approximate scrubber position
                        let accumulated = 0;
                        for (let i = 0; i < idx; i++) {
                          accumulated += activeScenes[i].durationSeconds;
                        }
                        setScrubberPositionSec(accumulated);
                      }}
                      className={`relative flex-1 min-w-[140px] max-w-[200px] h-28 rounded-lg border-2 p-2 flex flex-col justify-between cursor-pointer transition-all overflow-hidden ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                      }`}
                    >
                      {/* Background thumbnail */}
                      <img
                        src={scene.url}
                        alt={scene.title}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover opacity-35"
                      />

                      {/* Header in scene card */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-black/70 text-white">
                          #{idx + 1}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/90 text-stone-800 font-medium">
                          {scene.durationSeconds}s
                        </span>
                      </div>

                      {/* Title & info in scene card */}
                      <div className="relative z-10">
                        <p className="text-xs font-semibold text-stone-900 drop-shadow-xs truncate">
                          {scene.title}
                        </p>
                        <p className="text-[10px] text-stone-700 truncate">
                          {scene.ageMilestone || 'Milestone'}
                        </p>
                      </div>

                      {/* Reorder arrows */}
                      <div className="relative z-10 flex items-center justify-between pt-1 border-t border-stone-200/60 bg-white/70 px-1 -mx-1 -mb-1 rounded-b">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveScene(idx, 'left');
                          }}
                          className="p-0.5 text-stone-500 hover:text-stone-900 disabled:opacity-20"
                          title="Move earlier"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <span className="text-[9px] text-stone-500 uppercase tracking-wider font-semibold">
                          Reorder
                        </span>
                        <button
                          type="button"
                          disabled={idx === activeScenes.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveScene(idx, 'right');
                          }}
                          className="p-0.5 text-stone-500 hover:text-stone-900 disabled:opacity-20"
                          title="Move later"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Transition badge between scenes */}
                    {idx < activeScenes.length - 1 && (
                      <div
                        onClick={() => {
                          const transitions: MediaItem['transition'][] = [
                            'golden-glow',
                            'dissolve',
                            'fade-black',
                            'soft-zoom',
                          ];
                          const curIdx = transitions.indexOf(scene.transition);
                          const nextTrans = transitions[(curIdx + 1) % transitions.length];
                          const updated = event.mediaItems.map((m) =>
                            m.id === scene.id ? { ...m, transition: nextTrans } : m
                          );
                          onUpdateEvent({ ...event, mediaItems: updated });
                        }}
                        className="p-1 rounded bg-stone-100 hover:bg-indigo-100 border border-stone-200 text-stone-600 hover:text-indigo-700 text-[10px] cursor-pointer transition-colors shrink-0"
                        title="Click to cycle transition effect"
                      >
                        <Sparkles className="w-3 h-3" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Track 2: Audio Soundtrack & Waveform */}
          <div className="min-w-[700px] space-y-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700 flex items-center gap-2">
                <Music className="w-3.5 h-3.5 text-indigo-600" />
                <span>Track 2 · Soundtrack: {event.musicTrack}</span>
              </span>
              <span className="text-stone-500 text-[11px] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                Master Gain: 85% · Tempo: {event.musicTempo}
              </span>
            </div>

            {/* Realistic stylized audio waveform canvas strip */}
            <div className="h-10 w-full bg-indigo-50/50 border border-indigo-100 rounded-lg flex items-center px-3 gap-0.5 overflow-hidden">
              {Array.from({ length: 80 }).map((_, i) => {
                const heightPercent = 25 + Math.sin(i * 0.4) * 20 + ((i % 5) * 8);
                return (
                  <div
                    key={i}
                    style={{ height: `${Math.min(95, heightPercent)}%` }}
                    className="flex-1 bg-indigo-400/80 rounded-xs"
                  />
                );
              })}
            </div>
          </div>

          {/* Track 3: Memory Quotes & Titles Overlay */}
          <div className="min-w-[700px] space-y-2 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
              <Type className="w-3.5 h-3.5 text-indigo-600" />
              <span>Track 3 · Typography & Contributor Quotes Overlay</span>
            </div>

            <div className="flex items-center gap-2">
              {activeScenes.map((scene, idx) => (
                <div
                  key={`quote-${scene.id}`}
                  onClick={() => setSelectedSceneIndex(idx)}
                  className={`flex-1 min-w-[140px] max-w-[200px] h-8 rounded px-2 text-[11px] flex items-center border truncate cursor-pointer transition-colors ${
                    idx === selectedSceneIndex
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  “{scene.caption || scene.title}”
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Scene Inspector Details Panel */}
      {selectedScene && (
        <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                Scene #{selectedSceneIndex + 1} Inspector
              </span>
              <h2 className="text-base font-bold text-stone-900 mt-0.5">
                {selectedScene.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPreviewScene(selectedSceneIndex)}
                className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors flex items-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Fullscreen Preview
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Scene Duration & Transition */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Scene On-Screen Duration
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleUpdateCurrentScene({
                        durationSeconds: Math.max(3, selectedScene.durationSeconds - 1),
                      })
                    }
                    className="w-8 h-8 rounded border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    {selectedScene.durationSeconds} seconds
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateCurrentScene({
                        durationSeconds: Math.min(20, selectedScene.durationSeconds + 1),
                      })
                    }
                    className="w-8 h-8 rounded border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Transition Effect
                </label>
                <select
                  value={selectedScene.transition}
                  onChange={(e) =>
                    handleUpdateCurrentScene({
                      transition: e.target.value as MediaItem['transition'],
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="golden-glow">Golden Glow Swell</option>
                  <option value="dissolve">Smooth Cross-Dissolve</option>
                  <option value="fade-black">Cinematic Fade to Black</option>
                  <option value="soft-zoom">Soft Zoom Push</option>
                </select>
              </div>
            </div>

            {/* Column 2: Ken Burns & Aspect */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Camera Motion Mode
                </label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedScene.kenBurns}
                      onChange={(e) => handleUpdateCurrentScene({ kenBurns: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    Enable Dynamic Ken Burns Slow Motion
                  </label>
                  <p className="text-[11px] text-stone-500">
                    Smoothly zooms into faces and focal highlights over the duration of the slide.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Age Milestone Indicator
                </label>
                <input
                  type="text"
                  value={selectedScene.ageMilestone || ''}
                  onChange={(e) => handleUpdateCurrentScene({ ageMilestone: e.target.value })}
                  placeholder="e.g. Age 30"
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            {/* Column 3: Heartfelt Quote */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Displayed Quote Overlay
                </label>
                <textarea
                  rows={3}
                  value={selectedScene.caption}
                  onChange={(e) => handleUpdateCurrentScene({ caption: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg"
                />
                <span className="text-[11px] text-stone-400">
                  Rendered in refined Playfair Display typography during playback.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Render Presets Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-600" />
                Export Show Reel & Archive Presets
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-stone-600">
                Choose the output preset for projector playback, mobile family reels, or permanent keepsake storage.
              </p>

              {/* Preset Cards */}
              <div className="space-y-2.5">
                {[
                  {
                    id: '4k',
                    title: '4K Ultra-HD Master Reel (60 FPS)',
                    desc: 'Optimized for event TV screens and venue laser projectors with uncompressed audio.',
                  },
                  {
                    id: 'social',
                    title: 'Vertical Memory Story Reel (9:16)',
                    desc: 'Cropped for smartphone sharing, Instagram Reels, and family WhatsApp groups.',
                  },
                  {
                    id: 'archive',
                    title: 'Compact Family Archive (1080p MP4)',
                    desc: 'Lightweight video file suitable for offline laptops, USB sticks, and cloud backup.',
                  },
                ].map((preset) => (
                  <label
                    key={preset.id}
                    onClick={() => setExportPreset(preset.id as '4k' | 'social' | 'archive')}
                    className={`block p-3.5 rounded-lg border cursor-pointer transition-colors ${
                      exportPreset === preset.id
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-900">
                        {preset.title}
                      </span>
                      <input
                        type="radio"
                        name="exportPreset"
                        checked={exportPreset === preset.id}
                        onChange={() => {}}
                        className="text-indigo-600"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">{preset.desc}</p>
                  </label>
                ))}
              </div>

              {/* Progress bar simulation */}
              {exportProgress !== null && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-stone-700">
                      {exportComplete ? 'Reel Rendering Completed!' : 'Compositing frames & Ken Burns layers...'}
                    </span>
                    <span className="font-mono text-indigo-600 font-semibold">{exportProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-200"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {exportComplete && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Master video file composited successfully! Ready for event presentation or local download.
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg"
                >
                  Close
                </button>
                {!exportComplete ? (
                  <button
                    type="button"
                    onClick={handleStartExport}
                    disabled={exportProgress !== null && exportProgress < 100}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-2xs cursor-pointer"
                  >
                    {exportProgress !== null ? 'Rendering...' : 'Start Composite Export'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      alert('Download started: ' + event.celebrantName + '-Birthday-Show.mp4');
                      setIsExportModalOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download MP4 File
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
