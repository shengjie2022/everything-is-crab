// ─── genebank.js ─── Gene Bank unlock definitions ───

export const GENE_ITEMS = [
  {
    id: 'init_gene_1',
    name: '初始基因I',
    desc: '开局自带1个随机进化',
    cost: 50,
    category: 'starter',
    effect: { startEvolutions: 1 }
  },
  {
    id: 'init_gene_2',
    name: '初始基因II',
    desc: '开局自带2个随机进化',
    cost: 200,
    category: 'starter',
    requires: 'init_gene_1',
    effect: { startEvolutions: 2 }
  },
  {
    id: 'init_gene_3',
    name: '初始基因III',
    desc: '开局自带3个随机进化',
    cost: 500,
    category: 'starter',
    requires: 'init_gene_2',
    effect: { startEvolutions: 3 }
  },
  {
    id: 'gene_slot_1',
    name: '基因槽位+1',
    desc: '增加一个开局携带基因槽位',
    cost: 200,
    category: 'slot',
    effect: { extraSlots: 1 }
  },
  {
    id: 'gene_slot_2',
    name: '基因槽位+2',
    desc: '再增加一个基因槽位',
    cost: 500,
    category: 'slot',
    requires: 'gene_slot_1',
    effect: { extraSlots: 2 }
  },
  {
    id: 'gene_slot_3',
    name: '基因槽位+3',
    desc: '第三个额外基因槽位',
    cost: 1000,
    category: 'slot',
    requires: 'gene_slot_2',
    effect: { extraSlots: 3 }
  },
  {
    id: 'env_resist_heat',
    name: '耐热体质',
    desc: '沙漠热量伤害减半',
    cost: 100,
    category: 'resist',
    effect: { trait: 'heat_resist' }
  },
  {
    id: 'env_resist_cold',
    name: '耐寒体质',
    desc: '苔原暴风雪减速减半',
    cost: 100,
    category: 'resist',
    effect: { trait: 'cold_resist' }
  },
  {
    id: 'env_resist_pressure',
    name: '抗压体质',
    desc: '深海水压伤害减半',
    cost: 100,
    category: 'resist',
    effect: { trait: 'pressure_resist' }
  },
  {
    id: 'lucky_mutation',
    name: '幸运突变',
    desc: '稀有进化出现概率+15%',
    cost: 150,
    category: 'luck',
    effect: { rareBonus: 0.15 }
  },
  {
    id: 'metabolic_boost',
    name: '代谢加速',
    desc: '吞噬获得经验+10%',
    cost: 200,
    category: 'xp',
    effect: { devourXpBonus: 0.1 }
  },
  {
    id: 'thick_skin',
    name: '厚皮基因',
    desc: '初始DEF+3',
    cost: 150,
    category: 'stat',
    effect: { bonusDef: 3 }
  },
  {
    id: 'quick_legs',
    name: '疾足基因',
    desc: '初始SPD+10',
    cost: 150,
    category: 'stat',
    effect: { bonusSpd: 10 }
  },
  {
    id: 'vital_force',
    name: '生命力基因',
    desc: '初始HP+20',
    cost: 150,
    category: 'stat',
    effect: { bonusHp: 20 }
  }
];
