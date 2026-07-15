import { Skin } from '../types';

export const SKINS: Skin[] = [
  {
    id: 'neon_classic',
    name: 'Neon Viper',
    colors: ['#22c55e'], // Emerald Green
    type: 'solid',
    borderColor: '#15803d',
    eyeColor: '#ffffff',
    accessory: 'none'
  },
  {
    id: 'rainbow_glow',
    name: 'Rainbow Prism',
    colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'],
    type: 'glow',
    borderColor: '#ffffff',
    eyeColor: '#ffffff',
    accessory: 'none'
  },
  {
    id: 'cosmic_dust',
    name: 'Nebula Overlord',
    colors: ['#6366f1', '#a855f7', '#db2777'], // Indigo to Violet to Pink
    type: 'cosmic',
    borderColor: '#312e81',
    eyeColor: '#67e8f9', // Cyan eyes
    accessory: 'glasses'
  },
  {
    id: 'golden_emperor',
    name: 'Royal Emperor',
    colors: ['#fbbf24', '#f59e0b', '#d97706'], // Warm Golds
    type: 'glow',
    borderColor: '#78350f',
    eyeColor: '#ffffff',
    accessory: 'crown'
  },
  {
    id: 'fire_dragon',
    name: 'Inferno Drake',
    colors: ['#ef4444', '#f97316', '#facc15'], // Red, Orange, Yellow
    type: 'gradient',
    borderColor: '#7f1d1d',
    eyeColor: '#facc15',
    accessory: 'horns'
  },
  {
    id: 'zebra_stealth',
    name: 'Shadow Striker',
    colors: ['#0f172a', '#e2e8f0'], // Slate dark and light
    type: 'stripe',
    borderColor: '#475569',
    eyeColor: '#ef4444', // Red eyes
    accessory: 'none'
  },
  {
    id: 'cotton_candy',
    name: 'Sweet Cotton',
    colors: ['#f472b6', '#38bdf8'], // Pink and Light Blue
    type: 'gradient',
    borderColor: '#db2777',
    eyeColor: '#ffffff',
    accessory: 'glasses'
  },
  {
    id: 'toxic_slime',
    name: 'Acid Leviathan',
    colors: ['#a3e635', '#22c55e', '#06b6d4'], // Lime, Green, Cyan
    type: 'glow',
    borderColor: '#14532d',
    eyeColor: '#ffffff',
    accessory: 'none'
  },
  {
    id: 'royal_ocean',
    name: 'Oceanic Monarch',
    colors: ['#0284c7', '#0369a1', '#1e3a8a'], // Blues
    type: 'stripe',
    borderColor: '#ffffff',
    eyeColor: '#e0f2fe',
    accessory: 'crown'
  },
  {
    id: 'bubblegum',
    name: 'Bubblegum Spark',
    colors: ['#ec4899', '#f472b6', '#f43f5e'], // Pink, light pink, rose
    type: 'gradient',
    borderColor: '#4c0519',
    eyeColor: '#ffffff',
    accessory: 'none'
  }
];

export function getSkinById(id: string): Skin {
  return SKINS.find(s => s.id === id) || SKINS[0];
}
