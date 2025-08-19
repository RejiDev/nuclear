// Diminishing Returns data for PvP
// Imported from DRList-1.0 project - retail expansion only (excludes Season of Discovery)
// Source: https://github.com/wardz/DRList-1.0/

export const drCategories = {
  // Category names with localized descriptions
  disorient: "Disorients",
  incapacitate: "Incapacitates",
  silence: "Silences",
  stun: "Stuns",
  root: "Roots",
  disarm: "Disarms",
  taunt: "Taunts",
  knockback: "Knockbacks"
};

// DR reset times in seconds
export const drResetTimes = {
  default: 18.5, // Static 18 sec (+0.5 latency) reset time for most categories
  npc: 20, // Against mobs it seems to still be dynamic, set it to max
  knockback: 10.5, // Knockbacks are immediately immune and only DRs for 10s
};

// Categories that have DR against normal mobs
export const drCategoriesPvE = {
  taunt: "Taunts",
  stun: "Stuns"
};

// Successive diminished durations
export const drDiminishedDurations = {
  // Decreases by 50%, immune at the 4th application
  default: [0.50, 0.25],
  // Decreases by 35%, immune at the 5th application
  taunt: [0.65, 0.42, 0.27],
  // Immediately immune
  knockback: []
};

// Spell ID to DR category mapping (retail WoW only, excludes Season of Discovery)
export const drSpellList = {
  // *** Disorient Effects ***
  207167: "disorient", // Blinding Sleet
  207685: "disorient", // Sigil of Misery
  33786: "disorient", // Cyclone
  360806: "disorient", // Sleep Walk
  1513: "disorient", // Scare Beast
  31661: "disorient", // Dragon's Breath
  353084: "disorient", // Ring of Fire
  198909: "disorient", // Song of Chi-ji
  202274: "disorient", // Hot Trub
  105421: "disorient", // Blinding Light
  10326: "disorient", // Turn Evil
  205364: "disorient", // Dominate Mind
  605: "disorient", // Mind Control
  8122: "disorient", // Psychic Scream
  2094: "disorient", // Blind
  118699: "disorient", //
  130616: "disorient", // Fear (Horrify)
  5484: "disorient", // Howl of Terror
  261589: "disorient", // Seduction (Grimoire of Sacrifice)
  6358: "disorient", // Seduction (Succubus)
  5246: "disorient", // Intimidating Shout
  316593: "disorient", // Intimidating Shout (Menace Main Target)
  316595: "disorient", // Intimidating Shout (Menace Other Targets)
  331866: "disorient", // Agent of Chaos (Venthyr Covenant)
  324263: "disorient", // Sulfuric Emission (Soulbind Ability)

  // *** Incapacitate Effects ***
  217832: "incapacitate", // Imprison
  221527: "incapacitate", // Imprison (Honor talent)
  2637: "incapacitate", // Hibernate
  99: "incapacitate", // Incapacitating Roar
  378441: "incapacitate", // Time Stop
  3355: "incapacitate", // Freezing Trap
  203337: "incapacitate", // Freezing Trap (Honor talent)
  213691: "incapacitate", // Scatter Shot
  383121: "incapacitate", // Mass Polymorph
  118: "incapacitate", // Polymorph
  28271: "incapacitate", // Polymorph (Turtle)
  28272: "incapacitate", // Polymorph (Pig)
  61025: "incapacitate", // Polymorph (Snake)
  61305: "incapacitate", // Polymorph (Black Cat)
  61780: "incapacitate", // Polymorph (Turkey)
  61721: "incapacitate", // Polymorph (Rabbit)
  126819: "incapacitate", // Polymorph (Porcupine)
  161353: "incapacitate", // Polymorph (Polar Bear Cub)
  161354: "incapacitate", // Polymorph (Monkey)
  161355: "incapacitate", // Polymorph (Penguin)
  161372: "incapacitate", // Polymorph (Peacock)
  277787: "incapacitate", // Polymorph (Baby Direhorn)
  277792: "incapacitate", // Polymorph (Bumblebee)
  321395: "incapacitate", // Polymorph (Mawrat)
  391622: "incapacitate", // Polymorph (Duck)
  460396: "incapacitate", // Polymorph (Mosswool)
  461489: "incapacitate", // Polymorph (Mosswool) 2
  82691: "incapacitate", // Ring of Frost
  115078: "incapacitate", // Paralysis
  357768: "incapacitate", // Paralysis 2 (Perpetual Paralysis?)
  20066: "incapacitate", // Repentance
  9484: "incapacitate", // Shackle Undead
  200196: "incapacitate", // Holy Word: Chastise
  1776: "incapacitate", // Gouge
  6770: "incapacitate", // Sap
  51514: "incapacitate", // Hex
  196942: "incapacitate", // Hex (Voodoo Totem)
  210873: "incapacitate", // Hex (Raptor)
  211004: "incapacitate", // Hex (Spider)
  211010: "incapacitate", // Hex (Snake)
  211015: "incapacitate", // Hex (Cockroach)
  269352: "incapacitate", // Hex (Skeletal Hatchling)
  309328: "incapacitate", // Hex (Living Honey)
  277778: "incapacitate", // Hex (Zandalari Tendonripper)
  277784: "incapacitate", // Hex (Wicker Mongrel)
  197214: "incapacitate", // Sundering
  710: "incapacitate", // Banish
  6789: "incapacitate", // Mortal Coil
  107079: "incapacitate", // Quaking Palm (Racial, Pandaren)

  // *** Controlled Stun Effects ***
  210141: "stun", // Zombie Explosion
  377048: "stun", // Absolute Zero (Breath of Sindragosa)
  108194: "stun", // Asphyxiate (Unholy)
  221562: "stun", // Asphyxiate (Blood)
  91800: "stun", // Gnaw (Ghoul)
  91797: "stun", // Monstrous Blow (Mutated Ghoul)
  287254: "stun", // Dead of Winter
  179057: "stun", // Chaos Nova
  205630: "stun", // Illidan's Grasp (Primary effect)
  208618: "stun", // Illidan's Grasp (Secondary effect)
  211881: "stun", // Fel Eruption
  200166: "stun", // Metamorphosis (PvE stun effect)
  203123: "stun", // Maim
  163505: "stun", // Rake (Prowl)
  5211: "stun", // Mighty Bash
  202244: "stun", // Overrun
  325321: "stun", // Wild Hunt's Charge
  372245: "stun", // Terror of the Skies
  408544: "stun", // Seismic Slam
  117526: "stun", // Binding Shot
  357021: "stun", // Consecutive Concussion
  24394: "stun", // Intimidation
  389831: "stun", // Snowdrift
  119381: "stun", // Leg Sweep
  458605: "stun", // Leg Sweep 2
  202346: "stun", // Double Barrel
  853: "stun", // Hammer of Justice
  255941: "stun", // Wake of Ashes
  64044: "stun", // Psychic Horror
  200200: "stun", // Holy Word: Chastise Censure
  1833: "stun", // Cheap Shot
  408: "stun", // Kidney Shot
  118905: "stun", // Static Charge (Capacitor Totem)
  118345: "stun", // Pulverize (Primal Earth Elemental)
  305485: "stun", // Lightning Lasso
  89766: "stun", // Axe Toss
  171017: "stun", // Meteor Strike (Infernal)
  171018: "stun", // Meteor Strike (Abyssal)
  30283: "stun", // Shadowfury
  385954: "stun", // Shield Charge
  46968: "stun", // Shockwave
  132168: "stun", // Shockwave (Protection)
  145047: "stun", // Shockwave (Proving Grounds PvE)
  132169: "stun", // Storm Bolt
  199085: "stun", // Warpath
  20549: "stun", // War Stomp (Racial, Tauren)
  255723: "stun", // Bull Rush (Racial, Highmountain Tauren)
  332423: "stun", // Sparkling Driftglobe Core (Kyrian Covenant)

  // *** Controlled Root Effects ***
  204085: "root", // Deathchill (Chains of Ice)
  233395: "root", // Deathchill (Remorseless Winter)
  454787: "root", // Ice Prison
  339: "root", // Entangling Roots
  235963: "root", // Entangling Roots (Earthen Grasp)
  170855: "root", // Entangling Roots (Nature's Grasp)
  102359: "root", // Mass Entanglement
  355689: "root", // Landslide
  393456: "root", // Entrapment (Tar Trap)
  162480: "root", // Steel Trap
  212638: "root", // Tracker's Net
  201158: "root", // Super Sticky Tar
  122: "root", // Frost Nova
  33395: "root", // Freeze
  386770: "root", // Freezing Cold
  378760: "root", // Frostbite
  114404: "root", // Void Tendril's Grasp
  342375: "root", // Tormenting Backlash (Torghast PvE)
  116706: "root", // Disable
  324382: "root", // Clash
  64695: "root", // Earthgrab (Totem effect)
  285515: "root", // Surge of Power
  199042: "root", // Thunderstruck (Protection PvP Talent)
  39965: "root", // Frost Grenade (Item)
  75148: "root", // Embersilk Net (Item)
  55536: "root", // Frostweave Net (Item)
  268966: "root", // Hooked Deep Sea Net (Item)

  // *** Silence Effects ***
  47476: "silence", // Strangulate
  374776: "silence", // Tightening Grasp
  204490: "silence", // Sigil of Silence
  410065: "silence", // Reactive Resin
  202933: "silence", // Spider Sting
  356727: "silence", // Spider Venom
  354831: "silence", // Wailing Arrow 1
  355596: "silence", // Wailing Arrow 2
  217824: "silence", // Shield of Virtue
  15487: "silence", // Silence
  1330: "silence", // Garrote
  196364: "silence", // Unstable Affliction Silence Effect
  252188: "silence", // Solar Beam

  // *** Disarm Weapon Effects ***
  209749: "disarm", // Faerie Swarm (Balance Honor Talent)
  407032: "disarm", // Sticky Tar Bomb 1
  407031: "disarm", // Sticky Tar Bomb 2
  207777: "disarm", // Dismantle
  233759: "disarm", // Grapple Weapon
  236077: "disarm", // Disarm

  // *** Force Taunt Effects ***
  56222: "taunt", // Dark Command
  51399: "taunt", // Death Grip (Taunt Effect)
  185245: "taunt", // Torment
  6795: "taunt", // Growl (Druid)
  2649: "taunt", // Growl (Hunter Pet)
  20736: "taunt", // Distracting Shot
  116189: "taunt", // Provoke
  118635: "taunt", // Provoke (Black Ox Statue)
  196727: "taunt", // Provoke (Niuzao)
  204079: "taunt", // Final Stand
  62124: "taunt", // Hand of Reckoning
  17735: "taunt", // Suffering (Voidwalker)
  1161: "taunt", // Challenging Shout
  355: "taunt", // Taunt

  // *** Controlled Knockback Effects ***
  108199: "knockback", // Gorefiend's Grasp
  202249: "knockback", // Overrun
  61391: "knockback", // Typhoon
  102793: "knockback", // Ursol's Vortex
  431620: "knockback", // Upheaval
  186387: "knockback", // Bursting Shot
  236776: "knockback", // Hi-Explosive Trap
  236777: "knockback", // Hi-Explosive Trap 2
  462031: "knockback", // Implosive Trap
  157981: "knockback", // Blast Wave
  51490: "knockback", // Thunderstorm
  368970: "knockback", // Tail Swipe (Racial, Dracthyr)
  357214: "knockback", // Wing Buffet (Racial, Dracthyr)
};

