import React, { useRef, useEffect } from 'react';

interface Dojo3DBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'vibrant';
  theme?: 'dojo' | 'crimson' | 'neon' | 'bamboo';
}

export const Dojo3DBackground: React.FC<Dojo3DBackgroundProps> = ({
  className = '',
  intensity = 'subtle',
  theme = 'dojo',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Sakura / Spark particle array
    const petals: Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      vx: number;
      vy: number;
      rot: number;
      vRot: number;
      alpha: number;
    }> = [];

    const numPetals = intensity === 'vibrant' ? 65 : 35;
    for (let i = 0; i < numPetals; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 400 + 100,
        size: Math.random() * 7 + 4,
        vx: Math.random() * 1.5 + 0.5,
        vy: Math.random() * 0.8 + 0.3,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep Dark Dojo Radial Vignette
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        50,
        width / 2,
        height * 0.5,
        width * 0.8
      );
      if (theme === 'crimson') {
        bgGrad.addColorStop(0, '#150608');
        bgGrad.addColorStop(0.6, '#0B0406');
        bgGrad.addColorStop(1, '#050203');
      } else if (theme === 'neon') {
        bgGrad.addColorStop(0, '#0A0E1A');
        bgGrad.addColorStop(0.6, '#060810');
        bgGrad.addColorStop(1, '#030408');
      } else if (theme === 'bamboo') {
        bgGrad.addColorStop(0, '#06140D');
        bgGrad.addColorStop(0.6, '#040B07');
        bgGrad.addColorStop(1, '#020503');
      } else {
        // Classic Dojo
        bgGrad.addColorStop(0, '#111116');
        bgGrad.addColorStop(0.5, '#0A0A0E');
        bgGrad.addColorStop(1, '#050507');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle 3D Torii Gate in Horizon
      const toriiScale = Math.min(width, height) * 0.35;
      const toriiX = width / 2;
      const toriiY = height * 0.38 + Math.sin(time * 0.5) * 4;

      ctx.save();
      ctx.strokeStyle =
        theme === 'crimson'
          ? 'rgba(227, 38, 46, 0.08)'
          : theme === 'neon'
          ? 'rgba(59, 130, 246, 0.08)'
          : 'rgba(227, 38, 46, 0.05)';
      ctx.lineWidth = 4;

      // Top lintel (kasagi)
      ctx.beginPath();
      ctx.moveTo(toriiX - toriiScale * 0.8, toriiY - toriiScale * 0.4);
      ctx.quadraticCurveTo(
        toriiX,
        toriiY - toriiScale * 0.44,
        toriiX + toriiScale * 0.8,
        toriiY - toriiScale * 0.4
      );
      ctx.stroke();

      // Lower lintel (nuki)
      ctx.beginPath();
      ctx.moveTo(toriiX - toriiScale * 0.65, toriiY - toriiScale * 0.3);
      ctx.lineTo(toriiX + toriiScale * 0.65, toriiY - toriiScale * 0.3);
      ctx.stroke();

      // Columns (hashira)
      ctx.beginPath();
      ctx.moveTo(toriiX - toriiScale * 0.45, toriiY - toriiScale * 0.4);
      ctx.lineTo(toriiX - toriiScale * 0.48, toriiY + toriiScale * 0.5);
      ctx.moveTo(toriiX + toriiScale * 0.45, toriiY - toriiScale * 0.4);
      ctx.lineTo(toriiX + toriiScale * 0.48, toriiY + toriiScale * 0.5);
      ctx.stroke();
      ctx.restore();

      // Drifting Sakura Petals in 3D Perspective
      petals.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.4;
        p.y += p.vy;
        p.rot += p.vRot;

        if (p.x > width + 50) p.x = -50;
        if (p.y > height + 50) p.y = -50;

        const scale = 300 / p.z;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(scale, scale);

        ctx.fillStyle =
          theme === 'crimson'
            ? `rgba(227, 38, 46, ${p.alpha * 0.6})`
            : theme === 'neon'
            ? `rgba(96, 165, 250, ${p.alpha * 0.5})`
            : `rgba(244, 114, 182, ${p.alpha * 0.45})`;

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Ambient Fog Grid / Floor Horizon
      const gridY = height * 0.85;
      const fogGrad = ctx.createLinearGradient(0, gridY - 150, 0, height);
      fogGrad.addColorStop(0, 'rgba(5, 5, 7, 0)');
      fogGrad.addColorStop(0.7, 'rgba(5, 5, 7, 0.7)');
      fogGrad.addColorStop(1, 'rgba(5, 5, 7, 0.98)');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, gridY - 150, width, height - (gridY - 150));

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [intensity, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.85 }}
    />
  );
};
