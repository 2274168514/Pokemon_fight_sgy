import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Pokemon, GameState, LogEntry, TurnState } from './types';
import { POKEMON_ROSTER, TYPE_COLORS } from './constants';
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

  const startGame = (selected: Pokemon) => {
    const opponent = POKEMON_ROSTER.filter(p => p.id !== selected.id)[Math.floor(Math.random() * (POKEMON_ROSTER.length - 1))];
    
    // Deep copy to reset HP if restarting
    const pCopy = JSON.parse(JSON.stringify(selected));
    const oCopy = JSON.parse(JSON.stringify(opponent));
    
    setPlayerPokemon(pCopy);
    setOpponentPokemon(oCopy);
    setGameState(GameState.Battle);
    setLogs([]);
    setTurnState(TurnState.PlayerInput);
    
    addLog(`战斗开始！你派出了 ${pCopy.name}！`, 'system');
    addLog(`野生的 ${oCopy.name} 出现了！`, 'system');
  };

  const calculateDamage = (attacker: Pokemon, defender: Pokemon, movePower: number, moveType: string) => {
    // Simplified damage formula
    // Random variance 0.85 - 1.0
    const variance = (Math.floor(Math.random() * 16) + 85) / 100;
    const baseDamage = (movePower * 0.6); 
    
    // Type effectiveness (Very simplified for demo)
    let multiplier = 1;
    if (moveType === 'Fire' && defender.type === 'Grass') multiplier = 2;
    if (moveType === 'Water' && defender.type === 'Fire') multiplier = 2;
    if (moveType === 'Grass' && defender.type === 'Water') multiplier = 2;
    if (moveType === 'Electric' && defender.type === 'Water') multiplier = 2;
    
    const damage = Math.floor(baseDamage * multiplier * variance);
    return { damage, isCritical: Math.random() > 0.9, multiplier };
  };

  const handlePlayerMove = async (moveIndex: number) => {
    if (turnState !== TurnState.PlayerInput || !playerPokemon || !opponentPokemon) return;

    const move = playerPokemon.moves[moveIndex];
    setTurnState(TurnState.Processing);

    // 1. Calculate Player Damage
    const { damage, isCritical } = calculateDamage(playerPokemon, opponentPokemon, move.power, move.type);
    
    // Animation
    setPlayerAttacking(true);
    setTimeout(() => {
        setPlayerAttacking(false);
        setOpponentHit(true);
        setTimeout(() => setOpponentHit(false), 500);
    }, 200);

    // Update Opponent HP
    const newOpponentHp = Math.max(0, opponentPokemon.hp - damage);
    setOpponentPokemon(prev => prev ? { ...prev, hp: newOpponentHp } : null);

    // Log
    addLog(`${playerPokemon.name} 使用了 ${move.name}!`, 'player');
    
    // Gemini Narration (Async)
    generateBattleNarration(playerPokemon, opponentPokemon, move, damage, isCritical).then(text => {
        addLog(text, 'gemini');
    });

    // Check Win
    if (newOpponentHp === 0) {
      setTimeout(() => {
        setTurnState(TurnState.Victory);
        setGameState(GameState.GameOver);
        addLog(`${opponentPokemon.name} 倒下了！你赢了！`, 'system');
      }, 1000);
      return;
    }

    // 2. Transition to Opponent Turn
    setTimeout(() => {
      setTurnState(TurnState.OpponentTurn);
      handleOpponentTurn(newOpponentHp); // Pass latest HP to avoid closure staleness
    }, 1500);
  };

  const handleOpponentTurn = async (currentOpponentHp: number) => {
    if (!playerPokemon || !opponentPokemon) return;

    // Temporarily construct the opponent object with current HP for the AI function
    const tempOpponent = { ...opponentPokemon, hp: currentOpponentHp };

    // Gemini AI Decision
    const decision = await getOpponentDecision(tempOpponent, playerPokemon);
    
    if (decision.banter) {
      addLog(`(敌方) ${opponentPokemon.name}: "${decision.banter}"`, 'opponent');
    }

    // Execute AI Move
    const move = opponentPokemon.moves[decision.moveIndex];
    
    // Wait a bit for reading
    await new Promise(r => setTimeout(r, 1000));

    const { damage, isCritical } = calculateDamage(opponentPokemon, playerPokemon, move.power, move.type);

    // Animation
    setOpponentAttacking(true);
    setTimeout(() => {
        setOpponentAttacking(false);
        setPlayerHit(true);
        setTimeout(() => setPlayerHit(false), 500);
    }, 200);

    // Update Player HP
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
             // Back to player
             setTimeout(() => {
                 setTurnState(TurnState.PlayerInput);
             }, 1000);
        }
        return { ...prev, hp: newHp };
    });

    // Log
    addLog(`${opponentPokemon.name} 使用了 ${move.name}!`, 'opponent');

     // Gemini Narration for Opponent
     generateBattleNarration(opponentPokemon, playerPokemon, move, damage, isCritical).then(text => {
        addLog(text, 'gemini');
    });
  };

  // --- Render Helpers ---

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-800 to-slate-900">
      <h1 className="text-6xl font-display text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] tracking-wider">
        宝可梦大乱斗
      </h1>
      <p className="text-slate-400 mb-12 text-lg">Powered by Gemini AI</p>
      
      <h2 className="text-2xl text-white mb-6">请选择你的伙伴:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
        {POKEMON_ROSTER.map(p => (
          <button
            key={p.id}
            onClick={() => startGame(p)}
            className="group relative overflow-hidden rounded-xl bg-slate-800 border-2 border-slate-700 hover:border-yellow-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:-translate-y-2"
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${TYPE_COLORS[p.type]}`} />
            <div className="p-6 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white/10 group-hover:border-white/30 transition-colors bg-black/20 p-2">
                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`} alt={p.name} className="w-full h-full object-contain" />
                </div>
              <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full bg-slate-900 text-white/80`}>{p.type}</span>
              
              <div className="mt-4 w-full space-y-1">
                 <div className="flex justify-between text-xs text-gray-400"><span>HP</span><span>{p.maxHp}</span></div>
                 <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                     <div className={`h-full ${TYPE_COLORS[p.type]} w-3/4`}></div>
                 </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderBattle = () => {
    if (!playerPokemon || !opponentPokemon) return null;

    return (
      <div className="flex flex-col h-screen bg-slate-900 relative">
        {/* Background Ambience */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Battle Arena */}
        <div className="flex-1 relative flex flex-col max-w-5xl mx-auto w-full px-4 py-6">
            
            {/* Top Bar: Opponent Status */}
            <div className="flex justify-end mb-8 animate-slide-in-right">
                <div className="w-full max-w-md">
                    <div className="flex justify-between items-end mb-2 px-1">
                         <h3 className="text-xl font-bold text-white drop-shadow-md">{opponentPokemon.name}</h3>
                         <span className={`text-xs px-2 py-1 rounded bg-slate-800 ${TYPE_COLORS[opponentPokemon.type]} text-white`}>{opponentPokemon.type}</span>
                    </div>
                    <HealthBar current={opponentPokemon.hp} max={opponentPokemon.maxHp} label="敌方 HP" />
                </div>
            </div>

            {/* Middle: Sprites */}
            <div className="flex-1 flex justify-between items-center relative px-8 sm:px-20">
                {/* Player Position (Left) */}
                <div className="absolute bottom-10 left-4 sm:left-20 z-10">
                     <PokemonSprite 
                        pokemon={playerPokemon} 
                        isAttacking={playerAttacking}
                        isHit={playerHit}
                     />
                </div>

                {/* Opponent Position (Right, Higher) */}
                <div className="absolute top-10 right-4 sm:right-20 z-0">
                     <PokemonSprite 
                        pokemon={opponentPokemon} 
                        isOpponent 
                        isAttacking={opponentAttacking}
                        isHit={opponentHit}
                     />
                </div>

                 {/* VS Graphic or Center Effect */}
                 {turnState === TurnState.Processing && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                         <div className="text-6xl font-display text-yellow-400 animate-bounce drop-shadow-lg">
                             VS
                         </div>
                     </div>
                 )}
            </div>

            {/* Bottom: Player Status & Controls */}
            <div className="mt-auto bg-slate-800/80 backdrop-blur-md rounded-t-3xl border-t-4 border-slate-700 shadow-2xl p-6 animate-slide-in-up">
                <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Player Stats */}
                    <div className="w-full md:w-1/3 space-y-2">
                         <div className="flex justify-between items-end mb-1">
                             <h3 className="text-2xl font-bold text-white">{playerPokemon.name}</h3>
                             <span className="text-sm text-gray-400 font-mono">Lv. 50</span>
                         </div>
                         <HealthBar current={playerPokemon.hp} max={playerPokemon.maxHp} label="我的 HP" />
                         <div className="mt-4">
                             <BattleLog logs={logs} />
                         </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full md:w-2/3 grid grid-cols-2 gap-3">
                        {playerPokemon.moves.map((move, idx) => (
                            <button
                                key={move.name}
                                disabled={turnState !== TurnState.PlayerInput}
                                onClick={() => handlePlayerMove(idx)}
                                className={`
                                    relative group overflow-hidden rounded-xl p-4 text-left transition-all
                                    border-2 
                                    ${turnState === TurnState.PlayerInput 
                                        ? 'border-slate-600 hover:border-white bg-slate-700 hover:bg-slate-600 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl' 
                                        : 'border-slate-800 bg-slate-800 opacity-50 cursor-not-allowed'}
                                `}
                            >
                                {/* Hover Glow based on Type */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${TYPE_COLORS[move.type]}`}></div>
                                
                                <div className="flex justify-between items-start relative z-10">
                                    <span className="font-bold text-lg text-white">{move.name}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border border-white/20 text-white/70`}>
                                        {move.type}
                                    </span>
                                </div>
                                <div className="flex justify-between mt-2 text-sm text-gray-400 relative z-10">
                                    <span>威力: {move.power}</span>
                                    <span>{move.isSpecial ? '特殊' : '物理'}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Game Over Overlay */}
        {gameState === GameState.GameOver && (
            <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm animate-fade-in">
                <div className="bg-slate-800 p-8 rounded-2xl border-4 border-yellow-500 max-w-md w-full text-center shadow-2xl transform scale-110">
                    <h2 className={`text-5xl font-display mb-4 ${turnState === TurnState.Victory ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {turnState === TurnState.Victory ? '胜利!' : '败北...'}
                    </h2>
                    <p className="text-white mb-8 text-lg">
                        {turnState === TurnState.Victory 
                            ? `你和 ${playerPokemon.name} 表现得太棒了！` 
                            : `不要气馁，下次一定会赢的！`}
                    </p>
                    <button 
                        onClick={() => setGameState(GameState.Menu)}
                        className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full text-xl transition-transform hover:scale-105 shadow-lg"
                    >
                        返回主菜单
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
      {(gameState === GameState.Battle || gameState === GameState.GameOver) && renderBattle()}
    </>
  );
}

export default App;