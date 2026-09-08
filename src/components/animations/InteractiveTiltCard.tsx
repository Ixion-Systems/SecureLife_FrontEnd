import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export interface InteractiveTiltCardProps {
  children: React.ReactNode;
  maxTilt?: number;
  scale?: number;
  className?: string;
  glareEffect?: boolean;
}

/**
 * InteractiveTiltCard Component
 * 
 * Wraps any informational card or graphic container with physics-based 3D tilt
 * and specular sheen response on mouse movement, powered by GSAP 3+ and GPU transforms.
 * Implements strict lifecycle cleanup (ctx.revert()) and respects prefers-reduced-motion.
 *
 * @component
 * @layer Core Animation Wrapper
 * @module components/animations/InteractiveTiltCard
 * 
 * @param {InteractiveTiltCardProps} props - Component properties.
 * @returns {React.ReactElement} Interactive 3D tilted card container.
 */
export const InteractiveTiltCard: React.FC<InteractiveTiltCardProps> = ({
  children,
  maxTilt = 10,
  scale = 1.025,
  className = '',
  glareEffect = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Check accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Set 3D transform origin and perspective on parent
      gsap.set(card, {
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
        const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1

        const rotX = -yPercent * maxTilt;
        const rotY = xPercent * maxTilt;

        gsap.to(card, {
          rotationX: rotX,
          rotationY: rotY,
          scale: scale,
          z: 15,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        // Specular glare position
        if (glareRef.current) {
          gsap.to(glareRef.current, {
            opacity: 0.25,
            x: x - rect.width / 2,
            y: y - rect.height / 2,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          z: 0,
          duration: 0.65,
          ease: 'elastic.out(1, 0.6)',
          overwrite: 'auto',
        });

        if (glareRef.current) {
          gsap.to(glareRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, cardRef);

    return () => ctx.revert();
  }, [maxTilt, scale]);

  return (
    <div
      ref={cardRef}
      className={`relative will-change-transform cursor-pointer select-none transition-shadow ${className}`}
    >
      {glareEffect && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="absolute -inset-10 pointer-events-none rounded-full bg-radial from-white/40 via-emerald-200/10 to-transparent opacity-0 blur-xl z-20"
        />
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
