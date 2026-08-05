import { Product, AtelierBoutique } from '../types';
import heroImg from '../assets/images/special_glow_hero_1785434567085.jpg';
import serumImg from '../assets/images/special_glow_serum_1785434577576.jpg';
import perfumeImg from '../assets/images/special_glow_perfume_1785434590068.jpg';
import atelierImg from '../assets/images/special_glow_atelier_1785434602713.jpg';

export { heroImg, atelierImg };

export const PRODUCTS: Product[] = [
  {
    id: 'sg-perfume-01',
    name: 'Velvet Oud & Olive',
    subtitle: 'Eau de Parfum',
    category: 'fragrances',
    price: 185,
    originalPrice: 210,
    rating: 4.9,
    reviewsCount: 128,
    isBestseller: true,
    isNew: false,
    description: 'A intoxicating fusion of rare Cambodian oud, sun-drenched Mediterranean olive blossom, smoked vetiver, and subtle whispers of warm amber.',
    image: perfumeImg,
    secondaryImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop',
    sizes: [
      { label: '50ml / 1.7 fl oz', priceModifier: 0 },
      { label: '100ml / 3.4 fl oz', priceModifier: 55 },
    ],
    fragranceNotes: {
      top: ['Wild Olive Blossom', 'Bergamot Zest', 'Cardamom Pods'],
      heart: ['Damask Rose', 'Smoked Incense', 'Rare Oud Accord'],
      base: ['Bourbon Vanilla', 'Atlas Cedarwood', 'Crisp Amber'],
    },
    ingredients: ['Alcohol Denat.', 'Parfum (Fragrance)', 'Aqua (Water)', 'Limonene', 'Linalool', 'Eugenol'],
    howToUse: 'Spritz generously onto pulse points—wrists, inner elbows, and base of the neck. Allow the scent to warm naturally on skin without rubbing.'
  },
  {
    id: 'sg-skincare-01',
    name: 'Golden Radiance Elixir',
    subtitle: 'Botanical Face Oil & Serum',
    category: 'skincare',
    price: 140,
    rating: 4.95,
    reviewsCount: 214,
    isBestseller: true,
    isNew: true,
    description: 'A weightless yet deeply restoring facial nectar enriched with cold-pressed olive squalane, 24K bio-gold flakes, and sea buckthorn extract.',
    image: serumImg,
    secondaryImage: 'https://images.unsplash.com/photo-1608248597263-0057e57b4524?q=80&w=1000&auto=format&fit=crop',
    sizes: [
      { label: '30ml / 1.0 fl oz', priceModifier: 0 },
      { label: '60ml / 2.0 fl oz', priceModifier: 40 },
    ],
    skincareBenefits: [
      'Locks in deep moisture for 72 hours',
      'Stimulates collagen and elasticity',
      'Enhances natural luminosity without grease'
    ],
    ingredients: ['Squalane (Olive Derived)', 'Rosehip Seed Oil', 'Bakuchiol', 'Gold Flakes 24K', 'Vitamin E (Tocopherol)'],
    howToUse: 'Warm 3–4 drops between palms in the evening. Gently press into cleansed face and décolletage in upward circular motions.'
  },
  {
    id: 'sg-cosmetic-01',
    name: 'Luminous Matte Velvet Silk',
    subtitle: 'Editorial Hydrating Lipstick',
    category: 'cosmetics',
    price: 52,
    rating: 4.8,
    reviewsCount: 96,
    isBestseller: true,
    description: 'A weightless cashmere-feel lipstick that delivers intense pigment with a soft blurring focus and nourishing botanical butter complex.',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=1000&auto=format&fit=crop',
    sizes: [
      { label: 'Standard 3.8g', priceModifier: 0 },
    ],
    shades: [
      { id: 's1', name: 'Nude Olive Warmth', colorHex: '#B2826C' },
      { id: 's2', name: 'Velvet Mulberry', colorHex: '#692A38' },
      { id: 's3', name: 'Terracotta Earth', colorHex: '#9E4E37' },
      { id: 's4', name: 'Midnight Berry', colorHex: '#421C2B' }
    ],
    ingredients: ['Jojoba Seed Butter', 'Caprylic Triglyceride', 'Olive Fruit Extract', 'Iron Oxides', 'Natural Wax'],
    howToUse: 'Apply directly from bullet to center of lips, pressing lightly. Blending out with fingertips yields a gorgeous blotted stain.'
  },
  {
    id: 'sg-perfume-02',
    name: 'Nocturne Fig & Cypress',
    subtitle: 'Extrait de Parfum',
    category: 'fragrances',
    price: 210,
    rating: 4.88,
    reviewsCount: 84,
    isBestseller: false,
    isNew: true,
    description: 'An evocative olfactory portrait of twilight in an Italian olive orchard. Ripe wild fig, crushed cypress leaves, and earthy moss.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop',
    sizes: [
      { label: '50ml / 1.7 fl oz', priceModifier: 0 },
      { label: '100ml / 3.4 fl oz', priceModifier: 60 },
    ],
    fragranceNotes: {
      top: ['Fresh Wild Fig Leaf', 'Black Pepper', 'Lemon Zest'],
      heart: ['Tuscan Cypress', 'Violet Leaves', 'Olive Sap'],
      base: ['Oakmoss', 'Cashmeran', 'Clear Amber'],
    },
    ingredients: ['Alcohol Denat.', 'Parfum (Fragrance)', 'Aqua (Water)', 'Citral', 'Geraniol'],
    howToUse: 'Apply to pulse points. Excellent layered over Golden Radiance Elixir for extended longevity.'
  },
  {
    id: 'sg-skincare-02',
    name: 'Atelier Midnight Recovery Balm',
    subtitle: 'Nourishing Overnight Mask',
    category: 'skincare',
    price: 125,
    rating: 4.9,
    reviewsCount: 142,
    isBestseller: false,
    isNew: false,
    description: 'Velvety overnight balm formulated with botanical ceramide complex, chamomile distillate, and fermented olive oil to calm stress-damaged skin.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop',
    sizes: [
      { label: '50ml / 1.7 oz', priceModifier: 0 },
      { label: '100ml / 3.4 oz', priceModifier: 45 },
    ],
    skincareBenefits: [
      'Restores skin barrier overnight',
      'Calms redness and environmental irritation',
      'Plumps fine lines with micro-hyaluronic spheres'
    ],
    ingredients: ['Aloe Barbadensis Leaf Juice', 'Ceramide NP', 'Olive Oil Ferment Lysate', 'Niacinamide (5%)', 'Glycerin'],
    howToUse: 'Smooth a nickel-sized amount onto face as final step in evening routine. Sleep in product and rinse gently in morning.'
  },
  {
    id: 'sg-cosmetic-02',
    name: 'Soleil Satin Cream Blush',
    subtitle: 'Multipurpose Cheek & Lip Tint',
    category: 'cosmetics',
    price: 48,
    rating: 4.75,
    reviewsCount: 79,
    isBestseller: true,
    description: 'A dew-enhancing cream blush that melts effortlessly into skin for a natural, healthy glow infused with skin-loving botanical antioxidants.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop',
    sizes: [
      { label: 'Standard 12g', priceModifier: 0 },
    ],
    shades: [
      { id: 'b1', name: 'Sunlit Bronze', colorHex: '#C58B75' },
      { id: 'b2', name: 'Golden Apricot', colorHex: '#E09F7D' },
      { id: 'b3', name: 'Olive Petal', colorHex: '#A36860' },
    ],
    ingredients: ['Caprylic Triglyceride', 'Candelilla Wax', 'Olive Squalane', 'Mica', 'Tocopherol'],
    howToUse: 'Dab with fingertips onto high points of cheeks and bridge of nose. Blend outward toward temples.'
  },
  {
    id: 'sg-perfume-03',
    name: 'Solar Neroli & Amber',
    subtitle: 'Eau de Parfum',
    category: 'fragrances',
    price: 195,
    rating: 4.92,
    reviewsCount: 167,
    isBestseller: true,
    isNew: false,
    description: 'A radiant explosion of sunlit Tunisian neroli blossom, creamy sandalwood, pink pepper, and warm white musk.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
    sizes: [
      { label: '50ml / 1.7 fl oz', priceModifier: 0 },
      { label: '100ml / 3.4 fl oz', priceModifier: 55 },
    ],
    fragranceNotes: {
      top: ['Tunisian Neroli', 'Pink Peppercorn', 'Mandarin Leaf'],
      heart: ['Orange Flower Absolute', 'Jasmine Sambac', 'Orris Root'],
      base: ['Australian Sandalwood', 'White Musk', 'Solar Amber'],
    },
    ingredients: ['Alcohol Denat.', 'Parfum (Fragrance)', 'Limonene', 'Citronellol', 'Geraniol'],
    howToUse: 'Spritz on clean skin. Reapply throughout the day to reawaken the bright citrus and warm solar musk.'
  },
  {
    id: 'sg-skincare-03',
    name: 'Botanical Clarifying Tonic',
    subtitle: 'Exfoliating Essence & Toner',
    category: 'skincare',
    price: 78,
    rating: 4.82,
    reviewsCount: 110,
    isBestseller: false,
    isNew: true,
    description: 'A gentle micro-exfoliating treatment with natural AHA/BHA willow bark acids and green tea polyphenols that refines pores without stripping.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop',
    sizes: [
      { label: '150ml / 5.1 fl oz', priceModifier: 0 },
    ],
    skincareBenefits: [
      'Gently smooths texture and clears congested pores',
      'Balances sebum production while hydrating',
      'Preps skin for optimal absorption of serums'
    ],
    ingredients: ['Camellia Sinensis Leaf Water', 'Salix Alba (Willow) Bark Extract', 'Lactic Acid', 'Glycerin', 'Olive Leaf Extract'],
    howToUse: 'Saturate a reusable cotton pad and sweep across face after cleansing. Follow with Golden Radiance Elixir.'
  }
];

