/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { INITIAL_EVENTS } from './data/initialData';
import { BirthdayEvent } from './types';
import { Header } from './components/common/Header';
import { MediaUploadWorkspace } from './components/media/MediaUploadWorkspace';
import { VideoStudioTimeline } from './components/timeline/VideoStudioTimeline';
import { LiveControlRoom } from './components/live/LiveControlRoom';
import { FamilyDownloadPage } from './components/family/FamilyDownloadPage';
import { CreateShowWizard } from './components/wizard/CreateShowWizard';
import { CinematicShowModal } from './components/show/CinematicShowModal';
import { ArchitectureNotesModal } from './components/common/ArchitectureNotesModal';

export default function App() {
  const [events, setEvents] = useState<BirthdayEvent[]>(INITIAL_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState<string>('maya-30');
  const [currentTab, setCurrentTab] = useState<'wizard' | 'media' | 'timeline' | 'live' | 'family'>('media');

  // Cinematic Preview Modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewInitialSlide, setPreviewInitialSlide] = useState(0);

  // Architecture Specs Modal state
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // Active celebration
  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleUpdateEvent = (updated: BirthdayEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleCreateNewEvent = (newEvent: BirthdayEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    setSelectedEventId(newEvent.id);
    setCurrentTab('media');
  };

  const handleLaunchPreview = (slideIndex = 0) => {
    setPreviewInitialSlide(slideIndex);
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1e1b2e] flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar (Follows Top Bar Contract) */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLaunchPreview={() => handleLaunchPreview(0)}
        events={events}
        selectedEventId={selectedEventId}
        onSelectEvent={setSelectedEventId}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {currentTab === 'media' && (
          <MediaUploadWorkspace
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
            onPreviewSlide={handleLaunchPreview}
          />
        )}

        {currentTab === 'timeline' && (
          <VideoStudioTimeline
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
            onPreviewScene={handleLaunchPreview}
          />
        )}

        {currentTab === 'live' && (
          <LiveControlRoom
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
            onLaunchFullscreenShow={handleLaunchPreview}
          />
        )}

        {currentTab === 'family' && (
          <FamilyDownloadPage
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
            onLaunchShow={() => handleLaunchPreview(0)}
          />
        )}

        {currentTab === 'wizard' && (
          <CreateShowWizard
            onCreateEvent={handleCreateNewEvent}
            onCancel={() => setCurrentTab('media')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">Birthday Moments</span>
            <span aria-hidden="true">·</span>
            <span>Premium Tribute & Live Show Studio</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Cloud Infrastructure Requirements
            </button>
            <span>© {new Date().getFullYear()} Birthday Moments</span>
          </div>
        </div>
      </footer>

      {/* Cinematic Fullscreen Show Modal with 5-to-1 Countdown */}
      <CinematicShowModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        event={activeEvent}
        initialSlideIndex={previewInitialSlide}
      />

      {/* Technical Architecture Modal */}
      <ArchitectureNotesModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
}
