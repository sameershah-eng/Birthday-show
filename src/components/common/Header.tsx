import React from 'react';
import { Play, Sparkles, ChevronDown } from 'lucide-react';
import { BirthdayEvent } from '../../types';

interface HeaderProps {
  currentTab: 'wizard' | 'media' | 'timeline' | 'live' | 'family';
  onSelectTab: (tab: 'wizard' | 'media' | 'timeline' | 'live' | 'family') => void;
  onLaunchPreview: () => void;
  events: BirthdayEvent[];
  selectedEventId: string;
  onSelectEvent: (id: string) => void;
  onOpenArchitectureModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onLaunchPreview,
  events,
  selectedEventId,
  onSelectEvent,
  onOpenArchitectureModal,
}) => {
  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const [eventMenuOpen, setEventMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('media')}
              className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap hover:text-indigo-600 transition-colors text-left flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 rotate-45 inline-block" />
              Birthday Moments
            </button>

            {/* Event Dropdown Switcher */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setEventMenuOpen(!eventMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors"
                aria-expanded={eventMenuOpen}
              >
                <span className="max-w-[140px] truncate">{activeEvent?.celebrantName} ({activeEvent?.milestoneAge}th)</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {eventMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-60 bg-white border border-stone-200 rounded-lg shadow-lg py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Select Celebration
                  </div>
                  {events.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => {
                        onSelectEvent(evt.id);
                        setEventMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-stone-50 transition-colors ${
                        evt.id === selectedEventId ? 'bg-indigo-50/60 text-indigo-900 font-medium' : 'text-stone-700'
                      }`}
                    >
                      <span className="font-medium">{evt.celebrantName} — {evt.milestoneAge}th Birthday</span>
                      <span className="text-[11px] text-stone-400">{evt.tagline}</span>
                    </button>
                  ))}
                  <div className="border-t border-stone-100 my-1" />
                  <button
                    onClick={() => {
                      onSelectTab('wizard');
                      setEventMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 font-medium flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    + Create New Birthday Show
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Zone 2: 4-5 single-line clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button
              onClick={() => onSelectTab('media')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentTab === 'media' ? 'border-indigo-600 text-stone-900 font-semibold' : 'border-transparent'
              }`}
            >
              Media Workspace
            </button>
            <button
              onClick={() => onSelectTab('timeline')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentTab === 'timeline' ? 'border-indigo-600 text-stone-900 font-semibold' : 'border-transparent'
              }`}
            >
              Video Studio
            </button>
            <button
              onClick={() => onSelectTab('live')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentTab === 'live' ? 'border-indigo-600 text-stone-900 font-semibold' : 'border-transparent'
              }`}
            >
              Live Control Room
            </button>
            <button
              onClick={() => onSelectTab('family')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentTab === 'family' ? 'border-indigo-600 text-stone-900 font-semibold' : 'border-transparent'
              }`}
            >
              Family QR & Vault
            </button>
            <button
              onClick={() => onSelectTab('wizard')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentTab === 'wizard' ? 'border-indigo-600 text-stone-900 font-semibold' : 'border-transparent'
              }`}
            >
              Show Wizard
            </button>
          </nav>

          {/* Zone 3: 1 primary action button (+ architecture info modal trigger) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenArchitectureModal}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors hidden sm:inline-block px-2 py-1 rounded hover:bg-stone-100"
              title="View production backend and rendering engine requirements"
            >
              Production Notes
            </button>

            <button
              onClick={onLaunchPreview}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm hover:shadow rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Launch Cinematic Show
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-t border-stone-100 bg-stone-50 text-xs font-medium text-stone-600 overflow-x-auto no-scrollbar gap-4">
        <button
          onClick={() => onSelectTab('media')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'media' ? 'bg-white shadow-xs text-stone-900 font-semibold' : ''}`}
        >
          Media
        </button>
        <button
          onClick={() => onSelectTab('timeline')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'timeline' ? 'bg-white shadow-xs text-stone-900 font-semibold' : ''}`}
        >
          Studio Timeline
        </button>
        <button
          onClick={() => onSelectTab('live')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'live' ? 'bg-white shadow-xs text-stone-900 font-semibold' : ''}`}
        >
          Live Room
        </button>
        <button
          onClick={() => onSelectTab('family')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'family' ? 'bg-white shadow-xs text-stone-900 font-semibold' : ''}`}
        >
          Family QR
        </button>
        <button
          onClick={() => onSelectTab('wizard')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'wizard' ? 'bg-white shadow-xs text-stone-900 font-semibold' : ''}`}
        >
          Wizard
        </button>
      </div>
    </header>
  );
};
