import React from 'react';

interface LiaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const LiaLogo: React.FC<LiaLogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', text: 'text-sm', sub: 'text-[9px]', icon: 'w-4 h-4' },
    md: { box: 'w-11 h-11', text: 'text-lg', sub: 'text-[10px]', icon: 'w-5 h-5' },
    lg: { box: 'w-14 h-14', text: 'text-xl', sub: 'text-[11px]', icon: 'w-7 h-7' },
    xl: { box: 'w-20 h-20', text: 'text-2xl', sub: 'text-xs', icon: 'w-10 h-10' },
  };

  const dim = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Liquid Glass Neon Emblem */}
      <div className={`relative ${dim.box} rounded-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-fuchsia-600 p-[1.5px] shadow-[0_0_25px_rgba(168,85,247,0.55)] flex items-center justify-center group`}>
        {/* Inner Glass Container */}
        <div className="w-full h-full rounded-[14px] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden">
          {/* Specular glass glare */}
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-white/30 rounded-full blur-[3px]" />
          
          {/* Futuristic Hex/Trash Circuit Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${dim.icon} text-purple-300 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]`}
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-white ${dim.text} drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]`}>
              L.I.A
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 text-[9px] font-mono text-fuchsia-300 uppercase tracking-widest font-bold">
              AI ROBOT
            </span>
          </div>
          <span className={`text-slate-400 font-medium ${dim.sub}`}>
            Lixeira Inteligente Autônoma
          </span>
        </div>
      )}
    </div>
  );
};
