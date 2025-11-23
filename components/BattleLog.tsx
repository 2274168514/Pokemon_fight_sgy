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
    <div className="w-full h-48 bg-slate-900/90 border-2 border-slate-600 rounded-lg overflow-y-auto p-4 font-mono text-sm shadow-inner custom-scrollbar backdrop-blur-sm">
      {logs.length === 0 && (
        <div className="text-gray-500 italic text-center mt-10">等待战斗开始...</div>
      )}
      {logs.map((log) => (
        <div key={log.id} className={`mb-2 animate-fade-in ${
          log.source === 'gemini' ? 'text-purple-300 italic border-l-2 border-purple-500 pl-2' :
          log.source === 'player' ? 'text-green-300' :
          log.source === 'opponent' ? 'text-red-300' :
          'text-gray-300'
        }`}>
          <span className="opacity-50 text-xs mr-2">[{log.source === 'gemini' ? 'AI解说' : '>_ '}]</span>
          {log.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default BattleLog;