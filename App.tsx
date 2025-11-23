
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Pokemon, GameState, LogEntry, TurnState, PokemonType } from './types';
import { POKEMON_ROSTER, TYPE_COLORS, TYPE_CHART } from './constants';
import HealthBar from './components/HealthBar';
import BattleLog from './components/BattleLog';
import PokemonSprite from './components/PokemonSprite';
import { generateBattleNarration, getOpponentDecision } from './services/geminiService';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.Menu);
  const [playerPokemon, setPlayerPokemon] = useState<Pokemon | null>(null);
  const [opponentPokemon, setOpponentPokemon] = useState<Pokemon | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [turnState, setTurnState] = useState<TurnState>(TurnState.PlayerInput);
  
  // Animation states
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [opponentAttacking, setOpponentAttacking] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [opponentHit, setOpponentHit] = useState(false);

  const addLog = (text: string, source: LogEntry['source']) => {
    setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), text, source }]);
  };

  // Get only the cool, final form Pokemon for the menu
  const getInitialPokemon = () => {
    const eliteIds = [6, 9, 3, 150, 448, 445, 384, 493, 487]; // Charizard, Blastoise, Venusaur, Mewtwo, Lucario, Garchomp, Rayquaza, Arceus, Giratina
    return POKEMON_ROSTER.filter(p => eliteIds.includes(p.id));
  };

  const startGame = (selected: Pokemon) => {
    let opponent = POKEMON_ROSTER[Math.floor(Math.random() * POKEMON_ROSTER.length)];
    // Ensure opponent is different
    while (opponent.id === selected.id) {
        opponent = POKEMON_ROSTER[Math.floor(Math.random() * POKEMON_ROSTER.length)];
    }
    
    const pCopy = JSON.parse(JSON.stringify(selected));
    const oCopy = JSON.parse(JSON.stringify(opponent));
    
    setPlayerPokemon(pCopy);
    setOpponentPokemon(oCopy);
    setGameState(GameState.Battle);
    setLogs([]);
    setTurnState(TurnState.PlayerInput);
    
    addLog(`战斗开始！就决定是你了，${pCopy.name}！`, 'system');
    addLog(`野生的 ${oCopy.name} 跳了出来！`, 'system');
  };

  const calculateDamage = (attacker: Pokemon, defender: Pokemon, movePower: number, moveType: PokemonType) => {
    const variance = (Math.floor(Math.random() * 16) + 85) / 100;
    
    let typeMult = 1;
    const defenderTypeChart = TYPE_CHART[moveType];
    if (defenderTypeChart && defenderTypeChart[defender.type] !== undefined) {
      typeMult = defenderTypeChart[defender.type];
    }

    const stab = attacker.type === moveType ? 1.5 : 1;
    const level = 100; // Battle at level 100 for high stats feel
    const attack = 300; 
    const defense = 250; 
    
    // Adjusted formula for higher numbers
    let baseDamage = (((2 * level / 5 + 2) * movePower * (attack / defense)) / 50) + 2;
    const damage = Math.floor(baseDamage * stab * typeMult * variance);
    
    return { damage, isCritical: Math.random() > 0.85, typeMult }; // Higher crit rate for fun
  };

  const handlePlayerMove = async (moveIndex: number) => {
    if (turnState !== TurnState.PlayerInput || !playerPokemon || !opponentPokemon) return;

    const move = playerPokemon.moves[moveIndex];
    setTurnState(TurnState.Processing);

    const { damage, isCritical, typeMult } = calculateDamage(playerPokemon, opponentPokemon, move.power, move.type);
    
    setPlayerAttacking(true);
    setTimeout(() => {
        setPlayerAttacking(false);
        setOpponentHit(true);
        setTimeout(() => setOpponentHit(false), 500);
    }, 200);

    const newOpponentHp = Math.max(0, opponentPokemon.hp - damage);
    setOpponentPokemon(prev => prev ? { ...prev, hp: newOpponentHp } : null);

    addLog(`${playerPokemon.name} 使用了 ${move.name}!`, 'player');
    if (isCritical) addLog('击中要害！', 'effect');
    if (typeMult > 1) addLog('效果绝佳！', 'effect');
    if (typeMult < 1 && typeMult > 0) addLog('效果不好...', 'effect');
    if (typeMult === 0) addLog('似乎没有效果...', 'effect');
    
    generateBattleNarration(playerPokemon, opponentPokemon, move, damage, isCritical).then(text => {
        addLog(text, 'gemini');
    });

    if (newOpponentHp === 0) {
      setTimeout(() => {
        setTurnState(TurnState.Victory);
        setGameState(GameState.Victory);
        addLog(`${opponentPokemon.name} 倒下了！你赢了！`, 'system');
      }, 1000);
      return;
    }

    setTimeout(() => {
      setTurnState(TurnState.OpponentTurn);
      handleOpponentTurn(newOpponentHp);
    }, 1500);
  };

  const handleOpponentTurn = async (currentOpponentHp: number) => {
    if (!playerPokemon || !opponentPokemon) return;

    const tempOpponent = { ...opponentPokemon, hp: currentOpponentHp };
    const decision = await getOpponentDecision(tempOpponent, playerPokemon);
    
    if (decision.banter) {
      addLog(`(敌方) ${opponentPokemon.name}: "${decision.banter}"`, 'opponent');
    }

    const move = opponentPokemon.moves[decision.moveIndex];
    
    await new Promise(r => setTimeout(r, 1000));

    const { damage, isCritical, typeMult } = calculateDamage(opponentPokemon, playerPokemon, move.power, move.type);

    setOpponentAttacking(true);
    setTimeout(() => {
        setOpponentAttacking(false);
        setPlayerHit(true);
        setTimeout(() => setPlayerHit(false), 500);
    }, 200);

    setPlayerPokemon(prev => {
        if (!prev) return null;
        const newHp = Math.max(0, prev.hp - damage);
        if (newHp === 0) {
             setTimeout(() => {
                setTurnState(TurnState.Defeat);
                setGameState(GameState.GameOver);
                addLog(`${playerPokemon.name} 倒下了！你输了...`, 'system');
              }, 1000);
        } else {
             setTimeout(() => {
                 setTurnState(TurnState.PlayerInput);
             }, 1000);
        }
        return { ...prev, hp: newHp };
    });

    addLog(`${opponentPokemon.name} 使用了 ${move.name}!`, 'opponent');
    if (isCritical) addLog('击中要害！', 'effect');
    if (typeMult > 1) addLog('效果绝佳！', 'effect');
    
    generateBattleNarration(opponentPokemon, playerPokemon, move, damage, isCritical).then(text => {
        addLog(text, 'gemini');
    });
  };

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-950 overflow-hidden relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black"></div>
      
      <div className="z-10 text-center mb-10 relative">
          <h1 className="text-5xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tight">
            POKEMON BATTLE
          </h1>
          <p className="text-blue-400 text-lg font-bold mt-2 tracking-[0.5em] uppercase">Ultimate Edition</p>
      </div>
      
      <div className="z-10 w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {getInitialPokemon().map(p => (
            <button
                key={p.id}
                onClick={() => startGame(p)}
                className="group relative h-48 overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-700 hover:border-white/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-1 flex items-center p-4"
            >
                {/* Background gradient based on type */}
                <div className={`absolute inset-0 opacity-20 bg-gradient-to-r ${TYPE_COLORS[p.type].replace('bg-', 'from-')} to-transparent group-hover:opacity-40 transition-opacity`}></div>
                
                {/* Sprite */}
                <div className="w-1/2 flex items-center justify-center relative z-10">
                     <img 
                        src={`https://play.pokemonshowdown.com/sprites/xyani/${p.englishName.toLowerCase()}.gif`} 
                        alt={p.name}
                        className="h-32 object-contain scale-125 drop-shadow-xl group-hover:scale-150 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`; }}
                     />
                </div>
                
                {/* Info */}
                <div className="w-1/2 text-right z-10 flex flex-col items-end justify-center">
                    <h3 className="text-2xl font-black text-white mb-2 italic">{p.name}</h3>
                    <span className={`px-3 py-1 text-xs font-bold text-white rounded shadow-lg ${TYPE_COLORS[p.type]}`}>{p.type}</span>
                    <div className="mt-2 text-xs text-gray-400">HP {p.maxHp}</div>
                </div>
            </button>
            ))}
        </div>
      </div>
    </div>
  );

  const renderBattle = () => {
    if (!playerPokemon || !opponentPokemon) return null;

    // Dynamic 3D Backgrounds using CSS Gradients to simulate ground/sky
    const isCave = ['Rock', 'Ground', 'Ghost', 'Dragon', 'Poison', 'Steel', 'Dark'].includes(opponentPokemon.type);
    
    // Sky Gradient
    const skyClass = isCave 
        ? "bg-gradient-to-b from-gray-900 via-purple-900 to-slate-900" 
        : "bg-gradient-to-b from-blue-500 via-blue-300 to-white";
        
    // Ground Gradient (Perspective Plane)
    const groundClass = isCave
        ? "bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-slate-700 via-slate-800 to-black"
        : "bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-emerald-400 via-emerald-600 to-emerald-800";

    return (
      <div className={`flex flex-col h-screen relative overflow-hidden ${skyClass}`}>
        
        {/* 3D Scene Container */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{perspective: '1200px'}}>
             {/* The Floor Plane - Adjusted angle for better scale */}
             <div className={`
                absolute w-[200vw] h-[200vh] top-[55%] left-[-50%] 
                origin-top transform rotate-x-[75deg] 
                ${groundClass} opacity-100 shadow-[0_0_100px_rgba(0,0,0,0.5)_inset]
             `}>
                {/* Grid Lines for depth effect */}
                <div className="absolute inset-0 opacity-30" 
                     style={{
                         backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.2) 2px, transparent 2px)`,
                         backgroundSize: '100px 100px'
                     }}>
                </div>
                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[20px] border-white/10 rounded-full"></div>
             </div>
        </div>

        {/* HUD Layer */}
        <div className="relative z-10 flex flex-col h-full max-w-6xl mx-auto w-full p-2 sm:p-4 pointer-events-none">
            
            {/* Opponent HUD */}
            <div className="flex justify-between items-start pt-8 px-4">
                <div className="flex-1"></div>
                <div className="bg-black/60 backdrop-blur-md text-white p-4 rounded-xl border-b-4 border-red-500 shadow-2xl w-full max-w-sm pointer-events-auto transform skew-x-[-12deg]">
                    <div className="transform skew-x-[12deg]">
                        <div className="flex justify-between items-baseline mb-2">
                             <h3 className="text-xl font-bold truncate tracking-wide">{opponentPokemon.name}</h3>
                             <span className="text-sm font-bold text-red-400">Lv.100</span>
                        </div>
                        <HealthBar current={opponentPokemon.hp} max={opponentPokemon.maxHp} />
                    </div>
                </div>
            </div>

            {/* Battle Arena (Sprites) - Improved Z-Index and positioning */}
            <div className="flex-1 relative w-full h-full pointer-events-none">
                {/* Opponent Sprite (Far) */}
                <div className="absolute top-[5%] right-[20%] sm:right-[25%] z-0 transform scale-90">
                     <PokemonSprite 
                        pokemon={opponentPokemon} 
                        isOpponent 
                        isAttacking={opponentAttacking}
                        isHit={opponentHit}
                     />
                </div>

                {/* Player Sprite (Near) */}
                <div className="absolute bottom-[-5%] left-[10%] sm:left-[15%] z-20 transform scale-110">
                     <PokemonSprite 
                        pokemon={playerPokemon} 
                        isAttacking={playerAttacking}
                        isHit={playerHit}
                     />
                </div>
            </div>

            {/* Player Controls (Bottom) */}
            <div className="pointer-events-auto mt-auto pb-6">
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-end">
                    
                    {/* Battle Log Box - More styled */}
                    <div className="w-full md:w-1/3 order-2 md:order-1 h-32 md:h-40 bg-slate-900/90 rounded-2xl p-4 border-2 border-slate-600 shadow-2xl relative overflow-hidden">
                         <BattleLog logs={logs} />
                         <div className="absolute top-0 right-0 p-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                         </div>
                    </div>

                    {/* Move Selection & HP */}
                    <div className="w-full md:w-2/3 order-1 md:order-2 flex flex-col gap-4">
                        {/* Player HP */}
                        <div className="self-end w-full max-w-md bg-slate-800/90 p-4 rounded-xl border-b-4 border-yellow-500 shadow-xl transform skew-x-[-12deg] mb-2">
                            <div className="transform skew-x-[12deg]">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-xl font-bold text-yellow-400">{playerPokemon.name}</h3>
                                    <span className="text-xs text-gray-400 font-mono">{playerPokemon.hp}/{playerPokemon.maxHp}</span>
                                </div>
                                <HealthBar current={playerPokemon.hp} max={playerPokemon.maxHp} label="HP" />
                            </div>
                         </div>

                        {/* Moves Grid */}
                        <div className="grid grid-cols-2 gap-3 bg-slate-900/50 p-2 rounded-2xl backdrop-blur-sm">
                            {playerPokemon.moves.map((move, idx) => (
                                <button
                                    key={idx}
                                    disabled={turnState !== TurnState.PlayerInput}
                                    onClick={() => handlePlayerMove(idx)}
                                    className={`
                                        relative overflow-hidden rounded-lg p-4 text-left transition-all duration-200
                                        ${turnState === TurnState.PlayerInput 
                                            ? `hover:scale-[1.02] shadow-lg hover:shadow-xl active:scale-95 ${TYPE_COLORS[move.type]} text-white border-2 border-white/20` 
                                            : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'}
                                    `}
                                >
                                    {/* Glass sheen effect */}
                                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10"></div>
                                    
                                    <div className="relative z-10 flex justify-between items-center">
                                        <span className="font-black text-lg drop-shadow-md">{move.name}</span>
                                        <span className="text-xs font-bold bg-black/30 px-2 py-1 rounded">{move.type}</span>
                                    </div>
                                    <div className="relative z-10 text-xs opacity-90 mt-1 font-mono">
                                        PWR: {move.power} | {move.isSpecial ? 'Special' : 'Physical'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Overlay Screens */}
        {(gameState === GameState.GameOver || gameState === GameState.Victory) && (
            <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in backdrop-blur-md">
                <div className="max-w-lg w-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/10 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600"></div>
                    
                    <h2 className={`text-6xl font-black italic mb-8 tracking-tighter ${turnState === TurnState.Victory ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-gray-500'}`}>
                        {turnState === TurnState.Victory ? 'VICTORY' : 'DEFEATED'}
                    </h2>
                    
                    {/* Show MVP Pokemon */}
                    <div className="h-48 flex justify-center mb-8 relative">
                         <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl transform scale-75"></div>
                        <img 
                            src={`https://play.pokemonshowdown.com/sprites/xyani/${playerPokemon.englishName.toLowerCase()}.gif`} 
                            className="h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-10"
                        />
                    </div>

                    <button 
                        onClick={() => setGameState(GameState.Menu)}
                        className="w-full py-4 bg-white text-black font-black text-xl rounded-xl hover:bg-gray-200 transition-colors shadow-lg uppercase tracking-widest"
                    >
                        Play Again
                    </button>
                </div>
            </div>
        )}
      </div>
    );
  };

  return (
    <>
      {gameState === GameState.Menu && renderMenu()}
      {(gameState === GameState.Battle || gameState === GameState.GameOver || gameState === GameState.Victory) && renderBattle()}
    </>
  );
}

export default App;
