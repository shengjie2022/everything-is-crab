export const TILE = { GRASS:0, MUD:1, WATER:2, DEEP_WATER:3, TREE:4, ROCK:5, SAND:6, FLOWER:7, ICE:8, SNOW:9, CORAL:10, LAVA_ROCK:11, CACTUS:12 };
export const TILE_PROPS = {
  0:{walkable:true,spd:1.0,color:'#2d5a1e'},
  1:{walkable:true,spd:0.7,color:'#5a3e1b'},
  2:{walkable:true,spd:0.5,color:'#1a6b8a'},
  3:{walkable:false,spd:0.3,color:'#0d4f6b'},
  4:{walkable:false,spd:0,color:'#1a3d0c'},
  5:{walkable:false,spd:0,color:'#555'},
  6:{walkable:true,spd:0.85,color:'#c4a44a'},
  7:{walkable:true,spd:1.0,color:'#3a6e2a'},
  8:{walkable:true,spd:1.3,color:'#b0d4f1'},
  9:{walkable:true,spd:0.6,color:'#e8e8f0'},
  10:{walkable:true,spd:0.9,color:'#e87461'},
  11:{walkable:true,spd:0.8,color:'#3d2b1f'},
  12:{walkable:false,spd:0,color:'#2d8a4e'}
};
export const BIOME = { RAINFOREST:'rainforest', DESERT:'desert', TUNDRA:'tundra', DEEP_SEA:'deep_sea' };
export const AI = { WANDER:'wander', HUNT:'hunt', ATTACK:'attack', FLEE:'flee', RECOVER:'recover' };
export const BRANCH = { ARTHROPOD:'arthropod', MOLLUSK:'mollusk', VERTEBRATE:'vertebrate', SPECIAL:'special' };
export const GSTATE = { START:'start', PLAYING:'playing', PAUSED:'paused', EVO:'evo', VICTORY:'victory', DEFEAT:'defeat' };
export const PHASE = { DAWN:'dawn', DAY:'day', DUSK:'dusk', NIGHT:'night' };
export const BOSS_NODE = { MINI: 'mini', BIG: 'big' };