// Spells with shared DR categories (spell ID maps to array of categories)
export const drSharedCategories = {
  287712: ["stun", "knockback"], // Haymaker (Racial, Kul Tiran)
};

// Helper functions
export const drHelpers = {
  /**
   * Get DR category by spell ID
   * @param {number} spellID - The spell ID to check
   * @returns {string|string[]|null} - Category string, array of categories for shared DRs, or null if not found
   */
  getCategoryBySpellID(spellID) {
    if (drSharedCategories[spellID]) {
      return drSharedCategories[spellID];
    }
    return drSpellList[spellID] || null;
  },

  /**
   * Get reset time for a DR category
   * @param {string} category - The DR category
   * @returns {number} - Reset time in seconds
   */
  getResetTime(category = "default") {
    return drResetTimes[category] || drResetTimes.default;
  },

  /**
   * Get next diminished duration
   * @param {number} diminished - How many times DR has been applied
   * @param {string} category - The DR category
   * @returns {number} - Diminished duration multiplier (0-1) or 0 for immune
   */
  getNextDR(diminished, category = "default") {
    const durations = drDiminishedDurations[category] || drDiminishedDurations.default;
    return durations[diminished] || 0;
  },

  /**
   * Check if category has DR against mobs
   * @param {string} category - The DR category
   * @returns {boolean} - True if category has PvE DR
   */
  isPvECategory(category) {
    return !!drCategoriesPvE[category];
  },

  /**
   * Get localized category name
   * @param {string} category - The DR category
   * @returns {string|null} - Localized name or null if not found
   */
  getCategoryLocalization(category) {
    return drCategories[category] || null;
  },

  /**
   * Iterate through spells of a given category
   * @param {string|null} category - Category to filter by, or null for all spells
   * @returns {Generator} - Generator yielding [spellID, category] pairs
   */
  *iterateSpellsByCategory(category = null) {
    if (category) {
      // Iterate through main spell list
      for (const [spellID, spellCategory] of Object.entries(drSpellList)) {
        if (spellCategory === category) {
          yield [parseInt(spellID), category];
        }
      }
      // Iterate through shared categories
      for (const [spellID, categories] of Object.entries(drSharedCategories)) {
        if (categories.includes(category)) {
          yield [parseInt(spellID), category];
        }
      }
    } else {
      // Return all spells
      for (const [spellID, spellCategory] of Object.entries(drSpellList)) {
        yield [parseInt(spellID), spellCategory];
      }
      for (const [spellID, categories] of Object.entries(drSharedCategories)) {
        yield [parseInt(spellID), categories];
      }
    }
  }
};

export default {
  categories: drCategories,
  resetTimes: drResetTimes,
  categoriesPvE: drCategoriesPvE,
  diminishedDurations: drDiminishedDurations,
  spellList: drSpellList,
  sharedCategories: drSharedCategories,
  helpers: drHelpers
};
