import React, { useEffect, useRef } from 'react';

export interface GeometryCanvasProps {
  className?: string;
  particleCount?: number;
}

/**
 * GeometryCanvas Component
 * 
 * Interactive geometric particle canvas creating a dynamic constellation background.
 * Features 3 spatial depth tiers with differentiated line widths and green tones
 * (distant soft mint to foreground intense emerald).
 *
 * @component
 * @layer Presentation / Animation
 * @module components/animations/GeometryCanvas
 * 
 * @param {GeometryCanvasProps} props - Component properties.
 * @returns {React.ReactElement} The animated canvas element.
 */
export const GeometryCanvas: React.FC<GeometryCanvasProps> = ({
  className = 'absolute inset-0 w-full h-full z-0 opacity-90',
  particleCount = 45,
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
    const mouse: { x: number | null; y: number | null } = { x: null, y: null };

    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      depth: number; // 0 = lejano, 1 = medio, 2 = cercano
      color: string;
    }

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const depth = i % 3;
        let radius: number;
        let color: string;
        let speedMult: number;

        if (depth === 0) {
          // Lejano: radio sutil, color translúcido
          radius = 1.6 + Math.random() * 0.6;
          color = `rgba(74, 222, 128, ${0.25 + Math.random() * 0.15})`;
          speedMult = 0.3;
        } else if (depth === 1) {
          // Medio: radio intermedio, verde esmeralda
          radius = 2.2 + Math.random() * 0.6;
          color = `rgba(34, 197, 94, ${0.55 + Math.random() * 0.15})`;
          speedMult = 0.5;
        } else {
          // Cercano: radio ligeramente mayor (casi nada), verde profundo y nítido
          radius = 2.8 + Math.random() * 0.6;
          color = `rgba(0, 110, 47, ${0.80 + Math.random() * 0.15})`;
          speedMult = 0.65;
        }

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          vx: (Math.random() - 0.5) * speedMult,
          vy: (Math.random() - 0.5) * speedMult,
          depth,
          color,
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Dibujar líneas conectoras con grosor ensanchado y profundidad
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 155) {
            const avgDepth = (particles[i].depth + particles[j].depth) / 2;
            const distRatio = 1 - dist / 155;

            let strokeColor: string;
            let lineWidth: number;

            if (avgDepth >= 1.5) {
              // Conexión cercana: línea más ancha y nítida
              lineWidth = 2.4;
              strokeColor = `rgba(0, 110, 47, ${distRatio * 0.40})`;
            } else if (avgDepth >= 0.8) {
              // Conexión media
              lineWidth = 1.8;
              strokeColor = `rgba(34, 197, 94, ${distRatio * 0.28})`;
            } else {
              // Conexión lejana: tenue y suave
              lineWidth = 1.3;
              strokeColor = `rgba(74, 222, 128, ${distRatio * 0.18})`;
            }

            ctx.beginPath();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 2. Actualizar y dibujar nodos (partículas)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Rebote en bordes
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Repulsión interactiva con el cursor
        if (mouse.x !== null && mouse.y !== null && !prefersReducedMotion) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            p.x -= dx * 0.025;
            p.y -= dy * 0.025;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    initParticles();

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      draw();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount]);

  return <canvas ref={canvasRef} className={className} />;
};
