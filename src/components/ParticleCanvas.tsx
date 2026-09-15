import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}

interface Spark {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
}

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const PETAL_COLORS = [
      'rgba(244, 114, 182, 0.75)', // soft pink
      'rgba(225, 29, 72, 0.65)',   // rose red
      'rgba(190, 18, 60, 0.7)',    // crimson
      'rgba(251, 207, 232, 0.8)'   // blush
    ];

    const petals: Petal[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: Math.random() * 0.5 - 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.6 + 0.3,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]
    }));

    const sparks: Spark[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.8,
      maxOpacity: Math.random() * 0.7 + 0.2
    }));

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size, -p.size * 1.5, -p.size * 1.5, p.size * 0.5, 0, p.size * 1.8);
      ctx.bezierCurveTo(p.size * 1.5, p.size * 0.5, p.size, -p.size * 1.5, 0, 0);
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render sparks
      sparks.forEach((s) => {
        s.y += s.speedY;
        s.x += s.speedX + Math.sin(s.y * 0.01) * 0.1;
        if (s.y < 0) {
          s.y = canvas.height + 10;
          s.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${s.opacity})`;
        ctx.fill();
      });

      // Render petals
      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.4;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        drawPetal(p);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-80"
    />
  );
};
