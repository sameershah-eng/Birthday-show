import { BirthdayEvent } from '../types';

import celebrantPortrait from '../assets/images/birthday_celebrant_portrait_1791820472639.jpg';
import familyGathering from '../assets/images/birthday_family_gathering_1791820486293.jpg';
import childhoodMemory from '../assets/images/birthday_childhood_memory_1791820499096.jpg';
import adventureFriends from '../assets/images/birthday_adventure_friends_1791820511793.jpg';

export const INITIAL_EVENTS: BirthdayEvent[] = [
  {
    id: 'maya-30',
    celebrantName: 'Maya Lin Chen',
    milestoneAge: 30,
    birthDate: '1996-10-18',
    celebrationDate: '2026-10-18',
    tagline: 'Three Decades of Wonder, Laughter & Big Dreams',
    theme: 'indigo-violet',
    fontFamily: 'Playfair Display',
    musicTrack: 'Acoustic Morning Glow (Strings & Piano)',
    musicTempo: 'cinematic',
    coverPhotoUrl: celebrantPortrait,
    hostNotes: [
      'Welcome everyone as drinks are poured. Introduce the countdown at 7:30 PM.',
      'Slide 2: Mention Maya blowing out the dinosaur candles at age 5 in Portland.',
      'Slide 3: Cue Sarah for a quick 60-second toast about the Pacific Coast road trip.',
      'Slide 4: Family tribute slide — have Grandma Lin ready with a smile.',
      'Finale: Trigger the live confetti blast and lead the Happy Birthday chorus!'
    ],
    contributors: [
      {
        id: 'c1',
        name: 'Elena Chen',
        relation: 'Mother',
        email: 'elena.chen@example.com',
        contributedCount: 14
      },
      {
        id: 'c2',
        name: 'Marcus Chen',
        relation: 'Brother',
        email: 'marcus.c@example.com',
        contributedCount: 8
      },
      {
        id: 'c3',
        name: 'Sarah Jenkins',
        relation: 'Best Friend (College)',
        email: 'sarah.j@example.com',
        contributedCount: 12
      },
      {
        id: 'c4',
        name: 'David Ortiz',
        relation: 'Partner',
        email: 'david.o@example.com',
        contributedCount: 19
      }
    ],
    mediaItems: [
      {
        id: 'm1',
        url: childhoodMemory,
        title: 'The Fifth Birthday Cake',
        caption: 'Blowing out the five strawberry candles with that mischievous grin that never changed.',
        contributorName: 'Elena Chen',
        contributorRelation: 'Mother',
        year: 2001,
        ageMilestone: 'Age 5',
        category: 'childhood',
        dateAdded: '2026-10-02',
        durationSeconds: 6,
        transition: 'golden-glow',
        kenBurns: true,
        approved: true,
        includeInShow: true,
        aspectRatio: '4:3'
      },
      {
        id: 'm2',
        url: adventureFriends,
        title: 'Highway 1 Coastal Road Trip',
        caption: 'Singing Fleetwood Mac at the top of our lungs while the sun sank into Big Sur.',
        contributorName: 'Sarah Jenkins',
        contributorRelation: 'Best Friend',
        year: 2021,
        ageMilestone: 'Age 25',
        category: 'adventures',
        dateAdded: '2026-10-04',
        durationSeconds: 7,
        transition: 'dissolve',
        kenBurns: true,
        approved: true,
        includeInShow: true,
        aspectRatio: '16:9'
      },
      {
        id: 'm3',
        url: familyGathering,
        title: 'Thanksgiving Under the Olive Trees',
        caption: 'Three generations gathered together, sharing warm bread, loud laughter, and boundless love.',
        contributorName: 'Marcus Chen',
        contributorRelation: 'Brother',
        year: 2024,
        ageMilestone: 'Age 28',
        category: 'family',
        dateAdded: '2026-10-05',
        durationSeconds: 8,
        transition: 'fade-black',
        kenBurns: true,
        approved: true,
        includeInShow: true,
        aspectRatio: '4:3'
      },
      {
        id: 'm4',
        url: celebrantPortrait,
        title: 'Thirty & Radiant',
        caption: 'Stepping into this new decade with unmatched grace, fierce kindness, and an open heart.',
        contributorName: 'David Ortiz',
        contributorRelation: 'Partner',
        year: 2026,
        ageMilestone: 'Age 30',
        category: 'milestones',
        dateAdded: '2026-10-08',
        durationSeconds: 8,
        transition: 'golden-glow',
        kenBurns: true,
        approved: true,
        includeInShow: true,
        aspectRatio: '4:3'
      }
    ],
    guestbook: [
      {
        id: 'g1',
        author: 'Grandma Lin',
        relation: 'Grandmother',
        message: 'May your thirty years multiply into ninety more filled with sweetness, good health, and brave adventures. We love you always.',
        timestamp: 'Yesterday at 4:15 PM',
        likes: 12
      },
      {
        id: 'g2',
        author: 'Uncle Robert & Aunt Sophie',
        relation: 'Family',
        message: 'Watching you grow from that tiny curly-haired girl running across the yard into the inspiring leader you are today has been one of life’s greatest joys!',
        timestamp: '2 days ago',
        likes: 8
      },
      {
        id: 'g3',
        author: 'Leo & Zoe',
        relation: 'Design Studio Colleagues',
        message: 'Happy 30th Birthday to the most empathetic, brilliant creative partner in the world. Enjoy every single second tonight!',
        timestamp: 'Today at 10:20 AM',
        likes: 15
      }
    ]
  },
  {
    id: 'arthur-80',
    celebrantName: 'Arthur Vance',
    milestoneAge: 80,
    birthDate: '1946-11-04',
    celebrationDate: '2026-11-04',
    tagline: 'An 80-Year Legacy of Wisdom, Garden Harvests & Family Harmony',
    theme: 'amber-gold',
    fontFamily: 'Playfair Display',
    musicTrack: 'Cello & Chamber Strings Adagio',
    musicTempo: 'gentle',
    coverPhotoUrl: familyGathering,
    hostNotes: [
      'Begin slideshow right after grandfather sits in the honored armchair.',
      'Allow extra 10 seconds per slide for older guests to read quotes comfortably.',
      'Play the classic jazz swing record right after the final family portrait.'
    ],
    contributors: [
      {
        id: 'ca1',
        name: 'Clara Vance',
        relation: 'Daughter',
        email: 'clara.v@example.com',
        contributedCount: 22
      }
    ],
    mediaItems: [
      {
        id: 'ma1',
        url: familyGathering,
        title: 'The Great Family Reunion',
        caption: 'All grandchildren gathered under the evening lights celebrating Grandpa Arthur.',
        contributorName: 'Clara Vance',
        contributorRelation: 'Daughter',
        year: 2025,
        ageMilestone: 'Age 79',
        category: 'family',
        dateAdded: '2026-09-15',
        durationSeconds: 8,
        transition: 'golden-glow',
        kenBurns: true,
        approved: true,
        includeInShow: true,
        aspectRatio: '4:3'
      }
    ],
    guestbook: [
      {
        id: 'ga1',
        author: 'Clara & Tommy',
        relation: 'Children',
        message: 'Happy 80th, Dad! Thank you for teaching us how to build birdhouses, tell gentle jokes, and stay steadfast through every storm.',
        timestamp: '3 days ago',
        likes: 9
      }
    ]
  }
];
