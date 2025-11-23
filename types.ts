
export enum PokemonType {
  Normal = 'Normal',
  Fire = 'Fire',
  Water = 'Water',
  Grass = 'Grass',
  Electric = 'Electric',
  Ice = 'Ice',
  Fighting = 'Fighting',
  Poison = 'Poison',
  Ground = 'Ground',
  Flying = 'Flying',
  Psychic = 'Psychic',
  Bug = 'Bug',
  Rock = 'Rock',
  Ghost = 'Ghost',
  Dragon = 'Dragon',
  Steel = 'Steel',
  Fairy = 'Fairy',
  Dark = 'Dark'
}

export interface Move {
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number;
  description: string;
  isSpecial?: boolean; // Used for visual effects
}

export interface Pokemon {
  id: number;
  name: string;
  englishName: string; // NEW: Required for fetching 3D sprites
  type: PokemonType;
  maxHp: number;
  hp: number;
  moves: Move[];
  color: string;
  evolvesTo?: number; // ID of the next evolution
  evolutionLevel?: number; 
}

export enum GameState {
  Menu,
  Battle,
  Victory, 
  GameOver
}

export enum TurnState {
  PlayerInput,
  Processing,
  OpponentTurn,
  Victory,
  Defeat
}

export interface LogEntry {
  id: string;
  text: string;
  source: 'system' | 'player' | 'opponent' | 'gemini' | 'effect';
}
