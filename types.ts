export enum PokemonType {
  Fire = 'Fire',
  Water = 'Water',
  Grass = 'Grass',
  Electric = 'Electric',
  Normal = 'Normal'
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
  type: PokemonType;
  maxHp: number;
  hp: number;
  moves: Move[];
  color: string; // Tailwind color class mostly
}

export enum GameState {
  Menu,
  Battle,
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
  source: 'system' | 'player' | 'opponent' | 'gemini';
}