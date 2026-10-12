import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Printer,
  Heart,
  Send,
  BookOpen,
  Share2
} from 'lucide-react';
import { BirthdayEvent, GuestbookMessage } from '../../types';
import { QRCodeSvg } from '../common/QRCodeSvg';

interface FamilyDownloadPageProps {
  event: BirthdayEvent;
  onUpdateEvent: (updated: BirthdayEvent) => void;
  onLaunchShow: () => void;
}

export const FamilyDownloadPage: React.FC<FamilyDownloadPageProps> = ({
  event,
  onUpdateEvent,
  onLaunchShow,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const guestShareUrl = `${window.location.origin}/guest/${event.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(guestShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddGuestbookMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newMessage.trim()) return;

    const newEntry: GuestbookMessage = {
      id: `gb-${Date.now()}`,
      author: newAuthor.trim(),
      relation: newRelation.trim() || 'Family & Friends',
      message: newMessage.trim(),
      timestamp: 'Just now',
      likes: 1,
    };

    const updated = {
      ...event,
      guestbook: [newEntry, ...event.guestbook],
    };
    onUpdateEvent(updated);
    setNewAuthor('');
    setNewRelation('');
    setNewMessage('');
  };

  const handleToggleLike = (messageId: string) => {
    const updated = {
      ...event,
      guestbook: event.guestbook.map((m) =>
        m.id === messageId ? { ...m, likes: m.likes + 1 } : m
      ),
    };
    onUpdateEvent(updated);
  };

  const triggerDownloadSimulation = (itemLabel: string) => {
    setDownloadSuccessToast(`Downloading ${itemLabel}...`);
    setTimeout(() => setDownloadSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast alert */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 p-3 bg-stone-900 text-white rounded-lg shadow-xl text-xs font-medium flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Guest Access & Archival Keepsakes</span>
            <span aria-hidden="true">·</span>
            <span>{event.guestbook.length} Messages in Guestbook</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Family QR Portal & Memory Vault
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Give guests instant phone access to upload photos during the party, leave digital guestbook notes, and download the high-resolution anniversary package.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLaunchShow}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            Watch Show
          </button>
        </div>
      </div>

      {/* QR Code & Share Card Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: High-resolution QR Code Display Card - 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs flex flex-col items-center text-center space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
              Scan to Join & Upload
            </span>
            <h2 className="text-base font-bold text-stone-900">
              {event.celebrantName}’s Birthday QR
            </h2>
            <p className="text-xs text-stone-500 max-w-xs">
              Place on dinner tables or by the welcome bar for effortless guest photo uploads.
            </p>
          </div>

          {/* QR Code Frame */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 shadow-inner flex flex-col items-center">
            <QRCodeSvg value={guestShareUrl} size={190} />
            <span className="text-[10px] font-mono text-stone-500 mt-2 truncate max-w-[200px]">
              {guestShareUrl}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full pt-1">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copied!' : 'Copy Direct Link'}
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              Print Venue Sign
            </button>
          </div>
        </div>

        {/* Right: Archival Download Vault - 7 cols */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
              Family Archival Package
            </span>
            <h2 className="text-base font-bold text-stone-900 mt-0.5">
              Preserve This Milestone Forever
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Download complete digital packages for USB keepsakes, photobook printing, or offline family backups.
            </p>
          </div>

          <div className="space-y-3">
            {/* Download Option 1 */}
            <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-stone-200 text-indigo-600">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">
                    High-Res 4K Media Bundle (.zip)
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    All original uncapped photos, contributor tags, and audio tracks ({event.mediaItems.length} assets · ~240 MB)
                  </p>
                </div>
              </div>
              <button
                onClick={() => triggerDownloadSimulation('High-Res Media Bundle.zip')}
                className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-white border border-stone-300 hover:bg-indigo-50 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-2xs"
              >
                Download ZIP
              </button>
            </div>

            {/* Download Option 2 */}
            <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-stone-200 text-indigo-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">
                    Printable Memory Album PDF
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Editorial layout ready for coffee-table hardcover photobook printing with captions
                  </p>
                </div>
              </div>
              <button
                onClick={() => triggerDownloadSimulation('Memory-Album-Keepsake.pdf')}
                className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-white border border-stone-300 hover:bg-indigo-50 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-2xs"
              >
                Generate PDF
              </button>
            </div>

            {/* Download Option 3 */}
            <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-stone-200 text-indigo-600">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">
                    Master Show Video Reel (MP4)
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Full 60fps show reel with music soundtrack and Ken Burns motion baked in
                  </p>
                </div>
              </div>
              <button
                onClick={() => triggerDownloadSimulation('Master-Celebration-Reel.mp4')}
                className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-white border border-stone-300 hover:bg-indigo-50 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-2xs"
              >
                Download MP4
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guestbook Message Wall */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
          <div>
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
              Guest Tribute Wall
            </span>
            <h2 className="text-base font-bold text-stone-900 mt-0.5">
              Messages & Warm Wishes for {event.celebrantName}
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            {event.guestbook.length} memories shared by friends & family
          </span>
        </div>

        {/* Existing Guestbook Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.guestbook.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{entry.author}</span>
                    <span className="text-stone-500 text-[11px] ml-1.5">({entry.relation})</span>
                  </div>
                  <span className="text-[10px] text-stone-400">{entry.timestamp}</span>
                </div>
                <p className="text-xs text-stone-700 font-serif italic leading-relaxed">
                  “{entry.message}”
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                <button
                  onClick={() => handleToggleLike(entry.id)}
                  className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 transition-colors"
                  title="Like message"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[11px] font-medium font-mono tabular-nums">{entry.likes}</span>
                </button>
                <span className="text-[10px] text-stone-400">Verified Guest</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Message Form */}
        <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3">
          <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
            Leave a Birthday Note for {event.celebrantName}
          </h3>

          <form onSubmit={handleAddGuestbookMessage} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Grandma Rose, Cousin Jay"
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Your Relationship
                </label>
                <input
                  type="text"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  placeholder="e.g. Aunt, High School Friend"
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Your Heartfelt Message
              </label>
              <textarea
                rows={2}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share a wish, advice for this new decade, or your favorite funny memory..."
                className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                Post to Guestbook Wall
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
