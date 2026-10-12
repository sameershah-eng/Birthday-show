import React, { useState, useRef } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  Edit3,
  Sliders,
  Check,
  Film,
  UserPlus,
  Eye,
  X
} from 'lucide-react';
import { BirthdayEvent, MediaItem, Contributor } from '../../types';

interface MediaUploadWorkspaceProps {
  event: BirthdayEvent;
  onUpdateEvent: (updated: BirthdayEvent) => void;
  onPreviewSlide: (slideIndex: number) => void;
}

export const MediaUploadWorkspace: React.FC<MediaUploadWorkspaceProps> = ({
  event,
  onUpdateEvent,
  onPreviewSlide,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRelation, setInviteRelation] = useState('');
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter media items
  const filteredItems = event.mediaItems.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  // Handle local file uploads (FileReader)
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newItem: MediaItem = {
          id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          url,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          caption: 'Cherished memory uploaded for the celebration.',
          contributorName: 'Host Contributor',
          contributorRelation: 'Family & Friends',
          year: new Date().getFullYear(),
          ageMilestone: `Age ${event.milestoneAge}`,
          category: 'milestones',
          dateAdded: new Date().toISOString().split('T')[0],
          durationSeconds: 7,
          transition: 'golden-glow',
          kenBurns: true,
          approved: true,
          includeInShow: true,
          aspectRatio: '4:3',
        };

        const updated = {
          ...event,
          mediaItems: [...event.mediaItems, newItem],
        };
        onUpdateEvent(updated);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteItem = (id: string) => {
    const updated = {
      ...event,
      mediaItems: event.mediaItems.filter((m) => m.id !== id),
    };
    onUpdateEvent(updated);
  };

  const handleToggleInclude = (id: string) => {
    const updated = {
      ...event,
      mediaItems: event.mediaItems.map((m) =>
        m.id === id ? { ...m, includeInShow: !m.includeInShow } : m
      ),
    };
    onUpdateEvent(updated);
  };

  const handleSaveItemEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const updated = {
      ...event,
      mediaItems: event.mediaItems.map((m) =>
        m.id === editingItem.id ? editingItem : m
      ),
    };
    onUpdateEvent(updated);
    setEditingItem(null);
  };

  const handleInviteContributor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newContrib: Contributor = {
      id: `c-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      relation: inviteRelation || 'Family Member',
      contributedCount: 0,
    };

    const updated = {
      ...event,
      contributors: [...event.contributors, newContrib],
    };
    onUpdateEvent(updated);
    setInviteEmail('');
    setInviteRelation('');
    setInviteSuccessMsg('Invitation sent with upload link!');
    setTimeout(() => setInviteSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner / Summary */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>{event.celebrantName}</span>
              <span aria-hidden="true">·</span>
              <span>{event.milestoneAge}th Milestone</span>
              <span aria-hidden="true">·</span>
              <span>{event.mediaItems.length} Moments Collected</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Media Upload & Memory Workspace
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Curate childhood nostalgia, travel adventures, and family tributes into the live show timeline. Contributors can drop photos directly with heartfelt captions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-stone-500" />
              Invite Contributors ({event.contributors.length})
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Upload Photos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="mt-6 border-2 border-dashed border-stone-200 hover:border-indigo-400 bg-stone-50/70 hover:bg-indigo-50/30 rounded-xl p-8 text-center cursor-pointer transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform shadow-2xs">
            <Upload className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xs font-semibold text-stone-800">
            Drag and drop high-resolution photos here, or click to browse
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Accepts JPEG, PNG, HEIC, WebP up to 40MB · Automatically sets up Ken Burns motion & transitions
          </p>
        </div>
      </div>

      {/* Filter Tabs & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Interactive Segmented Tabs (Functional Buttons) */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg w-fit overflow-x-auto">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'childhood', label: 'Childhood & Nostalgia' },
            { id: 'adventures', label: 'Adventures & Friends' },
            { id: 'family', label: 'Family Tributes' },
            { id: 'milestones', label: 'Decade Milestones' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status count */}
        <div className="text-xs text-stone-500 font-medium">
          Showing <span className="text-stone-900 tabular-nums">{filteredItems.length}</span> of{' '}
          <span className="text-stone-900 tabular-nums">{event.mediaItems.length}</span> total moments
        </div>
      </div>

      {/* Media Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
          <Film className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="text-sm font-semibold text-stone-800">No photos in this category yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Drop new memories into this category or adjust your filter selection above.
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-3 py-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
          >
            Reset filter to view all
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className={`group bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-2xs hover:shadow-md flex flex-col justify-between ${
                item.includeInShow ? 'border-stone-200' : 'border-dashed border-stone-300 opacity-60'
              }`}
            >
              {/* Image Preview & Quick Overlay */}
              <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => onPreviewSlide(idx)}
                    className="p-2 bg-white/90 hover:bg-white text-stone-900 rounded-full transition-transform active:scale-95 shadow-sm"
                    title="Fullscreen Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 bg-white/90 hover:bg-white text-stone-900 rounded-full transition-transform active:scale-95 shadow-sm"
                    title="Edit Metadata"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 bg-white/90 hover:bg-rose-50 text-rose-600 rounded-full transition-transform active:scale-95 shadow-sm"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Duration indicator */}
                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white rounded">
                  {item.durationSeconds}s
                </div>
              </div>

              {/* Card Content & Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <span>{item.ageMilestone || 'Special'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{item.year || 2026}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{item.contributorRelation}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-stone-900 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>

                {/* Bottom Controls */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 truncate max-w-[120px]">
                    by {item.contributorName}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleInclude(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                      item.includeInShow
                        ? 'bg-emerald-50 text-emerald-700 font-medium'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    }`}
                  >
                    <Check className={`w-3 h-3 ${item.includeInShow ? 'opacity-100' : 'opacity-0'}`} />
                    {item.includeInShow ? 'In Show' : 'Excluded'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Item Metadata Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Edit Memory Card Details
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItemEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Heartfelt Quote or Caption
                </label>
                <textarea
                  rows={3}
                  value={editingItem.caption}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Year Taken
                  </label>
                  <input
                    type="number"
                    value={editingItem.year || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, year: parseInt(e.target.value) || undefined })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Age Milestone Label
                  </label>
                  <input
                    type="text"
                    value={editingItem.ageMilestone || ''}
                    placeholder="e.g. Age 5, College Years"
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, ageMilestone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category Theme
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as MediaItem['category'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="childhood">Childhood & Nostalgia</option>
                    <option value="adventures">Adventures & Friends</option>
                    <option value="family">Family Tributes</option>
                    <option value="milestones">Decade Milestones</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Slide Screen Duration
                  </label>
                  <select
                    value={editingItem.durationSeconds}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        durationSeconds: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value={4}>4 seconds (Fast)</option>
                    <option value={6}>6 seconds</option>
                    <option value={7}>7 seconds (Standard)</option>
                    <option value={8}>8 seconds (Extended)</option>
                    <option value={10}>10 seconds (Slow toast)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={editingItem.kenBurns}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, kenBurns: e.target.checked })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  Enable Cinematic Ken Burns Pan & Zoom
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Contributors Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                Invite Family & Friends
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteContributor} className="p-6 space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Contributors receive a private link where they can submit childhood photos, voice notes, and warm memories directly into this project.
              </p>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. cousin.sam@gmail.com"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Relationship to {event.celebrantName}
                </label>
                <input
                  type="text"
                  value={inviteRelation}
                  onChange={(e) => setInviteRelation(e.target.value)}
                  placeholder="e.g. College Roommate, Aunt, Sister"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {inviteSuccessMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                  {inviteSuccessMsg}
                </div>
              )}

              {/* Current contributor list */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
                  Active Contributors ({event.contributors.length})
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {event.contributors.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between text-xs p-2 rounded bg-stone-50 border border-stone-100"
                    >
                      <div>
                        <span className="font-medium text-stone-900">{c.name}</span>
                        <span className="text-stone-500 ml-1.5">({c.relation})</span>
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {c.contributedCount} photos
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg"
                >
                  Done
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
                >
                  Send Invite Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
