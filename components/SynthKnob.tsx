
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MousePointer2 } from 'lucide-react';

interface SynthKnobProps {
  label: string;
  value: number; // 0 to 100
  onChange: (value: number) => void;
  size?: number;
  color?: string;
  minDegree?: number;
  maxDegree?: number;
}

const SynthKnob: React.FC<SynthKnobProps> = ({ 
  label, 
  value, 
  onChange, 
  size = 80, 
  color = '#ff00ff',
  minDegree = -135,
  maxDegree = 135
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startValue = useRef(0);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startValue.current = value;
    document.body.style.overflow = 'hidden'; // Prevent page scroll while turning
  };

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = startY.current - currentY;
    // Mobile users often need higher sensitivity for smaller movements
    const sensitivity = 0.6;
    let newValue = startValue.current + (deltaY * sensitivity);
    
    newValue = Math.max(0, Math.min(100, newValue));
    onChange(newValue);
  }, [isDragging, onChange]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    document.body.style.overflow = ''; 
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  const rotation = (value / 100) * (maxDegree - minDegree) + minDegree;
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  // Calculate arc length based on degrees
  const totalArcDegrees = maxDegree - minDegree;
  const arcLength = (totalArcDegrees / 360) * circumference;
  const dashOffset = arcLength - (value / 100) * arcLength;

  return (
    <div className="flex flex-col items-center space-y-3 select-none touch-none">
      <div 
        ref={knobRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        className="relative active:scale-105 transition-transform"
        style={{ width: size, height: size }}
      >
        {/* Progress SVG Ring */}
        <svg 
          className="absolute inset-0 -rotate-90 transform" 
          width={size} 
          height={size}
          style={{ transform: `rotate(${minDegree - 90}deg)` }}
        >
          {/* Background Path */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#18181b"
            strokeWidth="4"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Progress Path */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={value > 0 ? color : '#333'}
            strokeWidth="4"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-75"
            style={{ 
              filter: value > 50 ? `drop-shadow(0 0 4px ${color})` : 'none',
              opacity: value > 0 ? 1 : 0.3
            }}
          />
        </svg>

        {/* Knob Body */}
        <div 
          className={`absolute inset-[15%] rounded-full bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-700 shadow-2xl border border-white/10 flex items-center justify-center transition-transform duration-75 ${isDragging ? 'brightness-125' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Indicator Light */}
          <div 
            className="absolute top-[10%] w-1.5 rounded-full transition-all duration-300 shadow-lg"
            style={{ 
              height: '30%', 
              backgroundColor: value > 0 ? color : '#444',
              boxShadow: value > 50 ? `0 0 10px ${color}` : 'none'
            }} 
          />
          
          {/* Center Cap with radial highlight */}
          <div className="w-[35%] h-[35%] rounded-full bg-zinc-900 border border-white/5 shadow-inner bg-gradient-to-b from-white/5 to-transparent" />
        </div>

        {/* Interaction Hint (Disappears after first use) */}
        {!hasInteracted && !isDragging && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-pulse">
            <MousePointer2 className="w-5 h-5 text-white/40 rotate-45" />
            <span className="text-[6px] font-black text-white/40 uppercase tracking-widest mt-1">Drag Up</span>
          </div>
        )}

        {/* Floating Value */}
        {isDragging && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 px-3 py-1 rounded-full text-[10px] font-black text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50">
            {Math.round(value)}%
          </div>
        )}
      </div>

      <div className="text-center w-full px-1">
        <p className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors duration-300 truncate ${value > 0 ? 'text-white' : 'text-zinc-600'}`}>
          {label}
        </p>
      </div>
    </div>
  );
};

export default SynthKnob;
