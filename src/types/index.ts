export type EventTheme = 'indigo-violet' | 'amber-gold' | 'rose-velvet' | 'emerald-sage';

export interface Contributor {
  id: string;
  name: string;
  relation: string;
  avatar?: string;
  contributedCount: number;
  email: string;
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  caption: string;
  contributorName: string;
  contributorRelation: string;
  year?: number;
  ageMilestone?: string;
  category: 'childhood' | 'adventures' | 'family' | 'milestones' | 'voice-note';
  dateAdded: string;
  durationSeconds: number;
  transition: 'dissolve' | 'fade-black' | 'golden-glow' | 'soft-zoom';
  kenBurns: boolean;
  approved: boolean;
  includeInShow: boolean;
  aspectRatio?: '4:3' | '16:9' | '1:1';
}

export interface GuestbookMessage {
  id: string;
  author: string;
  relation: string;
  message: string;
  timestamp: string;
  photoUrl?: string;
  likes: number;
}

export interface BirthdayEvent {
  id: string;
  celebrantName: string;
  milestoneAge: number;
  birthDate: string;
  celebrationDate: string;
  tagline: string;
  theme: EventTheme;
  fontFamily: 'Playfair Display' | 'Plus Jakarta Sans';
  musicTrack: string;
  musicTempo: 'gentle' | 'uplifting' | 'cinematic';
  coverPhotoUrl: string;
  mediaItems: MediaItem[];
  guestbook: GuestbookMessage[];
  contributors: Contributor[];
  hostNotes: string[];
}
