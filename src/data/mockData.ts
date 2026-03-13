import bullPortrait2 from "@/assets/bull-portrait-2.jpg";
import eventArena from "@/assets/event-arena.jpg";
import tropeiro1 from "@/assets/tropeiro-1.jpg";

export const defaultBullImage = bullPortrait2;
export const defaultEventImage = eventArena;
export const defaultTropeiroImage = tropeiro1;

export interface BullHistoryItem {
  event: string;
  date: string;
  score: number;
}

export interface Bull {
  id: number;
  name: string;
  age: number;
  weight: number;
  score: number;
  tropeiro: string;
  tropeiroId: number;
  company: string;
  city: string;
  image: string;
  events: number;
  wins: number;
  history: BullHistoryItem[];
}

export interface Tropeiro {
  id: number;
  name: string;
  phone: string;
  team: string;
  description: string;
  bullCount: number;
  city: string;
  image: string;
  instagram: string;
  facebook: string;
}

export interface Event {
  id: number;
  name: string;
  date: string;
  dateEnd: string;
  location: string;
  city: string;
  status: "Em breve" | "Em andamento" | "Encerrado";
  image: string;
  description: string;
  bullCount: number;
}

export interface GalleryItem {
  id: number;
  type: "photo" | "video";
  url: string;
  title: string;
  category: string;
  bull?: string;
  event?: string;
  tropeiro?: string;
}

export interface TropeiroUser {
  id: number;
  tropeiroId: number;
  username: string;
  password: string;
  active: boolean;
}

export interface AuthSession {
  role: "tropeiro" | "admin";
  tropeiroId?: number;
  username: string;
}

export interface ArenaData {
  bulls: Bull[];
  tropeiros: Tropeiro[];
  events: Event[];
  gallery: GalleryItem[];
  users: TropeiroUser[];
}

export const emptyArenaData: ArenaData = {
  bulls: [],
  tropeiros: [],
  events: [],
  gallery: [],
  users: [],
};
