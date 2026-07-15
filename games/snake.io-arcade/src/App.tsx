import { useState, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { GameUI } from './components/GameUI';
import { GameMode, GameStats } from './types';
import { audio } from './utils/audio';

export default function App() {
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('snake_player_name') || 'SlitherBas';
  });
  
  const [selectedSkinId, setSelectedSkinId] = useState<string>(() => {
    return localStorage.getItem('snake_selected_skin') || 'neon_classic';
  });

  const [gameMode, setGameMode] = useState<GameMode>('arena');
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'GAMEOVER'>('MENU');
  
  // HUD variables
  const [hudData, setHudData] = useState({
    score: 150,
    kills: 0,
    aliveCount: 1,
    leaderboard: [] as Array<{ name: string; score: number; isPlayer: boolean; color: string }>,
  });

  const [finalStats, setFinalStats] = useState<GameStats | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('snake_audio_muted') === 'true';
  });

  // Track isMuted syncing
  useEffect(() => {
    const savedMuted = localStorage.getItem('snake_audio_muted') === 'true';
    if (savedMuted) {
      audio.toggleMute(); // match initial state if muted
    }
  }, []);

  const handleToggleMute = () => {
    const nextMutedState = audio.toggleMute();
    setIsMuted(nextMutedState);
    localStorage.setItem('snake_audio_muted', nextMutedState.toString());
  };

  const handleStartGame = () => {
    // Save settings
    localStorage.setItem('snake_player_name', playerName);
    localStorage.setItem('snake_selected_skin', selectedSkinId);
    
    // Reset HUD
    setHudData({
      score: 150,
      kills: 0,
      aliveCount: 1,
      leaderboard: [],
    });
    setFinalStats(null);
    setGameState('PLAYING');
  };

  const handleGameOver = (stats: GameStats) => {
    setFinalStats(stats);
    setGameState('GAMEOVER');
  };

  const handleUpdateHUD = (
    score: number,
    kills: number,
    aliveCount: number,
    leaderboard: Array<{ name: string; score: number; isPlayer: boolean; color: string }>
  ) => {
    setHudData({ score, kills, aliveCount, leaderboard });
  };

  const handleBackToMenu = () => {
    setGameState('MENU');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020617]" id="app-container">
      {/* 1. THE GAME CANVAS SIMULATION ENGINE */}
      {gameState === 'PLAYING' && (
        <GameCanvas
          playerName={playerName}
          selectedSkinId={selectedSkinId}
          gameMode={gameMode}
          onGameOver={handleGameOver}
          onUpdateHUD={handleUpdateHUD}
          isMuted={isMuted}
        />
      )}

      {/* Static Cinematic Space Atmosphere Backdrop when on Menu / GameOver */}
      {gameState !== 'PLAYING' && (
        <div className="absolute inset-0 bg-[#070b13] flex items-center justify-center overflow-hidden pointer-events-none">
          {/* Neon space grids or simple CSS circles simulating stars */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
          
          {/* Glowing ambient nebula blobs */}
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/15 blur-[120px]"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-teal-500/15 blur-[120px]"></div>
        </div>
      )}

      {/* 2. CORE GAME HUD AND NAVIGATION OVERLAYS */}
      <GameUI
        playerName={playerName}
        onChangeName={setPlayerName}
        selectedSkinId={selectedSkinId}
        onSelectSkin={setSelectedSkinId}
        gameMode={gameMode}
        onChangeMode={(mode) => {
          setGameMode(mode);
          // If in GameOver, reset to menu
          if (gameState === 'GAMEOVER') {
            handleBackToMenu();
          }
        }}
        onStartGame={handleStartGame}
        gameState={gameState}
        hudData={hudData}
        finalStats={finalStats}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    </div>
  );
}
