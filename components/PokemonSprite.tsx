
import React from 'react';
import { Pokemon, PokemonType } from '../types';
import { TYPE_COLORS } from '../constants';

interface PokemonSpriteProps {
  pokemon: Pokemon;
  isOpponent?: boolean;
  isAttacking?: boolean;
  isHit?: boolean;
}

const PokemonSprite: React.FC<PokemonSpriteProps> = ({ pokemon, isOpponent, isAttacking, isHit }) => {
  // Use Pokemon Showdown XY Animated Sprites (3D Models)
  const name = pokemon.englishName.toLowerCase();
  
  // Front sprites (for opponent) usually face left-down
  // Back sprites (for player) usually face right-up
  const baseUrl = isOpponent 
    ? `https://play.pokemonshowdown.com/sprites/xyani/${name}.gif`
    : `https://play.pokemonshowdown.com/sprites/xyani-back/${name}.gif`;

  const animationClass = isAttacking 
    ? (isOpponent ? '-translate-x-12' : 'translate-x-12') 
    : 'animate-float'; // Idle animation

  const hitClass = isHit ? 'hit-flash brightness-200 contrast-200' : '';

  return (
    <div className={`relative transition-all duration-300 ${animationClass} ${hitClass}`}>
       
       {/* Shadow to ground the model - Dynamic size based on isOpponent for perspective */}
       <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/40 rounded-[100%] blur-md scale-y-50 
           ${isOpponent ? 'w-48 h-12' : 'w-64 h-16'}
       `}></div>
       
       {/* The 3D GIF Container - Increased size for Legendaries */}
       <div className={`
         relative flex items-end justify-center
         ${isOpponent ? 'h-64 w-64' : 'h-80 w-80'} 
       `}>
         <img 
           src={baseUrl} 
           alt={pokemon.name}
           className={`
             max-w-none 
             ${isOpponent ? 'h-[100%] object-contain' : 'h-[120%] object-contain'}
             drop-shadow-2xl
           `}
           style={{
             imageRendering: 'pixelated' 
           }}
           onError={(e) => {
             // Fallback to static if GIF fails
             e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
             e.currentTarget.className = "h-full w-full object-contain";
           }}
         />
       </div>

       {/* Type Badge Floating Above */}
       {isOpponent && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity z-10">
            <span className={`px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg border border-white/20 ${TYPE_COLORS[pokemon.type]}`}>
              {pokemon.type}
            </span>
        </div>
       )}
    </div>
  );
};

export default PokemonSprite;
