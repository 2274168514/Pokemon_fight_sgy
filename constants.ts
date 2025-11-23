
import { Move, Pokemon, PokemonType } from './types';

// --- Type Effectiveness Chart ---
export const TYPE_CHART: Record<string, Record<string, number>> = {
  [PokemonType.Normal]: { [PokemonType.Rock]: 0.5, [PokemonType.Ghost]: 0, [PokemonType.Steel]: 0.5 },
  [PokemonType.Fire]: { [PokemonType.Fire]: 0.5, [PokemonType.Water]: 0.5, [PokemonType.Grass]: 2, [PokemonType.Ice]: 2, [PokemonType.Bug]: 2, [PokemonType.Rock]: 0.5, [PokemonType.Dragon]: 0.5, [PokemonType.Steel]: 2 },
  [PokemonType.Water]: { [PokemonType.Fire]: 2, [PokemonType.Water]: 0.5, [PokemonType.Grass]: 0.5, [PokemonType.Ground]: 2, [PokemonType.Rock]: 2, [PokemonType.Dragon]: 0.5 },
  [PokemonType.Grass]: { [PokemonType.Fire]: 0.5, [PokemonType.Water]: 2, [PokemonType.Grass]: 0.5, [PokemonType.Poison]: 0.5, [PokemonType.Ground]: 2, [PokemonType.Flying]: 0.5, [PokemonType.Bug]: 0.5, [PokemonType.Rock]: 2, [PokemonType.Dragon]: 0.5, [PokemonType.Steel]: 0.5 },
  [PokemonType.Electric]: { [PokemonType.Water]: 2, [PokemonType.Grass]: 0.5, [PokemonType.Electric]: 0.5, [PokemonType.Ground]: 0, [PokemonType.Flying]: 2, [PokemonType.Dragon]: 0.5 },
  [PokemonType.Ice]: { [PokemonType.Fire]: 0.5, [PokemonType.Water]: 0.5, [PokemonType.Grass]: 2, [PokemonType.Ice]: 0.5, [PokemonType.Ground]: 2, [PokemonType.Flying]: 2, [PokemonType.Dragon]: 2, [PokemonType.Steel]: 0.5 },
  [PokemonType.Fighting]: { [PokemonType.Normal]: 2, [PokemonType.Ice]: 2, [PokemonType.Poison]: 0.5, [PokemonType.Flying]: 0.5, [PokemonType.Psychic]: 0.5, [PokemonType.Bug]: 0.5, [PokemonType.Rock]: 2, [PokemonType.Ghost]: 0, [PokemonType.Dark]: 2, [PokemonType.Steel]: 2, [PokemonType.Fairy]: 0.5 },
  [PokemonType.Poison]: { [PokemonType.Grass]: 2, [PokemonType.Poison]: 0.5, [PokemonType.Ground]: 0.5, [PokemonType.Rock]: 0.5, [PokemonType.Ghost]: 0.5, [PokemonType.Steel]: 0, [PokemonType.Fairy]: 2 },
  [PokemonType.Ground]: { [PokemonType.Fire]: 2, [PokemonType.Grass]: 0.5, [PokemonType.Electric]: 2, [PokemonType.Poison]: 2, [PokemonType.Flying]: 0, [PokemonType.Bug]: 0.5, [PokemonType.Rock]: 2, [PokemonType.Steel]: 2 },
  [PokemonType.Flying]: { [PokemonType.Grass]: 2, [PokemonType.Electric]: 0.5, [PokemonType.Fighting]: 2, [PokemonType.Bug]: 2, [PokemonType.Rock]: 0.5, [PokemonType.Steel]: 0.5 },
  [PokemonType.Psychic]: { [PokemonType.Fighting]: 2, [PokemonType.Poison]: 2, [PokemonType.Psychic]: 0.5, [PokemonType.Dark]: 0, [PokemonType.Steel]: 0.5 },
  [PokemonType.Bug]: { [PokemonType.Fire]: 0.5, [PokemonType.Grass]: 2, [PokemonType.Fighting]: 0.5, [PokemonType.Poison]: 0.5, [PokemonType.Flying]: 0.5, [PokemonType.Psychic]: 2, [PokemonType.Ghost]: 0.5, [PokemonType.Dark]: 2, [PokemonType.Steel]: 0.5, [PokemonType.Fairy]: 0.5 },
  [PokemonType.Rock]: { [PokemonType.Fire]: 2, [PokemonType.Ice]: 2, [PokemonType.Fighting]: 0.5, [PokemonType.Ground]: 0.5, [PokemonType.Flying]: 2, [PokemonType.Bug]: 2, [PokemonType.Steel]: 0.5 },
  [PokemonType.Ghost]: { [PokemonType.Normal]: 0, [PokemonType.Psychic]: 2, [PokemonType.Ghost]: 2, [PokemonType.Dark]: 0.5 },
  [PokemonType.Dragon]: { [PokemonType.Dragon]: 2, [PokemonType.Steel]: 0.5, [PokemonType.Fairy]: 0 },
  [PokemonType.Steel]: { [PokemonType.Fire]: 0.5, [PokemonType.Water]: 0.5, [PokemonType.Electric]: 0.5, [PokemonType.Ice]: 2, [PokemonType.Rock]: 2, [PokemonType.Steel]: 0.5, [PokemonType.Fairy]: 2 },
  [PokemonType.Fairy]: { [PokemonType.Fire]: 0.5, [PokemonType.Fighting]: 2, [PokemonType.Poison]: 0.5, [PokemonType.Dragon]: 2, [PokemonType.Dark]: 2, [PokemonType.Steel]: 0.5 },
  [PokemonType.Dark]: { [PokemonType.Fighting]: 0.5, [PokemonType.Psychic]: 2, [PokemonType.Ghost]: 2, [PokemonType.Dark]: 0.5, [PokemonType.Fairy]: 0.5 }
};

