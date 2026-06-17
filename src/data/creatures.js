export const CREATURES = {
  // ── Original creatures ──────────────────────────────────────
  beetle: { name:'甲虫',tier:1,hp:30,atk:5,def:2,spd:50,xp:15,size:16,aggro:40,range:20,diet:'herb',color:'#8B4513',weight:10,tiles:[0,7,1],biome:'any' },
  frog: { name:'青蛙',tier:2,hp:50,atk:13,def:3,spd:80,xp:30,size:18,aggro:180,range:80,diet:'carni',color:'#228B22',weight:7,tiles:[0,1,2],biome:'any' },
  crab: { name:'螃蟹',tier:2,hp:70,atk:16,def:8,spd:55,xp:35,size:20,aggro:140,range:28,diet:'omni',color:'#DC143C',weight:6,tiles:[2,6,1],biome:'any' },
  fish: { name:'鱼',tier:2,hp:35,atk:9,def:2,spd:110,xp:25,size:16,aggro:160,range:24,diet:'omni',color:'#4169E1',weight:8,tiles:[2],water:true,biome:'any' },
  spider: { name:'蜘蛛',tier:3,hp:60,atk:23,def:4,spd:90,xp:50,size:20,aggro:230,range:100,diet:'carni',color:'#4B0082',weight:4,tiles:[0],biome:'any' },
  snake: { name:'蛇',tier:3,hp:55,atk:21,def:3,spd:100,xp:55,size:18,aggro:210,range:110,diet:'carni',color:'#006400',weight:4,tiles:[0,1],biome:'any' },
  octopus: { name:'章鱼',tier:3,hp:80,atk:19,def:5,spd:70,xp:60,size:24,aggro:200,range:60,diet:'carni',color:'#8B008B',weight:3,tiles:[2,1],biome:'any' },
  scorpion: { name:'蝎子',tier:3,hp:65,atk:25,def:6,spd:75,xp:55,size:20,aggro:190,range:35,diet:'carni',color:'#DAA520',weight:3,tiles:[6,1],biome:'any' },

  // ── Bosses ──────────────────────────────────────────────────
  boss: { name:'森蚺女王',tier:4,hp:600,atk:35,def:12,spd:70,xp:0,size:40,aggro:400,range:150,diet:'carni',color:'#8B0000',weight:0,tiles:[0,1],isBoss:true,biome:'rainforest' },
  sand_worm: { name:'沙海蠕虫',tier:5,hp:550,atk:25,def:6,spd:50,xp:500,size:34,aggro:400,range:140,diet:'carni',color:'#c4944a',weight:0,tiles:[6],isBoss:true,biome:'desert' },
  frost_crab: { name:'霜巨人蟹',tier:5,hp:650,atk:20,def:12,spd:35,xp:500,size:36,aggro:400,range:130,diet:'carni',color:'#88ccee',weight:0,tiles:[9,8],isBoss:true,biome:'tundra' },
  kraken_boss: { name:'克拉肯',tier:5,hp:700,atk:18,def:7,spd:40,xp:500,size:38,aggro:400,range:160,diet:'carni',color:'#4a0080',weight:0,tiles:[2,3],water:true,isBoss:true,biome:'deep_sea' },

  // ── Rainforest creatures ────────────────────────────────────
  monkey: { name:'猴子',tier:2,hp:45,atk:11,def:3,spd:100,xp:30,size:18,aggro:160,range:40,diet:'omni',color:'#8B6914',weight:6,tiles:[0,4,7],biome:'rainforest' },
  python: { name:'蟒蛇',tier:3,hp:80,atk:19,def:5,spd:40,xp:55,size:26,aggro:200,range:30,diet:'carni',color:'#4a6741',weight:4,tiles:[0,1],biome:'rainforest' },
  poison_frog: { name:'毒蛙',tier:2,hp:25,atk:7,def:2,spd:90,xp:25,size:16,aggro:140,range:60,diet:'carni',color:'#ff4081',weight:6,tiles:[0,1,2],biome:'rainforest' },
  army_ant: { name:'行军蚁',tier:1,hp:15,atk:4,def:1,spd:70,xp:10,size:10,aggro:100,range:15,diet:'carni',color:'#5d4037',weight:10,tiles:[0,1],biome:'rainforest' },
  centipede: { name:'蜈蚣',tier:1,hp:20,atk:6,def:1,spd:65,xp:12,size:14,aggro:120,range:20,diet:'carni',color:'#8b4513',weight:8,tiles:[0,1],biome:'rainforest' },
  mantis: { name:'螳螂',tier:2,hp:45,atk:19,def:3,spd:70,xp:35,size:18,aggro:190,range:35,diet:'carni',color:'#4caf50',weight:5,tiles:[0,7],biome:'rainforest' },
  piranha: { name:'食人鱼',tier:2,hp:30,atk:15,def:2,spd:100,xp:28,size:14,aggro:180,range:25,diet:'carni',color:'#e53935',weight:6,tiles:[2],water:true,biome:'rainforest' },

  // ── Desert creatures ────────────────────────────────────────
  camel_spider: { name:'骆驼蜘蛛',tier:3,hp:55,atk:23,def:4,spd:110,xp:50,size:20,aggro:220,range:30,diet:'carni',color:'#d4a44a',weight:4,tiles:[6],biome:'desert' },
  horned_lizard: { name:'角蜥',tier:2,hp:40,atk:9,def:7,spd:60,xp:30,size:18,aggro:150,range:25,diet:'omni',color:'#a0845a',weight:6,tiles:[6,5],biome:'desert' },
  vulture: { name:'秃鹫',tier:2,hp:35,atk:13,def:2,spd:85,xp:30,size:20,aggro:220,range:35,diet:'carni',color:'#4e342e',weight:5,tiles:[6],biome:'desert' },
  rattlesnake: { name:'响尾蛇',tier:3,hp:50,atk:21,def:3,spd:95,xp:50,size:18,aggro:180,range:90,diet:'carni',color:'#8d6e63',weight:4,tiles:[6,1],biome:'desert' },
  fire_ant: { name:'火蚁',tier:1,hp:12,atk:5,def:1,spd:80,xp:10,size:10,aggro:110,range:15,diet:'carni',color:'#ff6d00',weight:10,tiles:[6],biome:'desert' },
  sidewinder: { name:'角响蛇',tier:2,hp:45,atk:15,def:3,spd:90,xp:35,size:18,aggro:170,range:30,diet:'carni',color:'#c4944a',weight:5,tiles:[6],biome:'desert' },
  desert_tortoise: { name:'沙龟',tier:2,hp:60,atk:7,def:10,spd:30,xp:30,size:20,aggro:120,range:20,diet:'herb',color:'#8d6e63',weight:5,tiles:[6,5],biome:'desert' },

  // ── Tundra creatures ────────────────────────────────────────
  polar_bear: { name:'北极熊',tier:3,hp:100,atk:25,def:8,spd:55,xp:60,size:28,aggro:210,range:35,diet:'carni',color:'#eceff1',weight:3,tiles:[9,8],biome:'tundra' },
  arctic_fox: { name:'北极狐',tier:2,hp:35,atk:11,def:3,spd:100,xp:30,size:16,aggro:170,range:25,diet:'carni',color:'#cfd8dc',weight:6,tiles:[9],biome:'tundra' },
  seal: { name:'海豹',tier:2,hp:50,atk:9,def:4,spd:65,xp:25,size:20,aggro:130,range:20,diet:'omni',color:'#90a4ae',weight:5,tiles:[8,2],water:true,biome:'tundra' },
  snowy_owl: { name:'雪鸮',tier:2,hp:30,atk:15,def:2,spd:90,xp:35,size:18,aggro:210,range:50,diet:'carni',color:'#fafafa',weight:5,tiles:[9],biome:'tundra' },
  penguin: { name:'企鹅',tier:1,hp:25,atk:4,def:3,spd:60,xp:15,size:16,aggro:90,range:15,diet:'herb',color:'#263238',weight:8,tiles:[9,8],biome:'tundra' },
  walrus: { name:'海象',tier:3,hp:95,atk:23,def:9,spd:45,xp:60,size:28,aggro:180,range:35,diet:'carni',color:'#795548',weight:3,tiles:[8,9],biome:'tundra' },
  snow_leopard: { name:'雪豹',tier:3,hp:70,atk:27,def:5,spd:110,xp:65,size:20,aggro:230,range:40,diet:'carni',color:'#b0bec5',weight:3,tiles:[9],biome:'tundra' },

  // ── Deep Sea creatures ──────────────────────────────────────
  shark: { name:'鲨鱼',tier:3,hp:90,atk:27,def:5,spd:100,xp:60,size:26,aggro:240,range:40,diet:'carni',color:'#546e7a',weight:3,tiles:[2,3],water:true,biome:'deep_sea' },
  jellyfish: { name:'水母',tier:2,hp:25,atk:7,def:1,spd:40,xp:25,size:20,aggro:110,range:45,diet:'passive',color:'#e1bee7',weight:6,tiles:[2,3],water:true,biome:'deep_sea' },
  anglerfish: { name:'鮟鱇',tier:2,hp:45,atk:15,def:4,spd:50,xp:35,size:20,aggro:150,range:30,diet:'carni',color:'#37474f',weight:5,tiles:[3],water:true,biome:'deep_sea' },
  giant_squid: { name:'大王乌贼',tier:3,hp:75,atk:19,def:5,spd:70,xp:55,size:26,aggro:200,range:70,diet:'carni',color:'#880e4f',weight:4,tiles:[2,3],water:true,biome:'deep_sea' },
  sea_urchin: { name:'海胆',tier:1,hp:20,atk:8,def:6,spd:15,xp:15,size:16,aggro:70,range:15,diet:'passive',color:'#4a148c',weight:8,tiles:[2,3],water:true,biome:'deep_sea' },
  moray_eel: { name:'海鳗',tier:2,hp:50,atk:17,def:3,spd:80,xp:40,size:20,aggro:160,range:35,diet:'carni',color:'#33691e',weight:4,tiles:[2,3],water:true,biome:'deep_sea' },
  pufferfish: { name:'河豚',tier:2,hp:35,atk:6,def:3,spd:45,xp:30,size:18,aggro:120,range:20,diet:'passive',color:'#ffb74d',weight:6,tiles:[2,3],water:true,biome:'deep_sea' }
};

// Biome-to-creature mapping for spawn system
export const BIOME_CREATURES = {
  rainforest: ['beetle','frog','monkey','python','poison_frog','army_ant','spider','snake','centipede','mantis','piranha'],
  desert: ['beetle','scorpion','camel_spider','horned_lizard','vulture','rattlesnake','fire_ant','sidewinder','desert_tortoise'],
  tundra: ['polar_bear','arctic_fox','seal','snowy_owl','beetle','crab','penguin','walrus','snow_leopard'],
  deep_sea: ['fish','octopus','shark','jellyfish','anglerfish','giant_squid','sea_urchin','moray_eel','pufferfish']
};

export const BIOME_BOSSES = {
  rainforest: 'boss',
  desert: 'sand_worm',
  tundra: 'frost_crab',
  deep_sea: 'kraken_boss'
};
