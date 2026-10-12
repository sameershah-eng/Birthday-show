import React, { useState } from 'react';
import {
  Sparkles,
  Music,
  Palette,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Volume2
} from 'lucide-react';
import { BirthdayEvent, EventTheme } from '../../types';
import { soundEngine } from '../../utils/audioSynth';

interface CreateShowWizardProps {
  onCreateEvent: (newEvent: BirthdayEvent) => void;
  onCancel: () => void;
}

export const CreateShowWizard: React.FC<CreateShowWizardProps> = ({
  onCreateEvent,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [celebrantName, setCelebrantName] = useState('');
  const [milestoneAge, setMilestoneAge] = useState<number>(30);
  const [birthDate, setBirthDate] = useState('1996-10-18');
  const [celebrationDate, setCelebrationDate] = useState('2026-10-18');
  const [tagline, setTagline] = useState('A Decade of Wonder, Joy and Boundless Love');
  const [theme, setTheme] = useState<EventTheme>('indigo-violet');
  const [fontFamily, setFontFamily] = useState<'Playfair Display' | 'Plus Jakarta Sans'>('Playfair Display');
  const [musicTrack, setMusicTrack] = useState('Acoustic Morning Glow (Strings & Piano)');
  const [musicTempo, setMusicTempo] = useState<'gentle' | 'uplifting' | 'cinematic'>('cinematic');
  const [allowGuestUploads, setAllowGuestUploads] = useState(true);
  const [hostModeration, setHostModeration] = useState(false);

  const handleNextStep = () => {
    if (step === 1 && !celebrantName.trim()) {
      alert('Please enter the celebrant’s name.');
      return;
    }
    setStep((prev) => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handlePreviewMelody = () => {
    soundEngine.playCelebrationChime();
  };

  const handleFinishWizard = () => {
    const newEvent: BirthdayEvent = {
      id: `evt-${Date.now()}`,
      celebrantName: celebrantName.trim(),
      milestoneAge: Number(milestoneAge) || 30,
      birthDate,
      celebrationDate,
      tagline: tagline.trim() || `${milestoneAge}th Birthday Milestone Celebration`,
      theme,
      fontFamily,
      musicTrack,
      musicTempo,
      coverPhotoUrl: '',
      hostNotes: [
        `Welcome all family and friends for ${celebrantName}'s celebration!`,
        'Introduce the 5-to-1 countdown on the main TV/projector.',
        'Invite best friends and parents for a 2-minute toast before dessert.',
        'Trigger the finale confetti cannon!'
      ],
      contributors: [
        {
          id: `c-host-${Date.now()}`,
          name: 'Party Host',
          relation: 'Organizer',
          email: 'host@family.com',
          contributedCount: 0,
        },
      ],
      mediaItems: [],
      guestbook: [],
    };

    onCreateEvent(newEvent);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Wizard Stepper Header */}
        <div className="p-6 bg-stone-50/80 border-b border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                Production Wizard · Step {step} of 5
              </span>
              <h1 className="text-xl font-bold text-stone-900 mt-0.5">
                Create New Birthday Show
              </h1>
            </div>
            <button
              onClick={onCancel}
              className="text-xs text-stone-500 hover:text-stone-800"
            >
              Cancel
            </button>
          </div>

          {/* Stepper Progress bar */}
          <div className="grid grid-cols-5 gap-2">
            {[
              '1. Celebrant Info',
              '2. Theme & Fonts',
              '3. Soundtrack',
              '4. Contributor Circle',
              '5. Launch Project',
            ].map((label, idx) => (
              <div key={label} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    step > idx + 1
                      ? 'bg-emerald-600'
                      : step === idx + 1
                      ? 'bg-indigo-600'
                      : 'bg-stone-200'
                  }`}
                />
                <span className="text-[10px] text-stone-500 truncate block hidden sm:inline">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-8">
          {/* Step 1: Celebrant Info */}
          {step === 1 && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Who are we celebrating?
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Enter key celebration details to customize personalized typography and countdown displays.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Celebrant Full Name *
                  </label>
                  <input
                    type="text"
                    value={celebrantName}
                    onChange={(e) => setCelebrantName(e.target.value)}
                    placeholder="e.g. Maya Lin Chen, Grandpa Arthur"
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Milestone Age
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={milestoneAge}
                      onChange={(e) => setMilestoneAge(parseInt(e.target.value) || 1)}
                      className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Celebration Date
                    </label>
                    <input
                      type="date"
                      value={celebrationDate}
                      onChange={(e) => setCelebrationDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dedication Tagline / Theme
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Three Decades of Laughs, Road Trips & Courage"
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Displayed during the cinematic 5-to-1 countdown and opening title card.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Theme & Fonts */}
          {step === 2 && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Visual Aesthetic & Palette
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Choose a refined color mood and typography pairing for the live presentation.
                </p>
              </div>

              {/* Theme palettes */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Color Mood
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'indigo-violet', title: 'Twilight Indigo & Violet', bg: 'bg-indigo-900' },
                    { id: 'amber-gold', title: 'Amber Gold & Cream', bg: 'bg-amber-800' },
                    { id: 'rose-velvet', title: 'Rose Velvet & Champagne', bg: 'bg-rose-900' },
                    { id: 'emerald-sage', title: 'Emerald & Warm Sage', bg: 'bg-emerald-900' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id as EventTheme)}
                      className={`p-3.5 rounded-lg border text-left flex items-center gap-3 transition-colors ${
                        theme === t.id
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${t.bg} shrink-0`} />
                      <span className="text-xs font-medium text-stone-900">{t.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography pairing */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Display Typography
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFontFamily('Playfair Display')}
                    className={`p-3.5 rounded-lg border text-left transition-colors ${
                      fontFamily === 'Playfair Display'
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <span className="font-serif text-base font-bold text-stone-900 block">
                      Playfair Display
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Cinematic, editorial & classic celebratory warmth
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFontFamily('Plus Jakarta Sans')}
                    className={`p-3.5 rounded-lg border text-left transition-colors ${
                      fontFamily === 'Plus Jakarta Sans'
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <span className="font-sans text-base font-bold text-stone-900 block">
                      Plus Jakarta Sans
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Clean, contemporary & geometric elegance
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Soundtrack */}
          {step === 3 && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Soundtrack & Audio Atmosphere
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select background music that loops during slide playback and countdown ticks.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    title: 'Acoustic Morning Glow (Strings & Piano)',
                    tempo: 'cinematic',
                    desc: 'Heartwarming arpeggiated piano melody with rich cello accents.',
                  },
                  {
                    title: 'Cello & Chamber Strings Adagio',
                    tempo: 'gentle',
                    desc: 'Refined classical strings suited for milestone jubilees and legacy celebrations.',
                  },
                  {
                    title: 'Golden Hour Folk & Acoustic Guitar',
                    tempo: 'uplifting',
                    desc: 'Warm indie acoustic rhythms perfect for adventures and friend trips.',
                  },
                ].map((track) => (
                  <div
                    key={track.title}
                    onClick={() => {
                      setMusicTrack(track.title);
                      setMusicTempo(track.tempo as 'gentle' | 'uplifting' | 'cinematic');
                    }}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                      musicTrack === track.title
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-stone-900 block">
                        {track.title}
                      </span>
                      <span className="text-[11px] text-stone-500">{track.desc}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewMelody();
                      }}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors"
                      title="Preview Chime Note"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Contributor Circle */}
          {step === 4 && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Guest Uploads & Moderation
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Define how guests and family members can submit their memories via the QR portal.
                </p>
              </div>

              <div className="space-y-3">
                <label className="p-3.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-white flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowGuestUploads}
                    onChange={(e) => setAllowGuestUploads(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">
                      Enable Instant QR Guest Uploads
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Family guests can upload photos and record voice notes from their smartphones without needing an account.
                    </span>
                  </div>
                </label>

                <label className="p-3.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-white flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hostModeration}
                    onChange={(e) => setHostModeration(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">
                      Host Moderation Queue
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Require party hosts to approve guest photos before they appear on the live projector screen.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Review & Initialize */}
          {step === 5 && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  Ready to Create Show
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Confirm project specifications before entering the media workspace.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3 text-xs">
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500">Celebrant:</span>
                  <span className="font-semibold text-stone-900">{celebrantName} ({milestoneAge}th Birthday)</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500">Celebration Date:</span>
                  <span className="font-semibold text-stone-900">{celebrationDate}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200/60 pb-2">
                  <span className="text-stone-500">Theme & Typography:</span>
                  <span className="font-semibold text-stone-900">{theme} · {fontFamily}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Soundtrack:</span>
                  <span className="font-semibold text-stone-900">{musicTrack}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-6 bg-stone-50/80 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={handlePrevStep}
            className="px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 disabled:opacity-30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishWizard}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Create Birthday Show Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
