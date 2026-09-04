import React, { useEffect, useRef } from 'react';

export interface WaveCanvasProps {
  className?: string;
  lineCount?: number;
}

/**
 * WaveCanvas Component
 * 
 * Interactive background canvas rendering animated sine-wave flow lines.
 * Features 3 depth tiers (far, mid, near) with varied line thicknesses and green tones
 * to simulate depth and distance.
 *
 * @component
 * @layer Presentation / Animation
 * @module components/animations/WaveCanvas
 * 
 * @param {WaveCanvasProps} props - Component properties.
 * @returns {React.ReactElement} The canvas element.
 */
export const WaveCanvas: React.FC<WaveCanvasProps> = ({
  className = 'absolute inset-0 w-full h-full pointer-events-none z-0 opacity-85',
  lineCount = 15,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let animationFrameId: number;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    interface WaveLine {
      yOffset: number;
      amplitude: number;
      frequency: number;
      speed: number;
      phase: number;
      color: string;
      lineWidth: number;
    }

    let lines: WaveLine[] = [];

    const initLines = () => {
      lines = [];
      for (let i = 0; i < lineCount; i++) {
        // Asignar profundidad (0 = lejano, 1 = medio, 2 = cercano)
        const depthTier = i % 3;
        let color: string;
        let lineWidth: number;
        let amplitude: number;

        if (depthTier === 0) {
          // Lejano: más transparente, trazo fino
          color = `rgba(74, 222, 128, ${0.12 + Math.random() * 0.08})`;
          lineWidth = 2.2 + Math.random() * 0.6;
          amplitude = 25 + Math.random() * 20;
        } else if (depthTier === 1) {
          // Medio: verde esmeralda vibrante
          color = `rgba(34, 197, 94, ${0.30 + Math.random() * 0.12})`;
          lineWidth = 3.2 + Math.random() * 0.8;
          amplitude = 35 + Math.random() * 25;
        } else {
          // Cercano: verde oscuro / teal con presencia sólida
          color = `rgba(0, 110, 47, ${0.55 + Math.random() * 0.15})`;
          lineWidth = 4.4 + Math.random() * 1.0;
          amplitude = 45 + Math.random() * 30;
        }

        lines.push({
          yOffset: Math.random() * height * 0.85 + height * 0.08,
          amplitude,
          frequency: Math.random() * 0.0025 + 0.001,
          speed: Math.random() * 0.0004 + 0.00015,
          phase: Math.random() * Math.PI * 2,
          color,
          lineWidth,
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initLines();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      lines.forEach((line) => {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 12) {
          const y =
            line.yOffset +
            Math.sin(x * line.frequency + (prefersReducedMotion ? line.phase : time * line.speed + line.phase)) *
              line.amplitude +
            Math.cos(x * line.frequency * 0.5 + (prefersReducedMotion ? line.phase : time * line.speed * 0.8)) *
              (line.amplitude * 0.45);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('resize', handleResize);
    initLines();

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      draw(0);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [lineCount]);

  return <canvas ref={canvasRef} className={className} />;
};
