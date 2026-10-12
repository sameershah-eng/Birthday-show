import React from 'react';
import { X, Server, Database, Video, Sparkles, CheckCircle2 } from 'lucide-react';

interface ArchitectureNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureNotesModal: React.FC<ArchitectureNotesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h2 className="text-base font-semibold text-stone-900">
              System Architecture & Production Backend Specifications
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Current client-side capabilities vs. cloud infrastructure requirements
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Active Client-side features */}
          <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Active in this Prototype (100% Client-Side Engine)
            </div>
            <ul className="text-xs text-emerald-900/90 space-y-1 list-disc pl-5">
              <li>Cinematic 5-to-1 countdown with real Web Audio API acoustic synthesis.</li>
              <li>Multi-track timeline scrubber, scene reordering, title overlays, and Ken Burns simulation.</li>
              <li>Dual-screen Live Control Room with presenter cues, toast pause, and reaction bursts.</li>
              <li>Local image drag-and-drop parsing into high-res memory artifacts via FileReader.</li>
              <li>Client-side SVG QR code generation for family attendee scanning.</li>
            </ul>
          </div>

          {/* Infrastructure modules */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Required Production Services & Infrastructure
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Media storage */}
              <div className="p-3.5 border border-stone-200 rounded-lg bg-white space-y-1.5">
                <div className="flex items-center gap-2 text-stone-900 text-xs font-semibold">
                  <Database className="w-4 h-4 text-indigo-600" />
                  Cloud Object Storage (GCS / AWS S3)
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Required for presigned multipart uploads of uncompressed multi-gigabyte family video files, EXIF metadata extraction, and automatic webp/avif responsive thumbnail generation.
                </p>
              </div>

              {/* Video Rendering Worker */}
              <div className="p-3.5 border border-stone-200 rounded-lg bg-white space-y-1.5">
                <div className="flex items-center gap-2 text-stone-900 text-xs font-semibold">
                  <Video className="w-4 h-4 text-indigo-600" />
                  Headless FFmpeg / Remotion Workers
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Required for rendering native standalone 4K 60fps MP4/ProRes archive reels in the cloud with motion blur, 32-bit audio mixing, and broadcast-ready delivery.
                </p>
              </div>

              {/* Realtime Sync */}
              <div className="p-3.5 border border-stone-200 rounded-lg bg-white space-y-1.5">
                <div className="flex items-center gap-2 text-stone-900 text-xs font-semibold">
                  <Server className="w-4 h-4 text-indigo-600" />
                  WebSocket / Firestore Sync
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Required to pair the host’s handheld mobile phone as a zero-latency TV projector remote control across separate networks and Wi-Fi boundaries.
                </p>
              </div>

              {/* Generative AI Provider */}
              <div className="p-3.5 border border-stone-200 rounded-lg bg-white space-y-1.5">
                <div className="flex items-center gap-2 text-stone-900 text-xs font-semibold">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Gemini Vision & Text API
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  For automated chronology ordering from scanned family prints, facial recognition clustering of the celebrant, and drafting personalized heartfelt toast remarks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
