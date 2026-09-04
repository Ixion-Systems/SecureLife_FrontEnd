import React, { useEffect, useRef } from 'react';

export interface CotizadorAmbientCanvasProps {
  className?: string;
}

/**
 * CotizadorAmbientCanvas Component
 * 
 * Interactive background canvas specifically crafted for the Cotizador Section.
 * Combines fluid wave paths, luminous emerald particle pulses, and cursor repulsion
 * to deliver an engaging, vibrant atmosphere that highlights the glassmorphism surface.
 *
 * @component
 * @layer Presentation / Animation
 * @module components/animations/CotizadorAmbientCanvas
 */
export const CotizadorAmbientCanvas: React.FC<CotizadorAmbientCanvasProps> = ({
  className = 'absolute inset-0 w-full h-full pointer-events-none z-0',
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
    let step = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    interface AmbientNode {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      radius: number;
      vx: number;
      vy: number;
      hueOffset: number;
      alpha: number;
    }

    const nodeCount = 38;
    const nodes: AmbientNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      nodes.push({
        x,
        y,
        baseX: x,
        baseY: y,
        radius: 2 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        hueOffset: Math.random() * 30,
        alpha: 0.35 + Math.random() * 0.4,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.012;

      // 1. Draw 3 ambient harmonic curved lines in the background
      const lines = [
        { amp: 45, freq: 0.0018, speed: step * 0.8, color: 'rgba(34, 197, 94, 0.22)', yOffset: height * 0.25 },
        { amp: 65, freq: 0.0014, speed: -step * 0.6, color: 'rgba(0, 110, 47, 0.18)', yOffset: height * 0.55 },
        { amp: 55, freq: 0.0022, speed: step * 1.1, color: 'rgba(16, 185, 129, 0.25)', yOffset: height * 0.78 },
      ];

      lines.forEach((line) => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2.2;

        for (let x = 0; x <= width; x += 15) {
          const y =
            line.yOffset +
            Math.sin(x * line.freq + line.speed) * line.amp +
            Math.cos(x * 0.001 + line.speed * 0.5) * 20;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // 2. Draw connecting lines between nearby particles
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const opacity = (1 - dist / 160) * 0.32;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw nodes with pulsating aura
      nodes.forEach((n, idx) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const pulse = Math.sin(step * 2 + idx) * 0.8;
        const currentRadius = Math.max(1, n.radius + pulse);

        // Soft outer glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 222, 128, 0.12)`;
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 110, 47, ${n.alpha})`;
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('resize', handleResize);

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      draw();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
};
