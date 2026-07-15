export interface Position {
  x: number;
  y: number;
}

export interface Food {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  value: number;
  isGlow: boolean;
  pulseSpeed: number;
  pulsePhase: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface Skin {
  id: string;
  name: string;
  colors: string[]; // Gradients
  type: 'solid' | 'gradient' | 'stripe' | 'glow' | 'cosmic';
  borderColor: string;
  eyeColor: string;
  accessory?: 'horns' | 'crown' | 'glasses' | 'none';
}

export interface Snake {
  id: string;
  name: string;
  isAI: boolean;
  skinId: string;
  segments: Position[]; // index 0 is head
  angle: number; // direction in radians
  targetAngle: number;
  speed: number;
  baseSpeed: number;
  score: number;
  kills: number;
  isBoosting: boolean;
  isDead: boolean;
  width: number;
  
  // Power-up active timers (in frames or ms)
  magnetTimeLeft?: number; // duration left in seconds/ticks
  invisibleTimeLeft?: number; // duration left in seconds/ticks
  
  // AI specific properties
  aiState?: 'feed' | 'flee' | 'chase' | 'wander';
  aiDecisionTimer?: number;
  aiTargetX?: number;
  aiTargetY?: number;
}

export type PowerUpType = 'magnet' | 'invisible';

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: PowerUpType;
  size: number;
  pulsePhase: number;
  color: string;
}

export interface GameStats {
  score: number;
  kills: number;
  rank: number;
  timeAlive: number; // in seconds
  biggestSnake: number;
}

export type GameMode = 'arena' | 'time_attack' | 'infinite';
