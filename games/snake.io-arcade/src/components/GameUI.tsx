import React, { useState, useEffect } from 'react';
import { GameMode, GameStats, Skin } from '../types';
import { SKINS } from '../utils/skins';
import { audio } from '../utils/audio';
import { Trophy, Volume2, VolumeX, Shield, Zap, Sparkles, RefreshCw, User, Skull, Play, Award, Eye, Timer, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GameUIProps {
  playerName: string;
  onChangeName: (name: string) => void;
  selectedSkinId: string;
  onSelectSkin: (id: string) => void;
  gameMode: GameMode;
  onChangeMode: (mode: GameMode) => void;
  onStartGame: () => void;
  
  // Game states
  gameState: 'MENU' | 'PLAYING' | 'GAMEOVER';
  hudData: {
    score: number;
    kills: number;
    aliveCount: number;
    leaderboard: Array<{ name: string; score: number; isPlayer: boolean; color: string }>;
    magnetTimeLeft?: number;
    invisibleTimeLeft?: number;
  };
  finalStats: GameStats | null;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  playerName,
  onChangeName,
  selectedSkinId,
  onSelectSkin,
  gameMode,
  onChangeMode,
  onStartGame,
  gameState,
  hudData,
  finalStats,
  isMuted,
  onToggleMute,
}) => {
  const [activeTab, setActiveTab] = useState<'skins' | 'modes'>('skins');
  const [isLeaderboardCollapsed, setIsLeaderboardCollapsed] = useState(false);
  const [bestScore, setBestScore] = useState<number>(() => {
    return Number(localStorage.getItem('snake_best_score') || 0);
  });
  const [bestKills, setBestKills] = useState<number>(() => {
    return Number(localStorage.getItem('snake_best_kills') || 0);
  });

  // Automatically minimize leaderboard after 3 seconds when playing or when manually expanded
  useEffect(() => {
    if (gameState === 'PLAYING' && !isLeaderboardCollapsed) {
      const timer = setTimeout(() => {
        setIsLeaderboardCollapsed(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLeaderboardCollapsed, gameState]);

  // Uncollapse the leaderboard when returning to menu or game over screens
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      setIsLeaderboardCollapsed(false);
    }
  }, [gameState]);

  // Track and save highest scores
  useEffect(() => {
    if (gameState === 'GAMEOVER' && finalStats) {
      if (finalStats.score > bestScore) {
        setBestScore(finalStats.score);
        localStorage.setItem('snake_best_score', finalStats.score.toString());
      }
      if (finalStats.kills > bestKills) {
        setBestKills(finalStats.kills);
        localStorage.setItem('snake_best_kills', finalStats.kills.toString());
      }
    }
  }, [gameState, finalStats, bestScore, bestKills]);

  const selectedSkin = SKINS.find(s => s.id === selectedSkinId) || SKINS[0];

  // Helper to format survival time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Compute Achievements unlocked on GameOver
  const getAchievements = (stats: GameStats) => {
    const achs = [];
    if (stats.kills >= 1) achs.push({ title: 'First Blood', desc: 'Get your first kill in the arena', icon: '⚔️' });
    if (stats.kills >= 5) achs.push({ title: 'Cobra Master', desc: 'Destroy 5 or more snakes', icon: '👑' });
    if (stats.score >= 1000) achs.push({ title: 'Gigantic Glutton', desc: 'Grow past 1000 length score', icon: '🍎' });
    if (stats.score >= 2500) achs.push({ title: 'Leviathan Lord', desc: 'Reach a monstrous score of 2500', icon: '🐉' });
    if (stats.timeAlive >= 120) achs.push({ title: 'Survivor King', desc: 'Stay alive for more than 2 minutes', icon: '⏳' });
    if (stats.rank === 1) achs.push({ title: 'Arena Monarch', desc: 'Take rank #1 on the leaderboard', icon: '🏆' });
    
    if (achs.length === 0) {
      achs.push({ title: 'Challenger Spark', desc: 'Step into the arena to try again!', icon: '✨' });
    }
    return achs;
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none font-sans select-none">
      
      {/* GLOBAL AUDIO TOGGLE (Accessible in Menu or Gameplay) */}
      <div className="absolute top-4 right-4 z-30 pointer-events-auto">
        <button
          onClick={onToggleMute}
          className="flex items-center justify-center p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500 hover:scale-105 active:scale-95 transition-all shadow-lg"
          title={isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
          id="global-mute-toggle"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ================= START MENU SCREEN ================= */}
        {gameState === 'MENU' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-950/85 pointer-events-auto p-4 overflow-y-auto"
            id="start-menu-overlay"
          >
            <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 backdrop-blur-md flex flex-col md:flex-row gap-8 max-h-[92vh] overflow-y-auto">
              
              {/* LEFT COLUMN: TITLE, NAME INPUT, START ACTIONS */}
              <div className="flex-1 flex flex-col justify-between gap-6">
                <div>
                  {/* Game Brand */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[10px] font-bold font-mono tracking-widest uppercase">
                      Action Arcade
                    </span>
                    <span className="text-xs text-emerald-400/80 font-mono flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Local simulated PvP
                    </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 tracking-tight leading-none mb-2 font-sans">
                    SNAKE.IO
                  </h1>
                  <p className="text-slate-400 text-sm font-medium">
                    Slither, speed boost, cut off opponents, and rule the ultimate cosmic leaderboard.
                  </p>
                </div>

                {/* Name field input */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" /> Snake Name:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={18}
                      value={playerName}
                      onChange={(e) => onChangeName(e.target.value)}
                      placeholder="Enter Snake Name..."
                      className="w-full px-5 py-4 rounded-xl bg-slate-950 border-2 border-slate-800 text-white font-medium focus:outline-none focus:border-emerald-500/80 placeholder:text-slate-600 shadow-inner text-lg transition-all"
                      id="player-name-input"
                    />
                    <button
                      onClick={() => {
                        const randomNames = ['AlphaViper', 'NeonNoodle', 'CobraGlide', 'VenomApex', 'AcidBasilisk', 'SolarDrifter'];
                        const rngName = randomNames[Math.floor(Math.random() * randomNames.length)] + ' ' + Math.floor(Math.random() * 99);
                        onChangeName(rngName);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
                      title="Randomize Name"
                      id="randomize-name-btn"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Personal Best indicators */}
                <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-500" /> Best Score
                    </span>
                    <span className="text-2xl font-black text-amber-400 tracking-tight">
                      {bestScore.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 flex items-center gap-1">
                      <Skull className="w-3 h-3 text-rose-500" /> Best Kills
                    </span>
                    <span className="text-2xl font-black text-rose-400 tracking-tight">
                      {bestKills}
                    </span>
                  </div>
                </div>

                {/* Big Action Play Button */}
                <button
                  onClick={onStartGame}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:via-teal-400 hover:to-sky-400 text-slate-950 text-xl font-extrabold uppercase tracking-widest shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.55)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                  id="play-game-btn"
                >
                  <Play className="w-6 h-6 fill-slate-950" />
                  Enter Arena
                </button>
              </div>

              {/* RIGHT COLUMN: SKIN SELECTOR & MODE OPTIONS */}
              <div className="flex-1 flex flex-col border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8 gap-4 md:max-h-full md:overflow-hidden">
                
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
                  <button
                    onClick={() => setActiveTab('skins')}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-extrabold uppercase transition-all ${
                      activeTab === 'skins'
                        ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    id="skin-tab-btn"
                  >
                    Select Skin
                  </button>
                  <button
                    onClick={() => setActiveTab('modes')}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-extrabold uppercase transition-all ${
                      activeTab === 'modes'
                        ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    id="mode-tab-btn"
                  >
                    Game Modes
                  </button>
                </div>

                {/* TAB CONTENT: SKINS */}
                {activeTab === 'skins' && (
                  <div className="flex-1 flex flex-col gap-4 md:overflow-hidden md:min-h-[300px] min-h-0">
                    
                    {/* Live Selected Skin Preview Box */}
                    <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-2 relative shrink-0">
                      {/* Accessory overlay text label */}
                      {selectedSkin.accessory !== 'none' && (
                        <span className="absolute top-3 right-3 text-[10px] font-mono bg-slate-800 px-2.5 py-0.5 rounded-full text-amber-400 border border-amber-500/20 flex items-center gap-1 uppercase font-bold">
                          👑 Accessory: {selectedSkin.accessory}
                        </span>
                      )}

                      {/* Overlapping circle snake preview */}
                      <div className="flex items-center -space-x-4 py-3 scale-110">
                        {Array.from({ length: 6 }).map((_, i) => {
                          const isHead = i === 0;
                          const ratio = 1 - (i / 6) * 0.3;
                          let fillStyle = selectedSkin.colors[i % selectedSkin.colors.length];
                          
                          if (selectedSkin.type === 'stripe') {
                            fillStyle = selectedSkin.colors[Math.floor(i / 2) % selectedSkin.colors.length];
                          } else if (selectedSkin.type === 'cosmic') {
                            fillStyle = `hsl(${(i * 35) % 360}, 85%, 60%)`;
                          }

                          return (
                            <div
                              key={i}
                              className={`rounded-full flex items-center justify-center border transition-all duration-300 shadow-lg`}
                              style={{
                                width: `${40 * ratio}px`,
                                height: `${40 * ratio}px`,
                                backgroundColor: fillStyle,
                                borderColor: selectedSkin.borderColor,
                                zIndex: 10 - i,
                                boxShadow: selectedSkin.type === 'glow' ? `0 0 10px ${fillStyle}` : 'none',
                              }}
                            >
                              {/* Draw eyes and accessory on head */}
                              {isHead && (
                                <div className="w-full h-full relative flex items-center justify-around px-1">
                                  {/* Eyes */}
                                  <div className="w-2.5 h-2.5 bg-white border border-black rounded-full flex items-center justify-center">
                                    <div className="w-1 h-1 bg-black rounded-full"></div>
                                  </div>
                                  <div className="w-2.5 h-2.5 bg-white border border-black rounded-full flex items-center justify-center">
                                    <div className="w-1 h-1 bg-black rounded-full"></div>
                                  </div>

                                  {/* Accessory badges (mini-mockups) */}
                                  {selectedSkin.accessory === 'crown' && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm">👑</div>
                                  )}
                                  {selectedSkin.accessory === 'horns' && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs flex gap-2"><span>😈</span></div>
                                  )}
                                  {selectedSkin.accessory === 'glasses' && (
                                    <div className="absolute inset-x-1 top-3.5 h-1 bg-slate-900 border border-sky-400 rounded-sm"></div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-center">
                        <h3 className="font-extrabold text-white text-base">{selectedSkin.name}</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">
                          Style: {selectedSkin.type}
                        </p>
                      </div>
                    </div>

                    {/* Skin Grid list */}
                    <div className="grid grid-cols-2 gap-2 pr-1 overflow-y-auto max-h-[220px] md:max-h-none md:flex-1" id="skins-grid">
                      {SKINS.map((skin) => {
                        const isSelected = skin.id === selectedSkinId;
                        return (
                          <button
                            key={skin.id}
                            onClick={() => onSelectSkin(skin.id)}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all text-left ${
                              isSelected
                                ? 'bg-slate-800/80 border-emerald-500 shadow-md shadow-emerald-500/10'
                                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                            }`}
                            id={`skin-btn-${skin.id}`}
                          >
                            {/* Color dots */}
                            <div className="flex gap-1 -space-x-1.5 py-0.5">
                              {skin.colors.slice(0, 3).map((col, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="w-4 h-4 rounded-full border border-black/35 shadow-sm"
                                  style={{ backgroundColor: col }}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-slate-300 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                              {skin.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                  </div>
                )}

                {/* TAB CONTENT: GAME MODES */}
                {activeTab === 'modes' && (
                  <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                    
                    {/* Classic Mode */}
                    <button
                      onClick={() => onChangeMode('arena')}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex gap-4 ${
                        gameMode === 'arena'
                          ? 'bg-slate-800 border-emerald-500 text-white'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/40'
                      }`}
                      id="mode-classic-btn"
                    >
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 self-start">
                        <Shield className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-white text-sm uppercase font-mono tracking-wide flex items-center gap-2">
                          Classic Arena {gameMode === 'arena' && <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Standard survival. Battle AI bots on a 3600x3600 circular canvas. Hitting boundaries or other snakes causes instant explosion!
                        </p>
                      </div>
                    </button>

                    {/* Time Attack Mode */}
                    <button
                      onClick={() => onChangeMode('time_attack')}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex gap-4 ${
                        gameMode === 'time_attack'
                          ? 'bg-slate-800 border-emerald-500 text-white'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/40'
                      }`}
                      id="mode-time-btn"
                    >
                      <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 self-start">
                        <Timer className="w-6 h-6 text-sky-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-white text-sm uppercase font-mono tracking-wide flex items-center gap-2">
                          Time Attack 2:00 {gameMode === 'time_attack' && <span className="text-[10px] bg-sky-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Intense speed-eating challenge. Grow as big as possible in exactly 2 minutes. Respawning is enabled, but score gets cut in half on death!
                        </p>
                      </div>
                    </button>

                    {/* Infinite Mode */}
                    <button
                      onClick={() => onChangeMode('infinite')}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex gap-4 ${
                        gameMode === 'infinite'
                          ? 'bg-slate-800 border-emerald-500 text-white'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/40'
                      }`}
                      id="mode-infinite-btn"
                    >
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 self-start">
                        <Zap className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-white text-sm uppercase font-mono tracking-wide flex items-center gap-2">
                          Infinite Sandbox {gameMode === 'infinite' && <span className="text-[10px] bg-purple-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Peaceful sandbox testing. No boundaries and higher food regeneration count. Perfect for experimenting with extreme sizes!
                        </p>
                      </div>
                    </button>

                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* ================= IN-GAME PLAYING HUD OVERLAYS ================= */}
        {gameState === 'PLAYING' && (
          <div className="absolute inset-0 pointer-events-none" id="in-game-hud">
            
            {/* TOP-LEFT STATS PANEL */}
            <div className="absolute top-4 left-4 z-10 p-4 rounded-2xl bg-slate-950/85 border border-slate-850/80 shadow-2xl backdrop-blur-md pointer-events-auto flex items-center gap-5">
              
              {/* Score length indicator */}
              <div className="flex flex-col border-r border-slate-800 pr-4">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-400" /> Score Length
                </span>
                <span className="text-2xl font-black text-white tracking-tight leading-none mt-1">
                  {hudData.score.toLocaleString()}
                </span>
              </div>

              {/* Kills count */}
              <div className="flex flex-col border-r border-slate-800 pr-4">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold flex items-center gap-1">
                  <Skull className="w-3.5 h-3.5 text-rose-500" /> Kills
                </span>
                <span className="text-2xl font-black text-rose-400 tracking-tight leading-none mt-1">
                  {hudData.kills}
                </span>
              </div>

              {/* Snakes Alive */}
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-sky-400" /> Arena Snakes
                </span>
                <span className="text-xl font-bold text-slate-300 tracking-tight leading-none mt-1">
                  {hudData.aliveCount}
                </span>
              </div>
            </div>

            {/* POWERUP STATUS INDICATORS */}
            {((hudData.magnetTimeLeft && hudData.magnetTimeLeft > 0) || (hudData.invisibleTimeLeft && hudData.invisibleTimeLeft > 0)) && (
              <div className="absolute top-24 left-4 z-10 flex flex-col gap-2 pointer-events-auto w-[200px]" id="powerup-hud-panel">
                {hudData.magnetTimeLeft && hudData.magnetTimeLeft > 0 ? (
                  <div className="flex flex-col gap-1 px-3 py-2 rounded-xl bg-slate-950/85 border border-sky-500/30 shadow-lg backdrop-blur-md text-sky-400 font-mono text-[10px]">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1">🧲 MAGNET ACTIVE</span>
                      <span>{hudData.magnetTimeLeft.toFixed(1)}s</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-75"
                        style={{ width: `${(hudData.magnetTimeLeft / 8.0) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : null}
                
                {hudData.invisibleTimeLeft && hudData.invisibleTimeLeft > 0 ? (
                  <div className="flex flex-col gap-1 px-3 py-2 rounded-xl bg-slate-950/85 border border-purple-500/30 shadow-lg backdrop-blur-md text-purple-400 font-mono text-[10px]">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1">🧪 GHOST INVISIBLE</span>
                      <span>{hudData.invisibleTimeLeft.toFixed(1)}s</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-fuchsia-500 rounded-full transition-all duration-75"
                        style={{ width: `${(hudData.invisibleTimeLeft / 3.0) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* TOP-RIGHT LEADERBOARD PANEL */}
            {isLeaderboardCollapsed ? (
              <button
                onClick={() => setIsLeaderboardCollapsed(false)}
                className="absolute top-4 right-16 md:right-20 z-10 p-2.5 rounded-xl bg-slate-950/85 border border-slate-850/80 shadow-2xl backdrop-blur-md pointer-events-auto flex items-center gap-1.5 hover:bg-slate-900 text-slate-300 hover:text-white transition-all active:scale-95"
                title="Expand Leaderboard"
              >
                <Trophy className="w-4 h-4 text-amber-500 fill-amber-500/20 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">Leaderboard</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ) : (
              <div className="absolute top-4 right-16 md:right-20 z-10 w-48 md:w-64 max-h-[45vh] overflow-hidden p-3 md:p-4 rounded-2xl bg-slate-950/85 border border-slate-850/80 shadow-2xl backdrop-blur-md pointer-events-auto flex flex-col gap-1.5 md:gap-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 md:pb-2">
                  <h3 className="text-[10px] md:text-xs uppercase font-mono tracking-widest text-slate-400 font-black flex items-center gap-1.5 md:gap-2">
                    <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500 fill-amber-500/20" /> Leaderboard
                  </h3>
                  <button
                    onClick={() => setIsLeaderboardCollapsed(true)}
                    className="p-1 hover:bg-slate-800/80 rounded text-slate-400 hover:text-white transition-all pointer-events-auto"
                    title="Minimize"
                  >
                    <ChevronUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-0.5 md:space-y-1 pr-1 font-mono text-[10px] md:text-xs">
                  {hudData.leaderboard.map((sk, index) => {
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between py-0.5 md:py-1 px-1.5 md:px-2 rounded-lg transition-all ${
                          sk.isPlayer
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold'
                            : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1 truncate max-w-[70%]">
                          <span className={`font-black ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-700' : 'text-slate-600'}`}>
                            #{index + 1}
                          </span>
                          {/* Colored dot representation */}
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0" style={{ backgroundColor: sk.color }} />
                          <span className="truncate">{sk.isPlayer ? `${sk.name} (You)` : sk.name}</span>
                        </div>
                        <span className="font-extrabold">{sk.score}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= GAME OVER SCREEN OVERLAY ================= */}
        {gameState === 'GAMEOVER' && finalStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-950/90 pointer-events-auto p-4 overflow-y-auto"
            id="game-over-overlay"
          >
            <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 backdrop-blur-md text-center flex flex-col gap-6">
              
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-mono tracking-widest uppercase font-black">
                  Wasted / Snake Crashed
                </span>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-400 to-amber-500 tracking-tight mt-1">
                  GAME OVER
                </h1>
                <p className="text-slate-400 text-sm">
                  Your snake crashed headfirst into another competitor's tail!
                </p>
              </div>

              {/* STATS BREAKDOWN GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-850/80 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">Score Length</span>
                  <span className="text-2xl font-black text-white mt-1">{finalStats.score.toLocaleString()}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-850/80 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">Total Kills</span>
                  <span className="text-2xl font-black text-rose-400 mt-1">{finalStats.kills}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-850/80 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">Arena Rank</span>
                  <span className="text-2xl font-black text-amber-400 mt-1">#{finalStats.rank}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-850/80 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">Time Alive</span>
                  <span className="text-2xl font-black text-sky-400 mt-1">{formatTime(finalStats.timeAlive)}</span>
                </div>

              </div>

              {/* ACHIEVEMENTS BLOCK */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-left space-y-2">
                <h4 className="text-xs uppercase font-mono tracking-widest text-slate-400 font-extrabold flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Match Achievements Unlocked
                </h4>
                
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                  {getAchievements(finalStats).map((ach, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-2xl">{ach.icon}</span>
                      <div className="flex-1">
                        <h5 className="text-xs font-black text-slate-200">{ach.title}</h5>
                        <p className="text-[10px] text-slate-500">{ach.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dual CTA buttons */}
              <div className="flex gap-4">
                <button
                  onClick={onStartGame}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                  id="gameover-retry-btn"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                  Respawn Again
                </button>
                <button
                  onClick={() => onChangeMode('arena')} // Trigger menu refresh
                  className="flex-1 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm uppercase tracking-wider border border-slate-700 active:scale-95 transition-all"
                  id="gameover-menu-btn"
                >
                  Back to Menu
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
