import React, { useRef, useEffect, useState } from 'react';
import { SamuraiArchetype } from '../../types';

interface Samurai3DViewerProps {
  archetype: SamuraiArchetype;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  interactive?: boolean;
  animateStance?: boolean;
  className?: string;
  showAura?: boolean;
}

export const Samurai3DViewer: React.FC<Samurai3DViewerProps> = ({
  archetype,
  size = 'md',
  interactive = true,
  animateStance = true,
  className = '',
  showAura = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);

  const dimensions = {
    sm: { width: 140, height: 160 },
    md: { width: 220, height: 260 },
    lg: { width: 320, height: 380 },
    hero: { width: 420, height: 480 },
  }[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Particle system for aura / sakura / sparks
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
    }> = [];

    const initParticles = () => {
      for (let i = 0; i < 24; i++) {
        particles.push({
          x: (Math.random() - 0.5) * 120,
          y: Math.random() * 180 - 90,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 1.2 - 0.3,
          size: Math.random() * 3 + 1,
          alpha: Math.random() * 0.7 + 0.3,
          life: Math.random() * 100,
          maxLife: 100 + Math.random() * 50,
        });
      }
    };
    initParticles();

    const render = () => {
      time += 0.03;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 + 20;

      ctx.clearRect(0, 0, w, h);

      // Auto subtle rotation if not dragging
      const currentRotY = rotationY + (interactive ? Math.sin(time * 0.8) * 0.12 : 0);
      const breath = animateStance ? Math.sin(time * 2.5) * 3 : 0;
      const hoverBoost = isHovered ? 1.08 : 1.0;

      // Draw Atmospheric Base Glow & Shadow
      const glowGrad = ctx.createRadialGradient(cx, cy + 80, 10, cx, cy + 80, 130);
      glowGrad.addColorStop(0, `${archetype.color}44`);
      glowGrad.addColorStop(0.5, `${archetype.color}15`);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 90, 80 * hoverBoost, 26 * hoverBoost, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw Aura Particles behind character
      if (showAura) {
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life++;
          if (p.life > p.maxLife || p.y < -120) {
            p.x = (Math.random() - 0.5) * 100;
            p.y = 80 + Math.random() * 20;
            p.life = 0;
          }
          const pAlpha = (1 - p.life / p.maxLife) * p.alpha;
          ctx.fillStyle = `${archetype.accentColor}${Math.floor(pAlpha * 255)
            .toString(16)
            .padStart(2, '0')}`;
          ctx.beginPath();
          ctx.arc(cx + p.x, cy + p.y + breath, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(hoverBoost, hoverBoost);

      // 3D Matrix Perspective Simulation
      const cosR = Math.cos(currentRotY);
      const sinR = Math.sin(currentRotY);

      // Helper function to project 3D point (x, y, z) to 2D
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const rx = x * cosR - z * sinR;
        const rz = x * sinR + z * cosR;
        const fov = 350;
        const scale = fov / (fov + rz);
        return {
          x: rx * scale,
          y: (y + breath) * scale,
          z: rz,
          scale,
        };
      };

      // 1. TORSO & KIMONO ARMOR
      const torsoTopL = project(-28, -50, 10);
      const torsoTopR = project(28, -50, 10);
      const torsoBotR = project(24, 25, 10);
      const torsoBotL = project(-24, 25, 10);

      // Armor plate gradient
      const armorGrad = ctx.createLinearGradient(torsoTopL.x, torsoTopL.y, torsoBotR.x, torsoBotR.y);
      armorGrad.addColorStop(0, '#1E1E24');
      armorGrad.addColorStop(0.5, '#121216');
      armorGrad.addColorStop(1, '#0A0A0D');

      ctx.fillStyle = armorGrad;
      ctx.strokeStyle = archetype.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(torsoTopL.x, torsoTopL.y);
      ctx.lineTo(torsoTopR.x, torsoTopR.y);
      ctx.lineTo(torsoBotR.x, torsoBotR.y);
      ctx.lineTo(torsoBotL.x, torsoBotL.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Chest Emblem / Trim
      const crestP = project(0, -25, 14);
      ctx.fillStyle = archetype.color;
      ctx.beginPath();
      ctx.arc(crestP.x, crestP.y, 6 * crestP.scale, 0, Math.PI * 2);
      ctx.fill();

      // SASH / OBI BELT
      const obiL = project(-25, 20, 12);
      const obiR = project(25, 20, 12);
      ctx.strokeStyle = archetype.accentColor;
      ctx.lineWidth = 5 * obiL.scale;
      ctx.beginPath();
      ctx.moveTo(obiL.x, obiL.y);
      ctx.lineTo(obiR.x, obiR.y);
      ctx.stroke();

      // 2. KABUTO HELMET / HEAD
      const headCenter = project(0, -78, 0);
      const headRadius = 24 * headCenter.scale;

      // Helmet Dome
      const helmetGrad = ctx.createRadialGradient(
        headCenter.x - 5,
        headCenter.y - 8,
        2,
        headCenter.x,
        headCenter.y,
        headRadius
      );
      helmetGrad.addColorStop(0, '#2D2D38');
      helmetGrad.addColorStop(0.7, '#14141A');
      helmetGrad.addColorStop(1, '#08080A');

      ctx.fillStyle = helmetGrad;
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(headCenter.x, headCenter.y, headRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // MENPO FACE MASK / VISOR
      const maskL = project(-14, -72, 16);
      const maskR = project(14, -72, 16);
      const maskB = project(0, -60, 18);

      ctx.fillStyle = '#08080C';
      ctx.strokeStyle = archetype.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(maskL.x, maskL.y);
      ctx.lineTo(maskR.x, maskR.y);
      ctx.lineTo(maskB.x, maskB.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // GLOWING CYAN / RED SAMURAI EYES
      const eyeL = project(-7, -76, 17);
      const eyeR = project(7, -76, 17);
      ctx.fillStyle = archetype.accentColor;
      ctx.shadowColor = archetype.accentColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(eyeL.x, eyeL.y, 4 * eyeL.scale, 1.5 * eyeL.scale, 0, 0, Math.PI * 2);
      ctx.ellipse(eyeR.x, eyeR.y, 4 * eyeR.scale, 1.5 * eyeR.scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow

      // MAEDATE (HELMET CREST / HORNS)
      const hornBase = project(0, -96, 5);
      const hornL = project(-28, -115, 0);
      const hornR = project(28, -115, 0);

      ctx.strokeStyle = archetype.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(hornL.x, hornL.y);
      ctx.quadraticCurveTo(hornBase.x, hornBase.y - 10, hornR.x, hornR.y);
      ctx.stroke();

      // 3. PAULDRONS (SODE / SHOULDER ARMOR)
      const leftShoulder = project(-42, -45, 0);
      const rightShoulder = project(42, -45, 0);

      const drawPauldron = (p: { x: number; y: number; scale: number }) => {
        ctx.fillStyle = '#1A1A22';
        ctx.strokeStyle = archetype.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(p.x - 12 * p.scale, p.y - 8 * p.scale, 24 * p.scale, 32 * p.scale, 4);
        ctx.fill();
        ctx.stroke();
      };
      drawPauldron(leftShoulder);
      drawPauldron(rightShoulder);

      // 4. WEAPON RENDERING (KATANA / NODACHI / SPEAR)
      const weaponHand = project(38, 5, 15);
      const bladeTip = project(70 + Math.sin(time * 2) * 4, -90, -10);

      // Blade Trail & Edge Glow
      ctx.strokeStyle = archetype.accentColor;
      ctx.lineWidth = 3 * weaponHand.scale;
      ctx.shadowColor = archetype.accentColor;
      ctx.shadowBlur = isHovered ? 16 : 8;
      ctx.beginPath();
      ctx.moveTo(weaponHand.x, weaponHand.y);
      ctx.lineTo(bladeTip.x, bladeTip.y);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Katana Tsuba (Guard) & Hilt
      const hiltEnd = project(32, 28, 20);
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(weaponHand.x, weaponHand.y);
      ctx.lineTo(hiltEnd.x, hiltEnd.y);
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [archetype, isHovered, rotationY, interactive, animateStance, showAura]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    lastMouseXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !interactive) return;
    const deltaX = e.clientX - lastMouseXRef.current;
    lastMouseXRef.current = e.clientX;
    setRotationY((prev) => prev + deltaX * 0.015);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        isDraggingRef.current = false;
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className={`cursor-grab active:cursor-grabbing transition-transform duration-300 ${
          isHovered ? 'scale-105' : 'scale-100'
        }`}
      />
      {interactive && (
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#71717A] mt-1 opacity-70">
          Drag to rotate 3D view ⚔️
        </span>
      )}
    </div>
  );
};
