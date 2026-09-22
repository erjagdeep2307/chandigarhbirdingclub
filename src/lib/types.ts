export interface Walk {
  id: number | string;
  title: string;
  datetime: string;
  location: string;
  duration: string;
  desc: string;
  upcoming: boolean;
  created_at?: string;
}

export interface PastWalk {
  id: number | string;
  title: string;
  date: string;
  participants: string;
  species: string;
  emoji: string;
  created_at?: string;
}

export interface BirdSighting {
  id: number | string;
  name: string;
  latin?: string;
  location: string;
  photo?: string;
  emoji: string;
  spotter: string;
  week: string;
  created_at?: string;
}

export interface Member {
  id: number | string;
  name: string;
  role: string;
  year: number;
  specialty?: string;
  av: string;
  created_at?: string;
}

export interface AuthResponse {
  authenticated: boolean;
  error?: string;
}
