import React, { useEffect, useRef } from 'react';

export default function PixelParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Lightweight subtle ambient pixels (45 count max for 60fps zero lag)
    const particleCount = 45;
    const particles = new Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particles[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() < 0.8 ? 2 : 3,
        speedY: -Math.random() * 0.3 - 0.05,
        opacity: Math.random() * 0.4 + 0.1,
      };
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        ctx.fillStyle = `rgba(37, 99, 235, ${p.opacity})`;
        ctx.fillRect(p.x | 0, p.y | 0, p.size, p.size);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
}
