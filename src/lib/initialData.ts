import { Walk, PastWalk, BirdSighting, Member } from './types';

export const initialMockWalks: Walk[] = [
  {
    id: 1,
    title: 'Sukhna Lake Dawn Migratory Watch',
    datetime: '2026-03-29T06:00:00.000Z',
    location: 'Sukhna Lake Regulating End, Chandigarh',
    duration: '3 hours',
    desc: 'Join us as we observe winter migratory waterfowl preparing for departure, alongside resident waders, grebes, and raptors. Binoculars recommended!',
    upcoming: true,
  },
  {
    id: 2,
    title: 'Nepli Forest Trail & Canopy Exploration',
    datetime: '2026-04-12T06:30:00.000Z',
    location: 'Kansal Forest Gate, Sector 1',
    duration: '3.5 hours',
    desc: 'Deep walk through Kansal-Nepli reserve forest targeting forest birds, flycatchers, woodpeckers, and the Indian Grey Hornbill.',
    upcoming: true,
  },
];

export const initialMockPastWalks: PastWalk[] = [
  {
    id: 101,
    title: 'Sukhna Wetland Census',
    date: 'Feb 2026',
    participants: '24 birder',
    species: '48',
    emoji: '🦆',
  },
  {
    id: 102,
    title: 'Morni Foothills Birding',
    date: 'Jan 2026',
    participants: '18',
    species: '36',
    emoji: '🦅',
  },
  {
    id: 103,
    title: 'Rock Garden Urban Avian Walk',
    date: 'Dec 2025',
    participants: '15',
    species: '22',
    emoji: '🌿',
  },
];

export const initialMockBirds: BirdSighting[] = [
  {
    id: 201,
    name: 'Indian Grey Hornbill',
    latin: 'Ocyceros birostris',
    location: 'Sukhna Lake Promenade',
    photo: '',
    emoji: '🪶',
    spotter: 'Vartika Arora',
    week: 'This week',
  },
  {
    id: 202,
    name: 'Indian Roller',
    latin: 'Coracias benghalensis',
    location: 'Lake Club Grounds',
    photo: '',
    emoji: '🐦',
    spotter: 'Priya Sharma',
    week: 'This week',
  },
  {
    id: 203,
    name: 'Black-winged Stilt',
    latin: 'Himantopus himantopus',
    location: 'Sukhna Wet Zone',
    photo: '',
    emoji: '🪿',
    spotter: 'Amanpreet Singh',
    week: 'Last week',
  },
  {
    id: 204,
    name: 'White-throated Kingfisher',
    latin: 'Halcyon smyrnensis',
    location: 'Garden of Silence',
    photo: '',
    emoji: '🐟',
    spotter: 'Rohit Verma',
    week: 'Last week',
  },
];

export const initialMockMembers: Member[] = [
  {
    id: 301,
    name: 'Vartika Arora',
    role: 'Founder & Naturalist',
    year: 2023,
    specialty: 'Raptors & Wetlands',
    av: 'av-2',
  },
  {
    id: 302,
    name: 'Amanpreet Singh',
    role: 'Club Coordinator',
    year: 2023,
    specialty: 'Passerines & Audio Identification',
    av: 'av-3',
  },
  {
    id: 303,
    name: 'Priya Sharma',
    role: 'Photographer',
    year: 2024,
    specialty: 'Avian Photography & Documentation',
    av: 'av-4',
  },
  {
    id: 304,
    name: 'Karan Mehra',
    role: 'Member',
    year: 2024,
    specialty: 'Migratory Waterfowl',
    av: 'av-5',
  },
];
