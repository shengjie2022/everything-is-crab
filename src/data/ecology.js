// ─── ecology.js ─── Inter-species relationship definitions ───

export const RELATION = {
  PREDATOR: 'predator',       // A hunts B
  COMPETITION: 'competition', // A and B fight over territory
  SYMBIOSIS: 'symbiosis',     // A and B benefit from proximity
  PARASITE: 'parasite',       // A drains B
  SCAVENGER: 'scavenger'      // A feeds on dead B
};

// Format: { attacker: target: relation }
// Predator relations are directional (A->B means A hunts B)
// Competition/symbiosis are mutual
export const ECOLOGY_MAP = {
  // Predator relationships
  spider:       { beetle: 'predator', army_ant: 'predator' },
  snake:        { frog: 'predator', poison_frog: 'predator' },
  python:       { monkey: 'predator', frog: 'predator', horned_lizard: 'predator' },
  scorpion:     { beetle: 'predator', spider: 'predator' },
  shark:        { fish: 'predator', seal: 'predator', jellyfish: 'predator' },
  polar_bear:   { seal: 'predator', arctic_fox: 'predator', fish: 'predator' },
  camel_spider: { beetle: 'predator', horned_lizard: 'predator' },
  rattlesnake:  { horned_lizard: 'predator', army_ant: 'predator' },
  snowy_owl:    { arctic_fox: 'predator', army_ant: 'predator' },
  giant_squid:  { fish: 'predator', jellyfish: 'predator', anglerfish: 'predator' },
  octopus:      { crab: 'predator', fish: 'predator' },
  vulture:      { beetle: 'scavenger', army_ant: 'scavenger' },

  // Competition relationships (same tier fighting over territory)
  crab:         { crab: 'competition', scorpion: 'competition' },
  frog:         { poison_frog: 'competition' },
  arctic_fox:   { snowy_owl: 'competition' },

  // Symbiosis
  anglerfish:   { jellyfish: 'symbiosis' },
  monkey:       { poison_frog: 'symbiosis' },

  // Parasite
  army_ant:     { python: 'parasite' }
};

// Scavenger types - will move toward dead creature locations
export const SCAVENGERS = ['vulture', 'army_ant', 'beetle'];

// Symbiosis bonus: when within range, both get benefits
export const SYMBIOSIS_RANGE = 80;
export const SYMBIOSIS_HEAL_RATE = 1; // HP per second
export const SYMBIOSIS_SPEED_BONUS = 0.1; // 10% speed boost
