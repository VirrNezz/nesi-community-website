import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  pulseSpeed: number;
  angle: number;
}

export default function CyberParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Scale canvas to handle high DPI screens beautifully
    const handleResize = () => {
      const parent = canvas.parentElement;
      const width = parent ? parent.clientWidth : window.innerWidth;
      const height = parent ? parent.clientHeight : window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      // Re-init particles on significant resize to spread them across the screen
      initParticles(width, height);
    };

    const initParticles = (width: number, height: number) => {
      particles = [];
      const isMobile = window.innerWidth < 768;
      // adaptive particle count - 15 on mobile, 35 on desktop
      const density = isMobile 
        ? Math.min(15, Math.floor((width * height) / 35000))
        : Math.min(35, Math.floor((width * height) / 25000));

      for (let i = 0; i < density; i++) {
        // Aesthetic cyberpunk color palette: glowing cyan, magenta/purple, and amber/gold highlights
        const colorRand = Math.random();
        let color = 'rgba(6, 182, 212, 0.25)'; // Cyan
        if (colorRand > 0.75) {
          color = 'rgba(236, 72, 153, 0.22)'; // Magenta/pink
        } else if (colorRand > 0.5) {
          color = 'rgba(245, 158, 11, 0.18)'; // Gold/amber
        }

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.6,
          speedX: (Math.random() - 0.5) * 0.35,
          speedY: (Math.random() - 0.5) * 0.35,
          color,
          pulseSpeed: Math.random() * 0.02 + 0.005,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    // Initialize dimensions and initial setup
    handleResize();
    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isMobile = window.innerWidth < 768;

      // 1. Draw web connection lines in ONE single path session (huge batch performance gain!)
      if (!isMobile && particles.length > 0) {
        const maxConnectionDist = 110;
        const maxConnectionDistSq = maxConnectionDist * maxConnectionDist;
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
        ctx.lineWidth = 0.5;

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            // Draw neon links if particles are close (avoiding Math.sqrt if out of range)
            if (distSq < maxConnectionDistSq) {
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            }
          }
        }
        ctx.stroke();
      }

      // 2. Draw and update particles
      particles.forEach((p) => {
        // Move particle
        p.x += p.speedX;
        p.y += p.speedY;

        // Pulse the size
        p.angle += p.pulseSpeed;
        const pulseFactor = Math.sin(p.angle) * 0.3 + 0.85;
        const currentSize = p.size * pulseFactor;

        // Wrap around borders gracefully
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Optional micro outer glow ring for larger particles (desktop only to save mobile draw calls)
        if (!isMobile && p.size > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(')', ', 0.04)').replace('rgba', 'rgba');
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none block"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
