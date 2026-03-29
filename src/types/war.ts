export type Faction = {
  name: string;
  combatants: string[];
  leaders: string[];
};

export type CountryIntel = {
  name: string;
  side: string;
  leader: string;
  role: 'aggressor' | 'invader' | 'occupied' | 'ally' | 'neutral' | string;
  description?: string;
};

export type War = {
  id: string;
  title: string;
  alternateNames: string[];
  startYear: number | null;
  endYear: number | null;
  era: string;
  region: string;
  summary: string;
  background: string;
  deepCauses: string[];
  immediateCauses: string[];
  triggerEvent: string;
  belligerents: string[];
  factions?: Faction[];
  leaders: string[];
  majorBattles: string[];
  turningPoints: string[];
  outcome: string;
  consequences: string[];
  lessons: string[];
  tags: string[];
  sources: string[];
  heroImage?: string;
  visualGallery?: string[];
  involvedCountries?: string[];
  invadedCountries?: string[];
  geographicalData?: CountryIntel[];
  createdAt: string;
  updatedAt: string;
};