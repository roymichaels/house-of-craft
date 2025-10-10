export interface RelicData {
  id: string;
  name: string;
  title: string;
  category: string;
  description: string;
  story: string;
  image: string;
  price?: string;
  chamber: 'mastery' | 'vault';
}

export const relics: Record<string, RelicData> = {
  watch: {
    id: 'watch',
    name: 'watch',
    title: 'Instrument of Time',
    category: 'Timepiece',
    description: 'A mechanical witness to the dominion of hours. Not a decoration. A declaration.',
    story: 'Each tick is a reminder: time bends to those who master it. This is not about telling time—it is about commanding it. Forged with precision, worn with purpose.',
    image: '/assets/hero-watch.jpg',
    chamber: 'mastery'
  },
  pen: {
    id: 'pen',
    name: 'pen',
    title: 'Instrument of Thought',
    category: 'Writing Implement',
    description: 'Words shape reality. This is the blade that carves meaning into the void.',
    story: 'A tool of legacy. What you write with this becomes immutable—ideas that outlast empires. The ancients knew: he who controls the word, controls the world.',
    image: '/placeholder.svg',
    chamber: 'mastery'
  },
  ring: {
    id: 'ring',
    name: 'ring',
    title: 'Seal of Command',
    category: 'Signet Ring',
    description: 'Authority worn. Power recognized without words.',
    story: 'In ancient Rome, a signet ring was law itself. This continues that lineage. When you wear this, doors open. Conversations shift. Respect is given before earned.',
    image: '/placeholder.svg',
    chamber: 'mastery'
  },
  seal: {
    id: 'seal',
    name: 'seal',
    title: 'Mark of The House',
    category: 'Wax Seal',
    description: 'Your signature in wax and gold. A mark that cannot be forged.',
    story: 'When you seal a letter with this, the recipient knows: this comes from power. Not influence. Not status. Power. The kind that built empires.',
    image: '/placeholder.svg',
    chamber: 'mastery'
  },
  vault_centurion: {
    id: 'vault_centurion',
    name: 'vault_centurion',
    title: 'The Centurion',
    category: 'Limited Collection',
    description: 'Only 100 exist. Each numbered. Each a relic of time conquered.',
    story: 'Forged in Switzerland, sealed in obsidian. This is not mass production—this is controlled scarcity. When you own this, you join the ranks of those who refuse mediocrity.',
    image: '/assets/hero-watch.jpg',
    price: 'Upon Request',
    chamber: 'vault'
  },
  vault_sovereign: {
    id: 'vault_sovereign',
    name: 'vault_sovereign',
    title: 'The Sovereign',
    category: 'Leather Collection',
    description: 'Full-grain leather. Hand-stitched. Built to outlast trends.',
    story: 'This is not fashion. This is armor. Crafted by artisans who understand: what you carry defines how you move through the world.',
    image: '/assets/collection-leather.jpg',
    price: 'Upon Request',
    chamber: 'vault'
  },
  vault_legacy: {
    id: 'vault_legacy',
    name: 'vault_legacy',
    title: 'The Legacy',
    category: 'Bespoke Tailoring',
    description: 'Tailored to your exact measurements. Cut to your exact purpose.',
    story: 'Every stitch is intentional. Every line is deliberate. This is what you wear when surrender is not an option.',
    image: '/assets/collection-tailoring.jpg',
    price: 'Upon Request',
    chamber: 'vault'
  },
  vault_chronicle: {
    id: 'vault_chronicle',
    name: 'vault_chronicle',
    title: 'The Chronicle',
    category: 'Master Collection',
    description: 'The pinnacle. Reserved for those who have proven themselves worthy.',
    story: 'This piece does not announce arrival. It confirms dominion. Acquisition requires consultation with The House. Not everyone is ready.',
    image: '/assets/collection-watches.jpg',
    price: 'By Consultation Only',
    chamber: 'vault'
  }
};
