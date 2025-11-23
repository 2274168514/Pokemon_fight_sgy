import React from 'react';

interface HealthBarProps {
  current: number;
  max: number;
  label?: string;
}

const HealthBar: React.FC<HealthBarProps> = ({ current, max, label }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  let colorClass = 'bg-green-500';
  if (percentage < 50) colorClass = 'bg-yellow-500';
  if (percentage < 20) colorClass = 'bg-red-600';

  return (
    <div className="w-full bg-gray-800 rounded-lg p-2 border-2 border-gray-700 shadow-lg">
      <div className="flex justify-between text-xs uppercase font-bold text-gray-400 mb-1">
        <span>{label || 'HP'}</span>
        <span>{Math.ceil(current)} / {max}</span>
      </div>
      <div className="w-full bg-gray-900 rounded-full h-4 border border-gray-600 overflow-hidden relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '10px 10px'}}></div>
        
        {/* Actual Bar */}
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-10 rounded-full"></div>
      </div>
    </div>
  );
};

export default HealthBar;