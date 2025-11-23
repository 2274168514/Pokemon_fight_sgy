import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface BattleLogProps {
  logs: LogEntry[];
}

const BattleLog: React.FC<BattleLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full h-full overflow-y-auto px-4 py-2 font-mono text-sm custom-scrollbar">
      {logs.length === 0 && (
        <div className="text-gray-500 italic text-center mt-4">等待指令...</div>
      )}
      {logs.map((log) => (
        <div key={log.id} className={`mb-1.5 animate-fade-in leading-relaxed ${
          log.source === 'gemini' ? 'text-purple-300 italic pl-2 border-l-2 border-purple-500/50' :
          log.source === 'player' ? 'text-green-300 font-bold' :
          log.source === 'opponent' ? 'text-red-300 font-bold' :
          log.source === 'effect' ? 'text-yellow-400 font-bold text-xs uppercase tracking-wider' :
          'text-gray-300'
        }`}>
          {log.source === 'effect' ? '⚡ ' : ''}
          {log.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default BattleLog;