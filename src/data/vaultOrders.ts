export interface Relic {
  id: string;
  name: string;
  description: string;
  philosophicalEssence: string;
  price: string;
  image: string;
  era?: 'modern' | 'classic' | 'vintage';
}

export interface Instrument {
  id: string;
  name: string;
  description: string;
  relics: Relic[];
}

export interface VaultOrder {
  id: string;
  title: string;
  essence: string;
  emotionalTrigger: string;
  latinInscription: string;
  microcopy: string;
  icon: string;
  colorTheme: {
    primary: string;
    glow: string;
  };
  instruments: Instrument[];
}

export const vaultOrders: VaultOrder[] = [
  {
    id: 'time',
    title: 'Order of Time',
    essence: 'Mastery over rhythm and moment',
    emotionalTrigger: 'Control',
    latinInscription: 'TEMPUS DOMINI SOLIS',
    microcopy: 'Instruments of Command',
    icon: '⌚',
    colorTheme: {
      primary: 'rgb(196, 166, 97)',
      glow: 'rgba(196, 166, 97, 0.3)',
    },
    instruments: [
      {
        id: 'chronometers',
        name: 'Chronometers',
        description: 'Precision timepieces for those who command their hours',
        relics: [
          {
            id: 'perpetual-dominion',
            name: 'Perpetual Dominion',
            description: 'Contemporary mastery forged with perpetual calendar',
            philosophicalEssence: 'Time bends to your command',
            price: 'By Request',
            image: '/src/assets/collection-watches.jpg',
            era: 'modern',
          },
          {
            id: 'lunar-presence',
            name: 'Lunar Presence',
            description: 'Moon phase innovation in steel and gold',
            philosophicalEssence: 'The cosmos measured by your wrist',
            price: 'By Request',
            image: '/src/assets/collection-watches.jpg',
            era: 'modern',
          },
        ],
      },
      {
        id: 'heritage-chronographs',
        name: 'Heritage Chronographs',
        description: 'Certified instruments with original provenance',
        relics: [
          {
            id: 'heritage-chronograph',
            name: 'Heritage Chronograph',
            description: 'Certified 1960s instrument with original provenance',
            philosophicalEssence: 'Legacy in steel',
            price: 'By Request',
            image: '/src/assets/collection-tailoring.jpg',
            era: 'classic',
          },
          {
            id: 'dress-watch-heritage',
            name: 'Dress Watch Heritage',
            description: 'Hand-wound refinement from the golden age',
            philosophicalEssence: 'Elegance that transcends eras',
            price: 'By Request',
            image: '/src/assets/collection-tailoring.jpg',
            era: 'classic',
          },
        ],
      },
      {
        id: 'vintage-relics',
        name: 'Vintage Relics',
        description: 'Echoes of mastery from eras past',
        relics: [
          {
            id: 'golden-era-diver',
            name: 'Golden Era Diver',
            description: 'Rare 1950s diver\'s relic with patinated dial',
            philosophicalEssence: 'Forged in the age of exploration',
            price: 'By Request',
            image: '/src/assets/collection-leather.jpg',
            era: 'vintage',
          },
          {
            id: 'racing-chronograph',
            name: 'Racing Chronograph',
            description: 'Motorsport heritage from racing\'s golden age',
            philosophicalEssence: 'Speed made sacred',
            price: 'By Request',
            image: '/src/assets/collection-leather.jpg',
            era: 'vintage',
          },
        ],
      },
    ],
  },
  {
    id: 'thought',
    title: 'Order of Thought',
    essence: 'Power of mind and word',
    emotionalTrigger: 'Influence',
    latinInscription: 'VERBA VINCUNT MUNDUM',
    microcopy: 'Implements of Influence',
    icon: '✒️',
    colorTheme: {
      primary: 'rgb(186, 154, 91)',
      glow: 'rgba(186, 154, 91, 0.3)',
    },
    instruments: [
      {
        id: 'writing-instruments',
        name: 'Writing Instruments',
        description: 'For those who shape reality through word',
        relics: [],
      },
      {
        id: 'notebooks',
        name: 'Notebooks',
        description: 'Where intention becomes immortal',
        relics: [],
      },
      {
        id: 'wax-seals',
        name: 'Wax Seals',
        description: 'Mark your authority in gold and fire',
        relics: [],
      },
    ],
  },
  {
    id: 'presence',
    title: 'Order of Presence',
    essence: 'Command through refinement',
    emotionalTrigger: 'Authority',
    latinInscription: 'FORMA EST IMPERIUM',
    microcopy: 'Objects of Command',
    icon: '💍',
    colorTheme: {
      primary: 'rgb(176, 144, 81)',
      glow: 'rgba(176, 144, 81, 0.3)',
    },
    instruments: [
      {
        id: 'rings',
        name: 'Signet Rings',
        description: 'Symbols that anchor identity',
        relics: [],
      },
      {
        id: 'cufflinks',
        name: 'Cufflinks',
        description: 'Precision in every detail',
        relics: [],
      },
      {
        id: 'wallets',
        name: 'Leather Wallets',
        description: 'Refined repositories of power',
        relics: [],
      },
    ],
  },
  {
    id: 'ritual',
    title: 'Order of Ritual',
    essence: 'Precision through repetition',
    emotionalTrigger: 'Discipline',
    latinInscription: 'ORDO AB DISCIPLINA',
    microcopy: 'Implements of Discipline',
    icon: '🔥',
    colorTheme: {
      primary: 'rgb(166, 134, 71)',
      glow: 'rgba(166, 134, 71, 0.3)',
    },
    instruments: [
      {
        id: 'lighters',
        name: 'Lighters',
        description: 'Command over flame and focus',
        relics: [],
      },
      {
        id: 'blades',
        name: 'Blades',
        description: 'Precision instruments for the refined',
        relics: [],
      },
      {
        id: 'grooming',
        name: 'Grooming Tools',
        description: 'Discipline starts with the mirror',
        relics: [],
      },
    ],
  },
  {
    id: 'legacy',
    title: 'Order of Legacy',
    essence: 'Continuity beyond self',
    emotionalTrigger: 'Honor',
    latinInscription: 'AETERNUM PERMANET',
    microcopy: 'Artifacts of Permanence',
    icon: '🦅',
    colorTheme: {
      primary: 'rgb(156, 124, 61)',
      glow: 'rgba(156, 124, 61, 0.3)',
    },
    instruments: [
      {
        id: 'leather-goods',
        name: 'Leather Goods',
        description: 'Artifacts that outlast trends',
        relics: [],
      },
      {
        id: 'storage',
        name: 'Storage Relics',
        description: 'Sanctuaries for instruments of mastery',
        relics: [],
      },
      {
        id: 'travel',
        name: 'Travel Companions',
        description: 'Command presence wherever you go',
        relics: [],
      },
    ],
  },
];
