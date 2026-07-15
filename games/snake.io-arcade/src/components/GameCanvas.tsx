import React, { useEffect, useRef, useState } from 'react';
import { Snake, Food, Particle, GameMode, GameStats, Position, Skin } from '../types';
import { getSkinById, SKINS } from '../utils/skins';
import { audio } from '../utils/audio';

interface GameCanvasProps {
  playerName: string;
  selectedSkinId: string;
  gameMode: GameMode;
  onGameOver: (stats: GameStats) => void;
  onUpdateHUD: (score: number, kills: number, aliveCount: number, leaderBoard: Array<{ name: string; score: number; isPlayer: boolean; color: string }>) => void;
  isMuted: boolean;
}

const ARENA_RADIUS = 1800;
const INITIAL_FOOD_COUNT = 850;
const MAX_AI_SNAKES = 18;
const BASE_SNAKE_WIDTH = 24;
const BASE_SEGMENT_SPACING_RATIO = 0.36; // spacing between segments as fraction of width
const TICK_RATE_AI = 20; // run AI steer logic every 20 ticks (save CPU)

// Helper to interpolate angles smoothly (taking wrap-around into account)
function lerpAngle(current: number, target: number, speed: number): number {
  let diff = target - current;
  while (diff < -Math.PI) diff += Math.PI * 2;
  while (diff > Math.PI) diff -= Math.PI * 2;
  return current + diff * speed;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  playerName,
  selectedSkinId,
  gameMode,
  onGameOver,
  onUpdateHUD,
  isMuted,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation state kept in refs for high-performance 60 FPS updates
  const stateRef = useRef<{
    player: Snake | null;
    snakes: Map<string, Snake>;
    foods: Map<string, Food>;
    particles: Particle[];
    camX: number;
    camY: number;
    width: number;
    height: number;
    mouseX: number; // center relative mouse X
    mouseY: number; // center relative mouse Y
    isPointerDown: boolean;
    spacePressed: boolean;
    lastEatSoundTime: number;
    lastBoostSoundTime: number;
    frameCount: number;
    startTime: number;
    kills: number;
    isDead: boolean;
    botNames: string[];
  }>({
    player: null,
    snakes: new Map(),
    foods: new Map(),
    particles: [],
    camX: 0,
    camY: 0,
    width: 800,
    height: 600,
    mouseX: 0,
    mouseY: 0,
    isPointerDown: false,
    spacePressed: false,
    lastEatSoundTime: 0,
    lastBoostSoundTime: 0,
    frameCount: 0,
    startTime: Date.now(),
    kills: 0,
    isDead: false,
    botNames: [
      'SlitherSlayer', 'CobraCommander', 'NeonMamba', 'AlphaGlider', 'ToxicViper',
      'QuantumWorm', 'GoldSlime', 'ShadowStriker', 'InfernoCobra', 'MegaZebra',
      'CandyLeviathan', 'Spitfire', 'ApexAnaconda', 'SlimeBoss', 'HydraMaster',
      'TurboNoodle', 'Worminator', 'DeathStalker', 'RetroBasilisk', 'GamerCobra'
    ]
  });

  // Track isMuted state in refs so the rendering thread can see it
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Setup canvas size, event listeners, and start loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      
      canvas.width = w;
      canvas.height = h;
      stateRef.current.width = w;
      stateRef.current.height = h;
    };

    // Initialize dimensions
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Capture mouse/touch positions
    const getPointerPos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      return {
        x: clientX - centerX,
        y: clientY - centerY,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getPointerPos(e.clientX, e.clientY);
      stateRef.current.mouseX = pos.x;
      stateRef.current.mouseY = pos.y;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left click to boost
        stateRef.current.isPointerDown = true;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        stateRef.current.isPointerDown = false;
      }
    };

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        stateRef.current.spacePressed = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        stateRef.current.spacePressed = false;
        e.preventDefault();
      }
    };

    // Touch handlers for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const pos = getPointerPos(touch.clientX, touch.clientY);
        stateRef.current.mouseX = pos.x;
        stateRef.current.mouseY = pos.y;
        
        // Multi-touch logic or buttons can set boosting
        // For standard dragging on screen, turn towards target
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const pos = getPointerPos(touch.clientX, touch.clientY);
        stateRef.current.mouseX = pos.x;
        stateRef.current.mouseY = pos.y;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Initial game spawning
    initGame();

    // Start requestAnimationFrame loop
    let animationId: number;
    const renderLoop = () => {
      updateGame();
      drawGame();
      animationId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      resizeObserver.disconnect();
    };
  }, []);

  // Set up the start parameters
  const initGame = () => {
    const s = stateRef.current;
    s.snakes.clear();
    s.foods.clear();
    s.particles = [];
    s.frameCount = 0;
    s.kills = 0;
    s.isDead = false;
    s.startTime = Date.now();

    // Create player snake at center-ish
    const playerSkin = getSkinById(selectedSkinId);
    const initialSegments: Position[] = [];
    const startX = (Math.random() - 0.5) * 500;
    const startY = (Math.random() - 0.5) * 500;
    for (let i = 0; i < 15; i++) {
      initialSegments.push({ x: startX, y: startY + i * 8 });
    }

    const playerSnake: Snake = {
      id: 'player',
      name: playerName || 'You',
      isAI: false,
      skinId: selectedSkinId,
      segments: initialSegments,
      angle: -Math.PI / 2,
      targetAngle: -Math.PI / 2,
      speed: 3.6,
      baseSpeed: 3.6,
      score: 150, // Initial length multiplier
      kills: 0,
      isBoosting: false,
      isDead: false,
      width: BASE_SNAKE_WIDTH,
    };

    s.player = playerSnake;
    s.snakes.set('player', playerSnake);
    s.camX = startX;
    s.camY = startY;

    // Spawn Initial Foods
    for (let i = 0; i < INITIAL_FOOD_COUNT; i++) {
      spawnRandomFood(false);
    }

    // Spawn AI Snakes
    for (let i = 0; i < MAX_AI_SNAKES; i++) {
      spawnAISnake();
    }
    
    audio.playStart();
  };

  // Spawns a random food particle in the arena
  const spawnRandomFood = (isFromExplosion: boolean, customPos?: Position, customValue?: number) => {
    const s = stateRef.current;
    let rx = 0;
    let ry = 0;

    if (customPos) {
      rx = customPos.x;
      ry = customPos.y;
    } else {
      // Spawn inside circular boundary
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * (ARENA_RADIUS - 30);
      rx = Math.cos(angle) * radius;
      ry = Math.sin(angle) * radius;
    }

    const id = Math.random().toString(36).substring(2, 9);
    
    // Choose properties based on type
    const isGlow = isFromExplosion ? Math.random() < 0.4 : Math.random() < 0.05;
    const value = customValue || (isGlow ? Math.floor(Math.random() * 8) + 8 : Math.floor(Math.random() * 3) + 2);
    const size = isGlow ? 7 + value * 0.4 : 4 + value * 0.5;

    // Food colors - elegant and bright glowing palette
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const food: Food = {
      id,
      x: rx,
      y: ry,
      size,
      color,
      value,
      isGlow,
      pulseSpeed: 0.03 + Math.random() * 0.04,
      pulsePhase: Math.random() * Math.PI * 2,
    };

    s.foods.set(id, food);
  };

  // Spawn an AI Snake
  const spawnAISnake = () => {
    const s = stateRef.current;
    
    // Choose a random spot inside circular boundary away from player
    let rx = 0;
    let ry = 0;
    let distToPlayer = 0;
    
    do {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * (ARENA_RADIUS - 150);
      rx = Math.cos(angle) * radius;
      ry = Math.sin(angle) * radius;
      if (s.player) {
        const dx = s.player.segments[0].x - rx;
        const dy = s.player.segments[0].y - ry;
        distToPlayer = Math.sqrt(dx * dx + dy * dy);
      } else {
        distToPlayer = 1000;
      }
    } while (distToPlayer < 400);

    // Pick random name
    const nameIndex = Math.floor(Math.random() * s.botNames.length);
    const name = s.botNames[nameIndex] + (Math.random() < 0.5 ? Math.floor(Math.random() * 99) : '');

    // Pick random skin
    const randomSkin = SKINS[Math.floor(Math.random() * SKINS.length)];

    // Create segments starting towards a random angle
    const segments: Position[] = [];
    const snakeAngle = Math.random() * Math.PI * 2;
    const initialSize = Math.floor(Math.random() * 20) + 12; // Length in segments
    const initialScore = initialSize * 15 + 100;
    
    for (let i = 0; i < initialSize; i++) {
      segments.push({
        x: rx - Math.cos(snakeAngle) * i * 8,
        y: ry - Math.sin(snakeAngle) * i * 8,
      });
    }

    const id = 'bot_' + Math.random().toString(36).substring(2, 9);
    const aiSnake: Snake = {
      id,
      name,
      isAI: true,
      skinId: randomSkin.id,
      segments,
      angle: snakeAngle,
      targetAngle: snakeAngle,
      speed: 3.3,
      baseSpeed: 3.3,
      score: initialScore,
      kills: 0,
      isBoosting: false,
      isDead: false,
      width: BASE_SNAKE_WIDTH,
      aiState: 'wander',
      aiDecisionTimer: Math.floor(Math.random() * TICK_RATE_AI),
      aiTargetX: rx + Math.cos(snakeAngle) * 500,
      aiTargetY: ry + Math.sin(snakeAngle) * 500,
    };

    s.snakes.set(id, aiSnake);
  };

  // Helper to spawn a burst of delicious particles when a snake eats food
  const spawnParticles = (x: number, y: number, color: string, count: number, speedMultiplier: number = 1) => {
    const s = stateRef.current;
    for (let i = 0; i < count; i++) {
      const pAngle = Math.random() * Math.PI * 2;
      const speed = (0.5 + Math.random() * 3.5) * speedMultiplier;
      const life = 15 + Math.floor(Math.random() * 20);
      s.particles.push({
        id: Math.random().toString(),
        x,
        y,
        vx: Math.cos(pAngle) * speed,
        vy: Math.sin(pAngle) * speed,
        color,
        size: 2 + Math.random() * 4,
        alpha: 1,
        life,
        maxLife: life,
      });
    }
  };

  // Main simulation tick
  const updateGame = () => {
    const s = stateRef.current;
    s.frameCount++;

    if (s.isDead || !s.player) return;

    // 1. UPDATE PLAYER TARGET DIRECTION BASED ON MOUSE POSITION
    const player = s.player;
    if (player && !player.isDead) {
      // Pointer relative position
      const dx = s.mouseX;
      const dy = s.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Only update angle if pointer is far enough to avoid jitter
      if (dist > 15) {
        player.targetAngle = Math.atan2(dy, dx);
      }

      // Check if boosting (pointer down or space held down)
      const wantsBoost = (s.isPointerDown || s.spacePressed) && player.score > 80;
      player.isBoosting = wantsBoost;
      player.speed = wantsBoost ? player.baseSpeed * 1.8 : player.baseSpeed;

      // Drain score for boost trail
      if (wantsBoost && s.frameCount % 10 === 0) {
        player.score = Math.max(80, player.score - 4);
        
        // Excrete some food behind the tail
        const tail = player.segments[player.segments.length - 1];
        if (tail) {
          spawnRandomFood(true, {
            x: tail.x + (Math.random() - 0.5) * 20,
            y: tail.y + (Math.random() - 0.5) * 20
          }, 1);
        }

        // Spawn beautiful neon exhaust trail particles
        const skin = getSkinById(player.skinId);
        spawnParticles(tail.x, tail.y, skin.colors[0], 2, 0.4);

        // Sound effect (throttled)
        if (Date.now() - s.lastBoostSoundTime > 300) {
          audio.playBoost();
          s.lastBoostSoundTime = Date.now();
        }
      }

      // Keep dynamic width proportional to score
      player.width = Math.min(65, BASE_SNAKE_WIDTH + Math.floor(player.score * 0.015));
    }

    // 2. RUN AI STEER LOGIC & BOOST DECISIONS
    s.snakes.forEach((snake) => {
      if (snake.id === 'player' || snake.isDead) return;

      // Dynamic width scaling for bots
      snake.width = Math.min(65, BASE_SNAKE_WIDTH + Math.floor(snake.score * 0.015));

      const head = snake.segments[0];
      if (!head) return;

      snake.aiDecisionTimer = (snake.aiDecisionTimer || 0) + 1;

      // Periodic AI decision making
      if (snake.aiDecisionTimer >= TICK_RATE_AI) {
        snake.aiDecisionTimer = 0;
        
        // Sensor radii
        const alertRadius = 180 + snake.width * 2;
        const foodScanRadius = 350 + snake.width;
        let sensorX = head.x + Math.cos(snake.angle) * 120;
        let sensorY = head.y + Math.sin(snake.angle) * 120;

        let obstacleDetected = false;
        let safestAngle = snake.angle;

        // A. WALL DODGING FIRST: Steer away if heading close to arena limits
        const distFromCenter = Math.sqrt(head.x * head.x + head.y * head.y);
        const distOfSensor = Math.sqrt(sensorX * sensorX + sensorY * sensorY);
        
        if (distOfSensor > ARENA_RADIUS - 120 || distFromCenter > ARENA_RADIUS - 120) {
          // Sharp turn back to center
          snake.aiState = 'flee';
          snake.targetAngle = Math.atan2(-head.y, -head.x) + (Math.random() - 0.5) * 0.6;
          obstacleDetected = true;
        }

        // B. SNAKE COLLISION DODGING (Scan nearby snakes' body segments)
        if (!obstacleDetected) {
          let closestThreatDist = alertRadius;
          let threateningSnake: Snake | null = null;

          s.snakes.forEach((otherSnake) => {
            if (otherSnake.isDead) return;
            // Scan other body segments
            const startIndex = (otherSnake.id === snake.id) ? 4 : 0; // Don't collide with self neck
            for (let i = startIndex; i < otherSnake.segments.length; i++) {
              const seg = otherSnake.segments[i];
              const dx = seg.x - head.x;
              const dy = seg.y - head.y;
              const d = Math.sqrt(dx * dx + dy * dy);

              if (d < alertRadius) {
                // Check if obstacle is ahead of us
                const dot = Math.cos(snake.angle) * (dx / d) + Math.sin(snake.angle) * (dy / d);
                if (dot > 0.3 && d < closestThreatDist) {
                  closestThreatDist = d;
                  threateningSnake = otherSnake;
                  obstacleDetected = true;
                }
              }
            }
          });

          if (obstacleDetected && threateningSnake) {
            snake.aiState = 'flee';
            // Steer aggressively away from the danger vector
            // Find direction of threat, turn 90-110 degrees away from it
            const threatAngle = Math.atan2(sensorY - head.y, sensorX - head.x);
            snake.targetAngle = snake.angle + (Math.random() < 0.5 ? 1 : -1) * (Math.PI / 2 + (Math.random() * 0.5));
            
            // Randomly boost to escape tight corner
            if (snake.score > 120 && Math.random() < 0.3) {
              snake.isBoosting = true;
            }
          } else {
            snake.isBoosting = false;
          }
        }

        // C. FOOD FINDING (Steer to nearest food if not fleeing)
        if (!obstacleDetected) {
          let nearestFood: Food | null = null;
          let minFoodDist = foodScanRadius;

          s.foods.forEach((food) => {
            const dx = food.x - head.x;
            const dy = food.y - head.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < minFoodDist) {
              minFoodDist = d;
              nearestFood = food;
            }
          });

          if (nearestFood) {
            snake.aiState = 'feed';
            snake.targetAngle = Math.atan2(nearestFood.y - head.y, nearestFood.x - head.x);
            
            // Boost if food is glowing/high value and size is good
            if (nearestFood.isGlow && snake.score > 180 && Math.random() < 0.4) {
              snake.isBoosting = true;
            }
          } else {
            // D. WANDER LOOP (If no food or threat)
            snake.aiState = 'wander';
            if (Math.random() < 0.15) {
              snake.targetAngle = snake.angle + (Math.random() - 0.5) * 1.5;
            }
          }
        }
      }

      // Steer bots boosting drain
      if (snake.isBoosting) {
        snake.speed = snake.baseSpeed * 1.7;
        if (s.frameCount % 12 === 0) {
          snake.score = Math.max(80, snake.score - 4);
          const tail = snake.segments[snake.segments.length - 1];
          if (tail) {
            spawnRandomFood(true, { x: tail.x, y: tail.y }, 1);
          }
        }
      } else {
        snake.speed = snake.baseSpeed;
      }
    });

    // 3. MOVE ALL ACTIVE SNAKES
    s.snakes.forEach((snake) => {
      if (snake.isDead) return;

      // Smoothly steer angle towards targetAngle
      const turnSpeed = snake.isBoosting ? 0.09 : 0.07;
      snake.angle = lerpAngle(snake.angle, snake.targetAngle, turnSpeed);

      // Move Head segment
      const head = snake.segments[0];
      const vx = Math.cos(snake.angle) * snake.speed;
      const vy = Math.sin(snake.angle) * snake.speed;
      
      const newHead = {
        x: head.x + vx,
        y: head.y + vy,
      };

      // Slide body segments down the chain
      const oldSegments = [...snake.segments];
      snake.segments[0] = newHead;

      // Adjust segment spacing dynamically as function of width to keep body connected
      const spacing = snake.width * BASE_SEGMENT_SPACING_RATIO;
      for (let i = 1; i < snake.segments.length; i++) {
        const prev = snake.segments[i - 1];
        const curr = snake.segments[i];
        
        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d > spacing) {
          const ratio = spacing / d;
          curr.x = prev.x - dx * ratio;
          curr.y = prev.y - dy * ratio;
        }
      }

      // Snake length auto-adjusts to match its score!
      // Formula: targetLength = Math.floor(score / 10) + 5
      const targetLength = Math.floor(snake.score / 10) + 5;
      if (snake.segments.length < targetLength) {
        // Grow: add segment at tail position
        const tail = snake.segments[snake.segments.length - 1];
        snake.segments.push({ x: tail.x, y: tail.y });
      } else if (snake.segments.length > targetLength) {
        // Shrink slowly
        snake.segments.pop();
      }
    });

    // 4. EAT FOOD DETECTION (Player & Bots)
    s.snakes.forEach((snake) => {
      if (snake.isDead) return;
      const head = snake.segments[0];
      const headRadius = snake.width / 2;

      s.foods.forEach((food) => {
        const dx = food.x - head.x;
        const dy = food.y - head.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Dynamic eat distance based on mouth size
        if (dist < headRadius + food.size + 3) {
          // Yummy! Eat food
          snake.score += food.value;
          
          // Spawn sparkle particles
          spawnParticles(food.x, food.y, food.color, food.isGlow ? 12 : 5);

          // Audio chime for player (throttled)
          if (!snake.isAI) {
            const now = Date.now();
            if (now - s.lastEatSoundTime > 80) {
              audio.playEat();
              s.lastEatSoundTime = now;
            }
          }

          // Delete food, respawn somewhere else
          s.foods.delete(food.id);
          spawnRandomFood(false);
        }
      });
    });

    // 5. BOUNDARY DEATH CHECKS (Circular arena border)
    s.snakes.forEach((snake) => {
      if (snake.isDead) return;
      const head = snake.segments[0];
      const distFromCenter = Math.sqrt(head.x * head.x + head.y * head.y);

      if (distFromCenter > ARENA_RADIUS) {
        handleSnakeDeath(snake, null);
      }
    });

    // 6. HEAD-TO-BODY COLLISION CHECKS
    s.snakes.forEach((snakeA) => {
      if (snakeA.isDead) return;
      const headA = snakeA.segments[0];
      const headRadius = snakeA.width / 2;

      s.snakes.forEach((snakeB) => {
        if (snakeB.isDead) return;
        
        // If same snake, only check tail to prevent self-collision on tight turns (index > 4)
        const startIndex = (snakeA.id === snakeB.id) ? 5 : 0;

        for (let i = startIndex; i < snakeB.segments.length; i++) {
          const segB = snakeB.segments[i];
          const dx = segB.x - headA.x;
          const dy = segB.y - headA.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const collisionDist = headRadius + (snakeB.width / 2) * 0.75;
          if (dist < collisionDist) {
            // Collision! Snake A crashes and dies
            handleSnakeDeath(snakeA, snakeB);
            break;
          }
        }
      });
    });

    // 7. PARTICLES UPDATE
    s.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98; // Friction
      p.vy *= 0.98;
      p.life--;
      p.alpha = Math.max(0, p.life / p.maxLife);
    });
    s.particles = s.particles.filter((p) => p.life > 0);

    // 8. CAMERA SMOOTHING FOLLOW
    if (s.player && !s.player.isDead) {
      const head = s.player.segments[0];
      // Lerp camera
      s.camX += (head.x - s.camX) * 0.08;
      s.camY += (head.y - s.camY) * 0.08;
    }

    // 9. RESPOND / TRIGGER UI UPDATES PERIODICALLY
    if (s.frameCount % 20 === 0) {
      triggerHUDUpdate();
    }
  };

  // Handles a snake dying, playing sounds, exploding into food, and managing scores
  const handleSnakeDeath = (deadSnake: Snake, killerSnake: Snake | null) => {
    const s = stateRef.current;
    if (deadSnake.isDead) return;
    
    deadSnake.isDead = true;

    const skin = getSkinById(deadSnake.skinId);
    
    // Create explosion food nodes along body segments!
    // Every segment is transformed into shiny big food chunks
    deadSnake.segments.forEach((seg, index) => {
      // Don't spawn food perfectly overlayed; add minor noise
      const rx = seg.x + (Math.random() - 0.5) * 20;
      const ry = seg.y + (Math.random() - 0.5) * 20;
      
      // Nutritious segment food
      const foodValue = Math.floor(Math.random() * 4) + 6; // juicy score values
      spawnRandomFood(true, { x: rx, y: ry }, foodValue);
      
      // Beautiful particle blast
      if (index % 2 === 0) {
        spawnParticles(seg.x, seg.y, skin.colors[index % skin.colors.length], 4, 1.5);
      }
    });

    // Log the kill & update statistics
    if (killerSnake && killerSnake.id !== deadSnake.id) {
      killerSnake.kills++;
      killerSnake.score += 200; // Big bonus for a kill
      
      if (killerSnake.id === 'player') {
        s.kills++;
        audio.playKill();
        // Spawn mini congratulatory sparkle trail
        const head = killerSnake.segments[0];
        spawnParticles(head.x, head.y, '#eab308', 25, 2.5);
      }
    }

    if (deadSnake.id === 'player') {
      s.isDead = true;
      audio.playDeath();
      
      // Transition to game over UI after a slight cinematic delay
      setTimeout(() => {
        const timeAlive = Math.floor((Date.now() - s.startTime) / 1000);
        // Find biggest snake score in game
        let maxScore = s.player?.score || 0;
        s.snakes.forEach((sk) => {
          if (sk.score > maxScore) maxScore = sk.score;
        });

        // Determine player rank
        const allSnakes = Array.from(s.snakes.values()) as Snake[];
        allSnakes.sort((a, b) => b.score - a.score);
        const rank = allSnakes.findIndex((sn) => sn.id === 'player') + 1;

        onGameOver({
          score: Math.floor(s.player?.score || 0),
          kills: s.kills,
          rank: rank > 0 ? rank : allSnakes.length + 1,
          timeAlive,
          biggestSnake: Math.floor(maxScore),
        });
      }, 1500);
    } else {
      // Bot respawn logic: Delete and spawn a new bot after delay
      s.snakes.delete(deadSnake.id);
      setTimeout(() => {
        if (!s.isDead) {
          spawnAISnake();
        }
      }, 3000);
    }
  };

  // Prepares leaderboard data and score indicators for React HUD
  const triggerHUDUpdate = () => {
    const s = stateRef.current;
    if (!s.player) return;

    const allSnakes = Array.from(s.snakes.values()) as Snake[];
    allSnakes.sort((a, b) => b.score - a.score);

    // Dynamic leaderboard of top 10
    const leaderboard = allSnakes.slice(0, 10).map((snake) => {
      const skin = getSkinById(snake.skinId);
      return {
        name: snake.name,
        score: Math.floor(snake.score),
        isPlayer: snake.id === 'player',
        color: skin.colors[0],
      };
    });

    onUpdateHUD(
      Math.floor(s.player.score),
      s.kills,
      s.snakes.size,
      leaderboard
    );
  };

  // CANVAS DRAW LOOPS
  const drawGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const s = stateRef.current;

    if (!canvas || !ctx || !s.player) return;

    const width = s.width;
    const height = s.height;
    const camX = s.camX;
    const camY = s.camY;

    // Clear Screen (Sleek Spacey Slate Grid)
    ctx.fillStyle = '#090d16'; // Deep Space Blue
    ctx.fillRect(0, 0, width, height);

    // Save and apply camera translate transformations
    ctx.save();
    ctx.translate(width / 2 - camX, height / 2 - camY);

    // A. DRAW BACKGROUND INFINITE SPACE GRID lines (optimized)
    const gridSize = 100;
    const startX = Math.floor((camX - width / 2) / gridSize) * gridSize;
    const endX = Math.ceil((camX + width / 2) / gridSize) * gridSize;
    const startY = Math.floor((camY - height / 2) / gridSize) * gridSize;
    const endY = Math.ceil((camY + height / 2) / gridSize) * gridSize;

    ctx.strokeStyle = '#1e293b'; // Slate grid line
    ctx.lineWidth = 0.5;
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }

    // B. DRAW ARENA BOUNDARY LIMITS (Giant Glowing Circle)
    ctx.beginPath();
    ctx.arc(0, 0, ARENA_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = '#f43f5e'; // Glowing Rose Boundary
    ctx.lineWidth = 14;
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow

    // C. DRAW FOODS (with camera frustum culling)
    s.foods.forEach((food) => {
      // Cull food nodes completely outside camera viewport
      const pad = 30;
      if (
        food.x < camX - width / 2 - pad ||
        food.x > camX + width / 2 + pad ||
        food.y < camY - height / 2 - pad ||
        food.y > camY + height / 2 + pad
      ) {
        return;
      }

      const pulseFactor = food.isGlow 
        ? 1 + 0.22 * Math.sin(s.frameCount * food.pulseSpeed + food.pulsePhase)
        : 1;

      ctx.beginPath();
      ctx.arc(food.x, food.y, food.size * pulseFactor, 0, Math.PI * 2);
      
      if (food.isGlow) {
        ctx.shadowColor = food.color;
        ctx.shadowBlur = 15;
      }
      ctx.fillStyle = food.color;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset
    });

    // D. DRAW PARTICLES
    s.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    });

    // E. DRAW ALL SNAKES (Draw body segments from tail to head so they overlap correctly)
    const drawSnake = (snake: Snake) => {
      if (snake.isDead) return;

      const skin = getSkinById(snake.skinId);
      const segments = snake.segments;
      const widthMultiplier = snake.width;

      // Dynamic skin settings
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. Draw Body segments back-to-front
      for (let i = segments.length - 1; i >= 0; i--) {
        const seg = segments[i];
        
        // Frustum culling of segments
        const padding = widthMultiplier + 10;
        if (
          seg.x < camX - width / 2 - padding ||
          seg.x > camX + width / 2 + padding ||
          seg.y < camY - height / 2 - padding ||
          seg.y > camY + height / 2 + padding
        ) {
          continue;
        }

        // Segment thickness tapering off slightly towards tail
        const segmentRatio = 1 - (i / segments.length) * 0.35;
        const radius = (widthMultiplier / 2) * segmentRatio;

        ctx.save();
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, radius, 0, Math.PI * 2);

        // Styling based on skin type
        if (skin.type === 'glow') {
          ctx.shadowColor = skin.colors[i % skin.colors.length];
          ctx.shadowBlur = 12;
        }

        // Fill color interpolation
        let fillStyle = skin.colors[i % skin.colors.length];
        
        if (skin.type === 'stripe') {
          fillStyle = skin.colors[Math.floor(i / 3) % skin.colors.length];
        } else if (skin.type === 'cosmic') {
          // Cosmic color shifts based on frame count & body position
          const cosmicHue = (i * 12 + s.frameCount * 2) % 360;
          fillStyle = `hsl(${cosmicHue}, 85%, 60%)`;
        }

        ctx.fillStyle = fillStyle;
        ctx.fill();

        // Stroke border
        ctx.strokeStyle = skin.borderColor;
        ctx.lineWidth = Math.max(1.5, radius * 0.15);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw Head and Face Details (Segments[0])
      const head = segments[0];
      if (head) {
        const headRadius = widthMultiplier / 2;
        const angle = snake.angle;

        ctx.save();
        ctx.translate(head.x, head.y);
        ctx.rotate(angle);

        // Eye Positions (angled forward, offset sideways)
        const eyeOffsetX = headRadius * 0.45;
        const eyeOffsetY = headRadius * 0.35;
        const eyeRadius = headRadius * 0.22;

        const leftEyeX = eyeOffsetX;
        const leftEyeY = -eyeOffsetY;
        const rightEyeX = eyeOffsetX;
        const rightEyeY = eyeOffsetY;

        // Draw Left & Right White Eyes
        ctx.fillStyle = skin.eyeColor || '#ffffff';
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
        ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw black pupils looking slightly towards target direction
        const pupilRadius = eyeRadius * 0.5;
        
        // Let pupil track steering target slightly
        let steerOffsetAngle = snake.targetAngle - snake.angle;
        while (steerOffsetAngle < -Math.PI) steerOffsetAngle += Math.PI * 2;
        while (steerOffsetAngle > Math.PI) steerOffsetAngle -= Math.PI * 2;
        const pupilMoveY = Math.max(-1, Math.min(1, steerOffsetAngle * 1.5)) * (eyeRadius * 0.25);
        
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(leftEyeX + eyeRadius * 0.2, leftEyeY + pupilMoveY, pupilRadius, 0, Math.PI * 2);
        ctx.arc(rightEyeX + eyeRadius * 0.2, rightEyeY + pupilMoveY, pupilRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw custom accessories (Crown, Devil Horns, Glasses)
        if (skin.accessory === 'crown') {
          ctx.save();
          // Position crown on forehead
          ctx.translate(-headRadius * 0.1, 0);
          ctx.rotate(-Math.PI / 2); // Rotate to align upright
          ctx.fillStyle = '#fbbf24'; // Shiny Gold
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 1.5;

          const crownW = headRadius * 0.8;
          const crownH = headRadius * 0.7;

          ctx.beginPath();
          ctx.moveTo(-crownW / 2, crownH / 3);
          ctx.lineTo(-crownW / 2, -crownH / 3); // bottom left
          ctx.lineTo(crownW / 2, -crownH / 3);  // bottom right
          ctx.lineTo(crownW / 2, crownH / 3);   // right peak
          ctx.lineTo(crownW * 0.2, 0);          // right dip
          ctx.lineTo(0, crownH / 2);            // center peak
          ctx.lineTo(-crownW * 0.2, 0);         // left dip
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Crown jewel circles
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(0, crownH / 2, 2, 0, Math.PI * 2);
          ctx.arc(-crownW / 2, crownH / 3, 1.5, 0, Math.PI * 2);
          ctx.arc(crownW / 2, crownH / 3, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (skin.accessory === 'horns') {
          // Curving devil horns
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#7f1d1d';
          ctx.lineWidth = 1.5;

          // Left horn
          ctx.beginPath();
          ctx.moveTo(-headRadius * 0.2, -headRadius * 0.5);
          ctx.quadraticCurveTo(-headRadius * 0.6, -headRadius * 1.1, -headRadius * 0.9, -headRadius * 0.7);
          ctx.quadraticCurveTo(-headRadius * 0.5, -headRadius * 0.6, -headRadius * 0.1, -headRadius * 0.3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Right horn
          ctx.beginPath();
          ctx.moveTo(-headRadius * 0.2, headRadius * 0.5);
          ctx.quadraticCurveTo(-headRadius * 0.6, headRadius * 1.1, -headRadius * 0.9, headRadius * 0.7);
          ctx.quadraticCurveTo(-headRadius * 0.5, headRadius * 0.6, -headRadius * 0.1, headRadius * 0.3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (skin.accessory === 'glasses') {
          // Cool futuristic sunglasses
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;

          const glassW = headRadius * 0.35;
          const glassH = headRadius * 0.6;

          // Left glass lens
          ctx.beginPath();
          ctx.roundRect(eyeOffsetX - glassW / 2, -eyeOffsetY - glassH / 2, glassW, glassH, 3);
          ctx.fill();
          ctx.stroke();

          // Right glass lens
          ctx.beginPath();
          ctx.roundRect(eyeOffsetX - glassW / 2, eyeOffsetY - glassH / 2, glassW, glassH, 3);
          ctx.fill();
          ctx.stroke();

          // Bridge bar connecting glasses
          ctx.beginPath();
          ctx.moveTo(eyeOffsetX, -eyeOffsetY + glassH / 2);
          ctx.lineTo(eyeOffsetX, eyeOffsetY - glassH / 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.stroke();
        }

        // 3. Draw Snake Name Tag above head
        ctx.restore(); // Undo rotation, keep translated position
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(snake.name, head.x, head.y - headRadius - 6);
        ctx.shadowBlur = 0;
      }
    };

    // Render other snakes first
    s.snakes.forEach((snake) => {
      if (snake.id !== 'player') {
        drawSnake(snake);
      }
    });

    // Render player on top of bots
    drawSnake(s.player);

    ctx.restore(); // Restore global context translations

    // F. DRAW MINIMAP OVERLAY (Bottom Left of Canvas for mobile safety)
    drawMinimap(ctx, width, height, s);
  };

  // Draws a beautiful, high-performance tactical minimap
  const drawMinimap = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    s: any
  ) => {
    const size = 130;
    const padding = 20;
    // Position: Bottom Left to keep mobile steer joystick safe on bottom-right/left
    const mx = padding + size / 2;
    const my = height - padding - size / 2;

    // Background panel
    ctx.save();
    ctx.beginPath();
    ctx.arc(mx, my, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'; // Transparent Slate
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.9)'; // Border
    ctx.lineWidth = 2.5;
    ctx.fill();
    ctx.stroke();

    // Map scaling ratio
    const ratio = (size / 2) / ARENA_RADIUS;

    // Draw Map boundary limits
    ctx.beginPath();
    ctx.arc(mx, my, ARENA_RADIUS * ratio, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw Foods hotspots (Subtle glowing dust clouds)
    ctx.fillStyle = 'rgba(234, 179, 8, 0.45)'; // Yellow dots
    let foodCounter = 0;
    s.foods.forEach((f: Food) => {
      // Draw every 10th food to keep 60 FPS
      foodCounter++;
      if (foodCounter % 14 === 0) {
        const fx = mx + f.x * ratio;
        const fy = my + f.y * ratio;
        ctx.fillRect(fx, fy, 1.2, 1.2);
      }
    });

    // Draw bot snakes (dimmer dots)
    s.snakes.forEach((snake: Snake) => {
      if (snake.isDead || snake.id === 'player') return;
      const head = snake.segments[0];
      if (head) {
        const bx = mx + head.x * ratio;
        const by = my + head.y * ratio;
        const skin = getSkinById(snake.skinId);
        ctx.beginPath();
        ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = skin.colors[0];
        ctx.fill();
      }
    });

    // Draw player snake (bright pulsating marker)
    if (s.player && !s.player.isDead) {
      const head = s.player.segments[0];
      const px = mx + head.x * ratio;
      const py = my + head.y * ratio;
      const pulse = 3 + 1.2 * Math.sin(s.frameCount * 0.15);

      ctx.beginPath();
      ctx.arc(px, py, pulse, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  };

  // Helper trigger speed boost button for mobile controls (pointer-down simulation)
  const handleBoostButtonTouchStart = () => {
    stateRef.current.isPointerDown = true;
  };

  const handleBoostButtonTouchEnd = () => {
    stateRef.current.isPointerDown = false;
  };

  return (
    <div ref={containerRef} className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair touch-none" />

      {/* Touch UI: Virtual Boost Button on Bottom Right */}
      <div 
        className="absolute bottom-6 right-6 z-10 md:hidden flex flex-col items-center gap-1 pointer-events-auto"
        id="boost-btn-container"
      >
        <button
          onTouchStart={handleBoostButtonTouchStart}
          onTouchEnd={handleBoostButtonTouchEnd}
          onMouseDown={handleBoostButtonTouchStart}
          onMouseUp={handleBoostButtonTouchEnd}
          className="w-20 h-20 active:scale-90 bg-gradient-to-tr from-rose-600 to-amber-500 rounded-full border-4 border-white/80 shadow-2xl flex items-center justify-center font-bold text-white text-lg select-none"
          id="boost-btn"
        >
          BOOST
        </button>
        <span className="text-[10px] text-white/60 font-mono bg-black/40 px-2 py-0.5 rounded-full">
          Press & Hold
        </span>
      </div>

      {/* Screen Steering Tip for desktop/mobile */}
      <div className="absolute top-4 left-4 text-xs font-mono text-white/50 bg-slate-900/40 p-2 rounded pointer-events-none hidden md:block">
        🖱️ Mouse steers • Spacebar or Left-Click to Boost
      </div>
      <div className="absolute top-4 left-4 text-xs font-mono text-white/50 bg-slate-900/40 p-2 rounded pointer-events-none md:hidden block">
        📱 Drag screen to steer • Hold BOOST to speed up
      </div>
    </div>
  );
};
