export const EVO_NODES = [
  // Base
  {id:'base',name:'史莱姆',branch:'none',req:[],cost:0,crab:0,stat:{},trait:null,form:'slime',desc:'起始形态'},
  // Arthropod branch
  {id:'a_claw1',name:'小螯',branch:'arthropod',req:['base'],cost:2,crab:1,stat:{atk:2},trait:'claw',form:null,desc:'ATK+2，钳击'},
  {id:'a_shell',name:'硬壳',branch:'arthropod',req:['base'],cost:2,crab:1,stat:{def:3,hp:5},trait:'shell',form:null,desc:'ARM+3，HP+5'},
  {id:'a_side',name:'侧行步',branch:'arthropod',req:['a_shell'],cost:3,crab:1,stat:{spd:3},trait:'sidestep',form:null,desc:'SPD+3，侧向冲刺'},
  {id:'a_eye',name:'复眼',branch:'arthropod',req:['base'],cost:2,crab:1,stat:{sen:5},trait:'compound_eye',form:null,desc:'SEN+5，感知范围扩大'},
  {id:'a_claw2',name:'巨螯',branch:'arthropod',req:['a_claw1','a_side'],cost:4,crab:2,stat:{atk:8},trait:'big_claw',form:'crab_form',desc:'ATK+8，可夹碎硬壳'},
  {id:'a_armor',name:'甲壳装甲',branch:'arthropod',req:['a_shell','a_shell'],cost:5,crab:2,stat:{def:8,hp:10},trait:'armor',form:null,desc:'ARM+8，反弹20%伤害'},
  {id:'a_regen',name:'再生螯',branch:'arthropod',req:['a_claw2'],cost:5,crab:1,stat:{reg:3},trait:'regen_claw',form:null,desc:'REG+3，断肢后快速再生'},
  {id:'a_king',name:'帝王之钳',branch:'arthropod',req:['a_claw2','a_armor'],cost:7,crab:3,stat:{atk:15,def:5,hp:30},trait:'emperor_claw',form:'crab_king',desc:'ATK+15，范围抓取+碾压'},
  {id:'a_coconut',name:'椰子蟹爪',branch:'arthropod',req:['a_claw2'],cost:5,crab:2,stat:{atk:12},trait:'coconut_claw',form:null,desc:'ATK+12，可夹碎坚硬物体'},
  // Mollusk branch
  {id:'m_tent',name:'触手',branch:'mollusk',req:['base'],cost:2,crab:0,stat:{atk:1},trait:'tentacle',form:null,desc:'ATK+1，攻击范围+'},
  {id:'m_ink',name:'墨囊',branch:'mollusk',req:['m_tent'],cost:3,crab:0,stat:{def:2},trait:'ink',form:null,desc:'释放墨汁，隐身3秒'},
  {id:'m_sucker',name:'吸盘',branch:'mollusk',req:['m_tent'],cost:3,crab:0,stat:{sen:3},trait:'sucker',form:null,desc:'SEN+3，可攀爬任何表面'},
  {id:'m_color',name:'变色皮',branch:'mollusk',req:['m_ink'],cost:4,crab:0,stat:{},trait:'camo',form:'octopus_form',desc:'静止时隐形'},
  {id:'m_beak',name:'喙嘴',branch:'mollusk',req:['m_tent'],cost:4,crab:0,stat:{atk:6},trait:'beak',form:null,desc:'ATK+6，破甲攻击'},
  {id:'m_bigeye',name:'巨型眼球',branch:'mollusk',req:['m_ink'],cost:5,crab:0,stat:{sen:10},trait:'big_eye',form:null,desc:'SEN+10，感知范围大幅增加'},
  {id:'m_kraken',name:'深渊形态',branch:'mollusk',req:['m_beak','m_color'],cost:7,crab:0,stat:{atk:15,hp:40},trait:'kraken',form:'kraken_form',desc:'深渊形态'},
  // Vertebrate branch
  {id:'v_spine',name:'脊椎',branch:'vertebrate',req:['base'],cost:2,crab:0,stat:{hp:5,spd:2},trait:'spine',form:null,desc:'HP+5，移动更稳定'},
  {id:'v_jaw',name:'颌骨',branch:'vertebrate',req:['v_spine'],cost:3,crab:0,stat:{atk:4},trait:'jaw',form:null,desc:'ATK+4，撕咬攻击'},
  {id:'v_limb',name:'四肢',branch:'vertebrate',req:['v_spine'],cost:3,crab:0,stat:{spd:3},trait:'limbs',form:'lizard_form',desc:'SPD+3，陆地加速'},
  {id:'v_claw',name:'利爪',branch:'vertebrate',req:['v_limb'],cost:4,crab:0,stat:{atk:6},trait:'sharp_claw',form:null,desc:'ATK+6，流血效果'},
  {id:'v_fang',name:'毒牙',branch:'vertebrate',req:['v_jaw','v_claw'],cost:5,crab:0,stat:{atk:3},trait:'venom_fang',form:null,desc:'ATK+3，附加中毒'},
  {id:'v_wing',name:'翅膀',branch:'vertebrate',req:['v_limb'],cost:5,crab:0,stat:{spd:5},trait:'wings',form:null,desc:'短距离飞行/滑翔'},
  {id:'v_dragon',name:'龙化形态',branch:'vertebrate',req:['v_fang','v_wing'],cost:8,crab:0,stat:{atk:20,def:10,hp:30,spd:10},trait:'dragon',form:'dragon_form',desc:'龙化形态'},
  // Special branch
  {id:'s_absorb',name:'吸收强化',branch:'special',req:['base'],cost:2,crab:0,stat:{hp:10},trait:'absorb',form:null,desc:'吞噬回复量增加'},
  {id:'s_photo',name:'光合作用',branch:'special',req:['s_absorb'],cost:3,crab:0,stat:{reg:2},trait:'photosyn',form:null,desc:'REG+2，白天缓慢回血'},
  {id:'s_crystal',name:'晶体外壳',branch:'special',req:['s_absorb'],cost:4,crab:0,stat:{def:6},trait:'crystal',form:'crystal_form',desc:'DEF+6，反弹伤害'},
  {id:'s_fungus',name:'真菌共生',branch:'special',req:['s_absorb'],cost:3,crab:0,stat:{hp:20,reg:1},trait:'fungus',form:'fungus_form',desc:'HP+20，REG+1，释放孢子'},
  {id:'s_chaos',name:'混沌形态',branch:'special',req:['s_crystal','s_fungus'],cost:7,crab:0,stat:{atk:12,def:8,hp:30,spd:8},trait:'chaos',form:'chaos_form',desc:'混沌融合形态(需0蟹化)'},
  // Hidden evolutions (unlocked via HiddenEvolutionTracker conditions)
  {id:'h_pistol_shrimp',name:'手枪虾螯',branch:'arthropod',req:['a_claw2'],cost:5,crab:2,stat:{atk:20},trait:'pistol_shrimp',form:'pistol_shrimp_form',desc:'发射冲击波远程攻击',hidden:true},
  {id:'h_jellyfish_immortal',name:'灯塔水母',branch:'special',req:['base'],cost:4,crab:0,stat:{hp:30,reg:5},trait:'immortal_jelly',form:'immortal_jelly_form',desc:'死亡后重生1次',hidden:true},
  {id:'h_tardigrade',name:'水熊虫',branch:'special',req:['s_absorb'],cost:6,crab:0,stat:{def:15,hp:40},trait:'tardigrade',form:'tardigrade_form',desc:'极端环境完全免疫',hidden:true},
  {id:'h_chimera',name:'奇美拉',branch:'special',req:['s_chaos'],cost:8,crab:0,stat:{atk:25,def:15,hp:50,spd:15,sen:10,reg:5},trait:'chimera',form:'chimera_form',desc:'融合三大类别的终极形态',hidden:true},
  {id:'h_primordial',name:'原初之泥',branch:'special',req:['base'],cost:0,crab:0,stat:{atk:15,def:10,hp:40,spd:20,sen:5,reg:3},trait:'primordial',form:'slime',desc:'回归史莱姆但全属性大幅提升',hidden:true}
];

export const CRAB_THRESHOLDS = [
  {val:5,name:'初阶蟹化',bonus:{def:5,hp:20,spd:3},desc:'侧向移动加速，水中呼吸'},
  {val:10,name:'完全蟹化',bonus:{def:8,atk:10,hp:30},desc:'帝王之钳，范围伤害+抓取'},
  {val:15,name:'超蟹化',bonus:{def:12,atk:12,hp:50,spd:-5},desc:'完全蟹化形态，隐藏结局线索'}
];

export const ZERO_CRAB_BONUS = {bonus:{spd:15,atk:8},desc:'原始纯净：速度+15，攻击+8'};