export const BOUTIQUES: AtelierBoutique[] = [
  {
    city: 'Paris',
    address: '42 Rue du Faubourg Saint-Honoré, 75008 Paris',
    phone: '+33 1 42 68 55 00',
    hours: 'Mon–Sat: 10am – 7pm',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop'
  },
  {
    city: 'Tokyo',
    address: '5-7-1 Ginza, Chuo-ku, Tokyo 104-0061',
    phone: '+81 3 5537 1100',
    hours: 'Daily: 11am – 8pm',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop'
  },
  {
    city: 'New York',
    address: '89 Mercer Street, SoHo, NY 10012',
    phone: '+1 212 966 4300',
    hours: 'Mon–Sat: 11am – 7pm | Sun: 12pm – 6pm',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop'
  },
  {
    city: 'London',
    address: '14 Mount Street, Mayfair, London W1K 2RF',
    phone: '+44 20 7493 2000',
    hours: 'Mon–Sat: 10am – 6:30pm',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop'
  }
];

export const BRAND_VALUES = [
  {
    id: 'val-1',
    title: 'Cruelty-Free & Leaping Bunny Certified',
    description: 'We strictly refuse any animal testing at all stages of development. Every formulation is tested under clinical dermatological surveillance on human volunteers.'
  },
  {
    id: 'val-2',
    title: 'Cold-Pressed Botanical Extraction',
    description: 'Our Mediterranean olive extracts, floral absolutes, and wild botanicals are extracted using zero-heat mechanical pressing to preserve maximum nutrient potency and scent purity.'
  },
  {
    id: 'val-3',
    title: 'Micro-Batch Artisanal Distillation',
    description: 'We distill our fragrances in limited batches of 500 bottles per harvest season in Grasse, France, ensuring uncompromised precision and depth in every drop.'
  },
  {
    id: 'val-4',
    title: 'Zero-Carbon Recycled Glassware',
    description: 'Each Special Glow vessel is hand-blown from 85% post-consumer heavy glass, designed to be re-filled at any of our global boutiques or kept as a forever object.'
  }
];
