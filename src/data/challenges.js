// ─── challenges.js ─── Challenge mode definitions ───

export const CHALLENGES = [
  {
    id: 'pure_crab',
    name: '纯蟹信仰',
    desc: '只能选择甲壳类进化分支',
    rules: { branchLimit: ['arthropod'] },
    reward: { type: 'skin', id: 'crab_zealot', name: '蟹化狂信者皮肤' }
  },
  {
    id: 'vegetarian',
    name: '素食主义者',
    desc: '只能吃植物，不能攻击任何生物',
    rules: { noAttack: true, noDevour: true },
    reward: { type: 'evolution', id: 's_photo_plus', name: '强化光合作用' }
  },
  {
    id: 'ice_age',
    name: '冰河时代',
    desc: '全图冰冻，所有地面变为冰面',
    rules: { globalTileOverride: 8 }, // TILE.ICE
    reward: { type: 'gene', id: 'cold_resist', name: '抗寒基因' }
  },
  {
    id: 'eternal_night',
    name: '永夜',
    desc: '永远是夜晚，视野受限',
    rules: { forceNight: true },
    reward: { type: 'evolution', id: 'night_vision', name: '夜视进化' }
  },
  {
    id: 'hunted',
    name: '被猎杀',
    desc: '开局即有顶级捕食者追杀你',
    rules: { spawnHunter: true },
    reward: { type: 'evolution', id: 'camo_master', name: '伪装大师' }
  },
  {
    id: 'giant_battle',
    name: '巨人之战',
    desc: '所有实体体型×3',
    rules: { sizeMultiplier: 3 },
    reward: { type: 'gene', id: 'gigantism', name: '巨大化基因' }
  },
  {
    id: 'micro_world',
    name: '微型世界',
    desc: '所有实体体型÷3',
    rules: { sizeMultiplier: 0.33 },
    reward: { type: 'gene', id: 'miniaturize', name: '微型化基因' }
  },
  {
    id: 'toxic_fog',
    name: '毒雾弥漫',
    desc: '全场持续掉血，需快速通关',
    rules: { globalPoison: 2 }, // 2 HP/s
    reward: { type: 'evolution', id: 'toxin_immune', name: '抗毒进化' }
  },
  {
    id: 'food_chain_reversed',
    name: '食物链倒置',
    desc: '所有猎物变得极其强大',
    rules: { preyBuffMultiplier: 3 },
    reward: { type: 'gene', id: 'reverse_evo', name: '逆进化基因' }
  },
  {
    id: 'speedrun',
    name: '速通挑战',
    desc: '10分钟内击败Boss通关',
    rules: { timeLimit: 10 * 60 * 1000 },
    reward: { type: 'evolution', id: 'time_warp', name: '时间扭曲' }
  },
  {
    id: 'cyclops',
    name: '独眼巨人',
    desc: '视野范围缩小为圆形，只有一只眼',
    rules: { tunnelVision: true },
    reward: { type: 'evolution', id: 'laser_eye', name: '激光眼' }
  },
  {
    id: 'no_limbs',
    name: '无肢者',
    desc: '无肢体，只能用身体碰撞攻击，速度降低',
    rules: { noLimbs: true, speedReduction: 0.5 },
    reward: { type: 'evolution', id: 'jet_propulsion', name: '喷射移动' }
  }
];