// Helper to create moves
const createMove = (name: string, type: PokemonType, power: number, accuracy: number, desc: string, isSpecial = false): Move => ({
  name, type, power, accuracy, description: desc, isSpecial
});

const MOVES = {
  // --- Ultimate / Signature Moves ---
  DragonAscent: createMove('画龙点睛', PokemonType.Flying, 120, 100, '从天而降的绝世一击。', false),
  PrecipiceBlades: createMove('断崖之剑', PokemonType.Ground, 120, 85, '将大地变为利刃刺穿对手。', false),
  OriginPulse: createMove('根源波动', PokemonType.Water, 110, 85, '用无数青白色的光线攻击。', true),
  Psystrike: createMove('精神击破', PokemonType.Psychic, 100, 100, '将念波实体化进行攻击。', true),
  AuraSphere: createMove('波导弹', PokemonType.Fighting, 80, 1000, '发射必定命中的波导。', true), // 1000 accuracy = sure hit
  RoarOfTime: createMove('时光咆哮', PokemonType.Dragon, 150, 90, '扭曲时间进行强力攻击。', true),
  SpacialRend: createMove('亚空裂斩', PokemonType.Dragon, 100, 95, '将对手连同空间一起撕裂。', true),
  ShadowForce: createMove('暗影潜袭', PokemonType.Ghost, 120, 100, '消失在影子里进行突袭。', false),
  Judgment: createMove('制裁光砾', PokemonType.Normal, 100, 100, '发射无数的光弹。', true),
  GigaImpact: createMove('终极冲击', PokemonType.Normal, 150, 90, '用尽全力的突进攻击。', false),
  BlastBurn: createMove('爆炸烈焰', PokemonType.Fire, 150, 90, '引发巨大的爆炸。', true),
  HydroCannon: createMove('加农水炮', PokemonType.Water, 150, 90, '发射能贯穿一切的水炮。', true),
  FrenzyPlant: createMove('硬化植物', PokemonType.Grass, 150, 90, '用巨大的树根鞭打对手。', true),

  // --- High Tier Standard Moves ---
  HyperBeam: createMove('破坏光线', PokemonType.Normal, 150, 90, '向对手发射强烈的光线。', true),
  Earthquake: createMove('地震', PokemonType.Ground, 100, 100, '引发地震攻击。'),
  Psychic: createMove('精神强念', PokemonType.Psychic, 90, 100, '发出强大的念力波。', true),
  Thunder: createMove('打雷', PokemonType.Electric, 110, 70, '劈下暴雷攻击对手。', true),
  Blizzard: createMove('暴风雪', PokemonType.Ice, 110, 70, '刮起猛烈的暴风雪。', true),
  FireBlast: createMove('大字爆炎', PokemonType.Fire, 110, 85, '用大字形状的火焰烧尽对手。', true),
  HydroPump: createMove('水炮', PokemonType.Water, 110, 80, '猛烈地喷射大量水流。', true),
  SolarBeam: createMove('日光束', PokemonType.Grass, 120, 100, '汇聚日光发射光束。', true),
  StoneEdge: createMove('尖石攻击', PokemonType.Rock, 100, 80, '用尖锐的岩石刺入。'),
  CloseCombat: createMove('近身战', PokemonType.Fighting, 120, 100, '放弃防御进行猛攻。'),
  Outrage: createMove('逆鳞', PokemonType.Dragon, 120, 100, '在2-3回合内大闹一番。', false),
  DracoMeteor: createMove('流星群', PokemonType.Dragon, 130, 90, '从天空中降下陨石。', true),
  ShadowBall: createMove('暗影球', PokemonType.Ghost, 80, 100, '投掷黑影团块。', true),
  FlashCannon: createMove('加农光炮', PokemonType.Steel, 80, 100, '汇聚光能发射。', true),
  DarkPulse: createMove('恶之波动', PokemonType.Dark, 80, 100, '释放充满恶意的气场。', true),
  IceBeam: createMove('急冻光线', PokemonType.Ice, 90, 100, '向对手发射冰冻光束。', true),
  Thunderbolt: createMove('十万伏特', PokemonType.Electric, 90, 100, '发出强烈的电击。', true),
  Flamethrower: createMove('喷射火焰', PokemonType.Fire, 90, 100, '喷射猛烈的火焰。', true),
  SludgeBomb: createMove('污泥炸弹', PokemonType.Poison, 90, 100, '投掷污泥炸弹。', true),
  Hurricane: createMove('暴风', PokemonType.Flying, 110, 70, '用强烈的风暴将对手卷入。', true),
  Moonblast: createMove('月亮之力', PokemonType.Fairy, 95, 100, '借助月亮的力量攻击。', true),
  PlayRough: createMove('嬉闹', PokemonType.Fairy, 90, 90, '和对手嬉闹进行攻击。', false),

  // --- Added Missing Moves ---
  DragonPulse: createMove('龙之波动', PokemonType.Dragon, 85, 100, '冲击波。', true),
  ExtremeSpeed: createMove('神速', PokemonType.Normal, 80, 100, '以肉眼无法看见的速度撞击。', false),
  Eruption: createMove('喷火', PokemonType.Fire, 150, 100, '喷出剧烈岩浆。', true),
  WaterSpout: createMove('喷水', PokemonType.Water, 150, 100, '喷出大量海水。', true),
  Recover: createMove('自我再生', PokemonType.Normal, 0, 100, '回复HP。', true),
  Tackle: createMove('撞击', PokemonType.Normal, 40, 100, '用整个身体撞向对手进行攻击。', false),
};

