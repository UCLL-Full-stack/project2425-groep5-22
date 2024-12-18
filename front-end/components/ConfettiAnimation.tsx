import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  rotation: number;
}

const Confetti: React.FC<ConfettiProps> = ({ x, y, size, speed, color, rotation }) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        animation: `fall ${speed}s linear infinite`,
        opacity: 0.8,
        position: 'fixed',
        transform: `rotate(${rotation}deg)`,
        zIndex: 9999
      }}
    />
  );
};

const ConfettiAnimation: React.FC = () => {
  const [confetti, setConfetti] = useState<ConfettiProps[]>([]);

  const COLORS = [
    '#f44336', // Red
    '#e91e63', // Pink
    '#9c27b0', // Purple
    '#673ab7', // Deep Purple
    '#3f51b5', // Indigo
    '#2196f3', // Blue
    '#03a9f4', // Light Blue
    '#00bcd4', // Cyan
    '#009688', // Teal
    '#4caf50', // Green
    '#8bc34a', // Light Green
    '#cddc39', // Lime
    '#ffeb3b', // Yellow
    '#ffc107', // Amber
    '#ff9800', // Orange
    '#ff5722'  // Deep Orange
  ];

  useEffect(() => {
    const generateConfetti = () => {
      const newConfetti: ConfettiProps[] = [];
      const confettiCount = window.innerWidth > 1200 ? 200 :
        window.innerWidth > 768 ? 150 : 100;

      for (let i = 0; i < confettiCount; i++) {
        newConfetti.push({
          x: Math.random() * window.innerWidth,
          y: -10 - Math.random() * 100,
          size: 5 + Math.random() * 10,
          speed: 8 + Math.random() * 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * 360
        });
      }
      setConfetti(newConfetti);
    };

    generateConfetti();
    window.addEventListener('resize', generateConfetti);
    return () => {
      window.removeEventListener('resize', generateConfetti);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes fall {
          to {
            transform: 
              translateY(100vh) 
              rotate(${Math.random() * 720}deg) 
              translateX(${Math.random() * 200 - 100}px);
          }
        }
      `}</style>
      {confetti.map((piece, index) => (
        <Confetti
          key={index}
          x={piece.x}
          y={piece.y}
          size={piece.size}
          speed={piece.speed}
          color={piece.color}
          rotation={piece.rotation}
        />
      ))}
    </>
  );
};

export default ConfettiAnimation;