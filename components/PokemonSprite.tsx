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
  // Use official Pokemon artwork from PokeAPI
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  const animationClass = isAttacking 
    ? (isOpponent ? '-translate-x-8' : 'translate-x-8') 
    : '';

  const hitClass = isHit ? 'hit-flash shake' : '';

  return (
    <div className={`relative transition-transform duration-200 ${animationClass} ${hitClass}`}>
       {/* Platform shadow */}
       <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-black/40 rounded-[100%] blur-sm"></div>
       
       {/* The "Card" Frame acting as the Sprite container */}
       <div className={`
         relative w-40 h-40 rounded-xl overflow-hidden border-4 
         ${isOpponent ? 'border-red-500' : 'border-blue-500'} 
         shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-slate-800
       `}>
         <img 
           src={imageUrl} 
           alt={pokemon.name}
           className={`
             w-full h-full object-contain p-2
             ${isOpponent ? '' : 'scale-x-[-1]'} /* Mirror player sprite to face right */
           `}
         />
         
         {/* Type Overlay Tint */}
         <div className={`absolute inset-0 mix-blend-overlay opacity-30 ${TYPE_COLORS[pokemon.type]}`}></div>
         
         {/* Shine */}
         <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shimmer" />
       </div>

       {/* Status badges */}
       <div className="absolute -top-2 -right-2 flex gap-1">
          <span className={`px-2 py-0.5 text-[10px] font-bold text-white rounded-full shadow-sm ${TYPE_COLORS[pokemon.type]}`}>
            {pokemon.type}
          </span>
       </div>
    </div>
  );
};

export default PokemonSprite;