export const POKEMON_ROSTER: Pokemon[] = [
  // --- Kanto Starters (Final Form) ---
  {
    id: 6,
    name: '喷火龙',
    englishName: 'charizard',
    type: PokemonType.Fire, 
    maxHp: 300, hp: 300,
    moves: [MOVES.BlastBurn, MOVES.Hurricane, MOVES.DragonAscent, MOVES.SolarBeam],
    color: 'red'
  },
  {
    id: 9,
    name: '水箭龟',
    englishName: 'blastoise',
    type: PokemonType.Water,
    maxHp: 320, hp: 320,
    moves: [MOVES.HydroCannon, MOVES.IceBeam, MOVES.FlashCannon, MOVES.AuraSphere],
    color: 'blue'
  },
  {
    id: 3,
    name: '妙蛙花',
    englishName: 'venusaur',
    type: PokemonType.Grass,
    maxHp: 340, hp: 340,
    moves: [MOVES.FrenzyPlant, MOVES.SludgeBomb, MOVES.Earthquake, MOVES.GigaImpact],
    color: 'green'
  },

  // --- Popular Powerhouses ---
  {
    id: 149,
    name: '快龙',
    englishName: 'dragonite',
    type: PokemonType.Dragon,
    maxHp: 350, hp: 350,
    moves: [MOVES.Outrage, MOVES.Hurricane, MOVES.Thunder, MOVES.FireBlast],
    color: 'orange'
  },
  {
    id: 94,
    name: '耿鬼',
    englishName: 'gengar',
    type: PokemonType.Ghost,
    maxHp: 280, hp: 280,
    moves: [MOVES.ShadowBall, MOVES.SludgeBomb, MOVES.Psychic, MOVES.Thunderbolt],
    color: 'purple'
  },
  {
    id: 448,
    name: '路卡利欧',
    englishName: 'lucario',
    type: PokemonType.Fighting,
    maxHp: 290, hp: 290,
    moves: [MOVES.AuraSphere, MOVES.CloseCombat, MOVES.FlashCannon, MOVES.DragonPulse],
    color: 'blue'
  },
  {
    id: 445,
    name: '烈咬陆鲨',
    englishName: 'garchomp',
    type: PokemonType.Dragon,
    maxHp: 360, hp: 360,
    moves: [MOVES.Earthquake, MOVES.DracoMeteor, MOVES.StoneEdge, MOVES.Flamethrower],
    color: 'indigo'
  },

  // --- Legendaries (The Big Guns) ---
  {
    id: 150,
    name: '超梦',
    englishName: 'mewtwo',
    type: PokemonType.Psychic,
    maxHp: 380, hp: 380,
    moves: [MOVES.Psystrike, MOVES.AuraSphere, MOVES.IceBeam, MOVES.ShadowBall],
    color: 'purple'
  },
  {
    id: 384,
    name: '烈空坐',
    englishName: 'rayquaza',
    type: PokemonType.Dragon,
    maxHp: 400, hp: 400,
    moves: [MOVES.DragonAscent, MOVES.DracoMeteor, MOVES.ExtremeSpeed, MOVES.Earthquake],
    color: 'green'
  },
  {
    id: 383,
    name: '固拉多',
    englishName: 'groudon',
    type: PokemonType.Ground,
    maxHp: 420, hp: 420,
    moves: [MOVES.PrecipiceBlades, MOVES.Eruption, MOVES.SolarBeam, MOVES.StoneEdge],
    color: 'red'
  },
  {
    id: 382,
    name: '盖欧卡',
    englishName: 'kyogre',
    type: PokemonType.Water,
    maxHp: 420, hp: 420,
    moves: [MOVES.OriginPulse, MOVES.WaterSpout, MOVES.Thunder, MOVES.IceBeam],
    color: 'blue'
  },
  {
    id: 483,
    name: '帝牙卢卡',
    englishName: 'dialga',
    type: PokemonType.Steel,
    maxHp: 410, hp: 410,
    moves: [MOVES.RoarOfTime, MOVES.FlashCannon, MOVES.DracoMeteor, MOVES.Earthquake],
    color: 'gray'
  },
  {
    id: 484,
    name: '帕路奇亚',
    englishName: 'palkia',
    type: PokemonType.Water,
    maxHp: 400, hp: 400,
    moves: [MOVES.SpacialRend, MOVES.HydroPump, MOVES.DracoMeteor, MOVES.AuraSphere],
    color: 'pink'
  },
  {
    id: 487,
    name: '骑拉帝纳',
    englishName: 'giratina-origin', // Using Origin Forme for coolness
    type: PokemonType.Ghost,
    maxHp: 450, hp: 450,
    moves: [MOVES.ShadowForce, MOVES.DracoMeteor, MOVES.AuraSphere, MOVES.Earthquake],
    color: 'gray'
  },
  {
    id: 493,
    name: '阿尔宙斯',
    englishName: 'arceus',
    type: PokemonType.Normal,
    maxHp: 500, hp: 500,
    moves: [MOVES.Judgment, MOVES.HyperBeam, MOVES.Recover, MOVES.ExtremeSpeed],
    color: 'white'
  }
];

export const TYPE_COLORS: Record<string, string> = {
  [PokemonType.Normal]: 'bg-stone-400',
  [PokemonType.Fire]: 'bg-orange-600',
  [PokemonType.Water]: 'bg-blue-600',
  [PokemonType.Grass]: 'bg-green-600',
  [PokemonType.Electric]: 'bg-yellow-500',
  [PokemonType.Ice]: 'bg-cyan-400',
  [PokemonType.Fighting]: 'bg-red-800',
  [PokemonType.Poison]: 'bg-fuchsia-700',
  [PokemonType.Ground]: 'bg-amber-700',
  [PokemonType.Flying]: 'bg-indigo-400',
  [PokemonType.Psychic]: 'bg-pink-600',
  [PokemonType.Bug]: 'bg-lime-600',
  [PokemonType.Rock]: 'bg-stone-600',
  [PokemonType.Ghost]: 'bg-purple-800',
  [PokemonType.Dragon]: 'bg-violet-700',
  [PokemonType.Steel]: 'bg-slate-500',
  [PokemonType.Fairy]: 'bg-rose-400',
  [PokemonType.Dark]: 'bg-gray-900',
};
