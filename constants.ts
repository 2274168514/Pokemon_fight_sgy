import { Move, Pokemon, PokemonType } from './types';

// Helper to create moves
const createMove = (name: string, type: PokemonType, power: number, accuracy: number, desc: string, isSpecial = false): Move => ({
  name, type, power, accuracy, description: desc, isSpecial
});

const MOVES = {
  Scratch: createMove('抓挠', PokemonType.Normal, 40, 100, '用尖锐的爪子抓挠对手。'),
  Tackle: createMove('撞击', PokemonType.Normal, 40, 100, '用整个身体撞向对手。'),
  Ember: createMove('火花', PokemonType.Fire, 40, 100, '向对手发射小型的火焰。', true),
  Flamethrower: createMove('喷射火焰', PokemonType.Fire, 90, 100, '向对手喷射猛烈的火焰。', true),
  WaterGun: createMove('水枪', PokemonType.Water, 40, 100, '向对手猛烈地喷射水流。', true),
  HydroPump: createMove('水炮', PokemonType.Water, 110, 80, '向对手猛烈地喷射大量水流。', true),
  VineWhip: createMove('藤鞭', PokemonType.Grass, 45, 100, '用细长的藤蔓抽打对手。', true),
  SolarBeam: createMove('日光束', PokemonType.Grass, 120, 100, '汇聚日光后发射光束。', true),
  ThunderShock: createMove('电击', PokemonType.Electric, 40, 100, '发出电流刺激对手。', true),
  Thunderbolt: createMove('十万伏特', PokemonType.Electric, 90, 100, '向对手发出强烈的电击。', true),
};

export const POKEMON_ROSTER: Pokemon[] = [
  {
    id: 4, // Charmander
    name: '小火龙 (Charmander)',
    type: PokemonType.Fire,
    maxHp: 120,
    hp: 120,
    moves: [MOVES.Scratch, MOVES.Ember, MOVES.Flamethrower, MOVES.Tackle],
    color: 'orange',
  },
  {
    id: 7, // Squirtle
    name: '杰尼龟 (Squirtle)',
    type: PokemonType.Water,
    maxHp: 130,
    hp: 130,
    moves: [MOVES.Tackle, MOVES.WaterGun, MOVES.HydroPump, MOVES.Scratch],
    color: 'blue',
  },
  {
    id: 1, // Bulbasaur
    name: '妙蛙种子 (Bulbasaur)',
    type: PokemonType.Grass,
    maxHp: 140,
    hp: 140,
    moves: [MOVES.Tackle, MOVES.VineWhip, MOVES.SolarBeam, MOVES.Scratch],
    color: 'green',
  },
  {
    id: 25, // Pikachu
    name: '皮卡丘 (Pikachu)',
    type: PokemonType.Electric,
    maxHp: 100,
    hp: 100,
    moves: [MOVES.Scratch, MOVES.ThunderShock, MOVES.Thunderbolt, MOVES.Tackle],
    color: 'yellow',
  }
];

export const TYPE_COLORS = {
  [PokemonType.Fire]: 'bg-orange-500',
  [PokemonType.Water]: 'bg-blue-500',
  [PokemonType.Grass]: 'bg-green-500',
  [PokemonType.Electric]: 'bg-yellow-400',
  [PokemonType.Normal]: 'bg-gray-400',
};

export const TYPE_TEXT_COLORS = {
  [PokemonType.Fire]: 'text-orange-500',
  [PokemonType.Water]: 'text-blue-500',
  [PokemonType.Grass]: 'text-green-500',
  [PokemonType.Electric]: 'text-yellow-400',
  [PokemonType.Normal]: 'text-gray-400',
};