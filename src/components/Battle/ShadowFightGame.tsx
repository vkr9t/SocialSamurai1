import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Swords, Trophy, Sparkles, Flame, Shield, ArrowRight, RefreshCw, Zap, Volume2 } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface ShadowFightGameProps {
  onGameOver: (finalScore: number, combo: number, enemiesKilled: number, victory: boolean) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface Floater {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

interface SlashTrail {
  points: Array<{ x: number; y: number; alpha: number }>;
  color: string;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  isPlayer: boolean;
  radius: number;
  life: number;
}

export const ShadowFightGame: React.FC<ShadowFightGameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // React UI state for HUD
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [playerShadowEnergy, setPlayerShadowEnergy] = useState<number>(0);
  const [enemyHp, setEnemyHp] = useState<number>(100);
  const [enemyMaxHp, setEnemyMaxHp] = useState<number>(100);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [bossName, setBossName] = useState<string>('Shadow Shinobi');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [comboCount, setComboCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [announcement, setAnnouncement] = useState<string | null>('ROUND 1 — FIGHT!');
  const [isSlowMo, setIsSlowMo] = useState<boolean>(false);

  // Complete game state ref for continuous 60fps loop
  const game = useRef({
    running: true,
    timeLeft: 60,
    score: 0,
    combo: 0,
    maxCombo: 0,
    enemiesKilled: 0,
    round: 1,
    gameOverTriggered: false,
    slowMoTimer: 0,
    screenShake: 0,
    shadowUltimateActive: false,
    shadowUltimateTimer: 0,

    keys: {
      left: false,
      right: false,
      up: false,
      down: false,
      light: false,
      heavy: false,
      kick: false,
      kunai: false,
      shadow: false,
    },

    player: {
      x: 150,
      y: 320,
      vx: 0,
      vy: 0,
      hp: 100,
      maxHp: 100,
      shadowEnergy: 20, // 0 to 100
      action: 'idle' as 'idle' | 'run' | 'jump' | 'light1' | 'light2' | 'light3' | 'heavy' | 'kick' | 'kunai' | 'shadow_ult' | 'block' | 'hurt' | 'knockdown',
      actionTimer: 0,
      comboStep: 0,
      comboWindow: 0,
      facing: 1, // 1 right, -1 left
      isGrounded: true,
      shadowForm: false,
    },

    enemy: {
      x: 650,
      y: 320,
      vx: 0,
      vy: 0,
      hp: 100,
      maxHp: 100,
      name: 'Shadow Shinobi',
      type: 'shinobi' as 'shinobi' | 'titan' | 'shogun',
      action: 'idle' as 'idle' | 'run' | 'jump' | 'attack_light' | 'attack_heavy' | 'attack_kick' | 'block' | 'hurt' | 'knockdown' | 'teleport',
      actionTimer: 0,
      aiCooldown: 30,
      facing: -1,
      isGrounded: true,
    },

    particles: [] as Particle[],
    floaters: [] as Floater[],
    slashTrails: [] as SlashTrail[],
    projectiles: [] as Projectile[],
  });

  // Trigger floating damage text
  const addFloater = (x: number, y: number, text: string, color: string = '#FFFFFF') => {
    game.current.floaters.push({
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -2,
    });
  };

  // Trigger particle burst
  const spawnParticles = (x: number, y: number, count: number, color: string = '#A855F7') => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      game.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: Math.random() * 4 + 2,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 20 + 15,
      });
    }
  };

  // Player action handlers
  const handleLightAttack = useCallback(() => {
    const s = game.current;
    if (s.player.action === 'hurt' || s.player.action === 'knockdown' || s.player.action === 'shadow_ult') return;

    sounds.playSlash();
    let nextStep = (s.player.comboStep % 3) + 1;
    s.player.comboStep = nextStep;
    s.player.action = nextStep === 1 ? 'light1' : nextStep === 2 ? 'light2' : 'light3';
    s.player.actionTimer = 16;
    s.player.comboWindow = 35;

    // Hit calculation
    const dist = Math.abs(s.player.x - s.enemy.x);
    if (dist < 110 && s.enemy.hp > 0 && s.enemy.action !== 'teleport') {
      const isBlocked = s.enemy.action === 'block';
      const dmg = isBlocked ? 4 : nextStep === 3 ? 24 : 14;
      s.enemy.hp = Math.max(0, s.enemy.hp - dmg);
      
      if (!isBlocked) {
        s.enemy.action = nextStep === 3 ? 'knockdown' : 'hurt';
        s.enemy.actionTimer = nextStep === 3 ? 28 : 12;
        s.enemy.vx = s.player.facing * (nextStep === 3 ? 8 : 4);
        sounds.playHit();
        s.screenShake = nextStep === 3 ? 8 : 4;
        spawnParticles(s.enemy.x, s.enemy.y - 40, nextStep === 3 ? 20 : 10, '#C084FC');
        addFloater(s.enemy.x, s.enemy.y - 70, `${dmg}`, nextStep === 3 ? '#FDE047' : '#FFFFFF');
      } else {
        sounds.playBlock();
        spawnParticles(s.enemy.x, s.enemy.y - 40, 6, '#93C5FD');
        addFloater(s.enemy.x, s.enemy.y - 70, 'BLOCKED', '#93C5FD');
      }

      s.combo += 1;
      s.maxCombo = Math.max(s.maxCombo, s.combo);
      s.score += 80 * s.combo;
      s.player.shadowEnergy = Math.min(100, s.player.shadowEnergy + (nextStep === 3 ? 18 : 10));
    }
  }, []);

  const handleHeavyAttack = useCallback(() => {
    const s = game.current;
    if (s.player.action === 'hurt' || s.player.action === 'knockdown' || s.player.action === 'shadow_ult') return;

    sounds.playSwordSwish();
    s.player.action = 'heavy';
    s.player.actionTimer = 24;
    s.player.vx = s.player.facing * 5;

    setTimeout(() => {
      if (s.player.action === 'heavy' && s.enemy.hp > 0) {
        const dist = Math.abs(s.player.x - s.enemy.x);
        if (dist < 130) {
          const dmg = 35;
          s.enemy.hp = Math.max(0, s.enemy.hp - dmg);
          s.enemy.action = 'knockdown';
          s.enemy.actionTimer = 30;
          s.enemy.vx = s.player.facing * 12;
          sounds.playCritical();
          s.screenShake = 12;
          spawnParticles(s.enemy.x, s.enemy.y - 40, 25, '#EC4899');
          addFloater(s.enemy.x, s.enemy.y - 80, `CRITICAL! ${dmg}`, '#F43F5E');

          s.combo += 1;
          s.maxCombo = Math.max(s.maxCombo, s.combo);
          s.score += 200 * s.combo;
          s.player.shadowEnergy = Math.min(100, s.player.shadowEnergy + 25);
        }
      }
    }, 150);
  }, []);

  const handleKickAttack = useCallback(() => {
    const s = game.current;
    if (s.player.action === 'hurt' || s.player.action === 'knockdown' || s.player.action === 'shadow_ult') return;

    sounds.playSlash();
    s.player.action = 'kick';
    s.player.actionTimer = 20;
    s.player.vx = s.player.facing * 6;

    const dist = Math.abs(s.player.x - s.enemy.x);
    if (dist < 100 && s.enemy.hp > 0) {
      const dmg = 18;
      s.enemy.hp = Math.max(0, s.enemy.hp - dmg);
      s.enemy.action = 'knockdown';
      s.enemy.actionTimer = 25;
      s.enemy.vx = s.player.facing * 8;
      sounds.playHit();
      s.screenShake = 6;
      spawnParticles(s.enemy.x, s.enemy.y - 20, 15, '#A855F7');
      addFloater(s.enemy.x, s.enemy.y - 50, `SWEEP ${dmg}`, '#E9D5FF');

      s.combo += 1;
      s.maxCombo = Math.max(s.maxCombo, s.combo);
      s.score += 120 * s.combo;
      s.player.shadowEnergy = Math.min(100, s.player.shadowEnergy + 15);
    }
  }, []);

  const handleKunai = useCallback(() => {
    const s = game.current;
    if (s.player.action === 'hurt' || s.player.action === 'knockdown' || s.player.action === 'shadow_ult') return;

    s.player.action = 'kunai';
    s.player.actionTimer = 18;
    sounds.playSlash();

    s.projectiles.push({
      x: s.player.x + s.player.facing * 30,
      y: s.player.y - 45,
      vx: s.player.facing * 16,
      isPlayer: true,
      radius: 6,
      life: 60,
    });
  }, []);

  const handleShadowUltimate = useCallback(() => {
    const s = game.current;
    if (s.player.shadowEnergy < 100 || s.shadowUltimateActive) return;

    sounds.playVictory();
    s.player.shadowEnergy = 0;
    s.shadowUltimateActive = true;
    s.shadowUltimateTimer = 90;
    s.player.action = 'shadow_ult';
    s.player.actionTimer = 90;
    s.screenShake = 20;

    setAnnouncement('千刃一閃 — DIMENSION SLICE!');
    setTimeout(() => setAnnouncement(null), 1800);

    // Dimension rift attack
    s.enemy.action = 'hurt';
    s.enemy.actionTimer = 80;

    let hitCount = 0;
    const interval = setInterval(() => {
      if (hitCount >= 6) {
        clearInterval(interval);
        s.shadowUltimateActive = false;
        return;
      }
      hitCount++;
      sounds.playCritical();
      s.screenShake = 10;
      spawnParticles(s.enemy.x + (Math.random() * 40 - 20), s.enemy.y - 40, 20, '#C084FC');
      const dmg = 15;
      s.enemy.hp = Math.max(0, s.enemy.hp - dmg);
      addFloater(s.enemy.x, s.enemy.y - 60 - hitCount * 10, `SHADOW HIT ${dmg}!`, '#A855F7');
      s.score += 300;
    }, 120);
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || key === 'arrowleft') game.current.keys.left = true;
      if (key === 'd' || key === 'arrowright') game.current.keys.right = true;
      if (key === 'w' || key === 'arrowup' || key === ' ') game.current.keys.up = true;
      if (key === 's' || key === 'arrowdown') {
        game.current.keys.down = true;
        if (game.current.player.action === 'idle') game.current.player.action = 'block';
      }

      if (key === 'j' || key === 'z') handleLightAttack();
      if (key === 'k' || key === 'x') handleHeavyAttack();
      if (key === 'l' || key === 'c') handleKickAttack();
      if (key === 'i' || key === 'r') handleKunai();
      if (key === 'u' || key === 'v') handleShadowUltimate();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'a' || key === 'arrowleft') game.current.keys.left = false;
      if (key === 'd' || key === 'arrowright') game.current.keys.right = false;
      if (key === 'w' || key === 'arrowup' || key === ' ') game.current.keys.up = false;
      if (key === 's' || key === 'arrowdown') {
        game.current.keys.down = false;
        if (game.current.player.action === 'block') game.current.player.action = 'idle';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleLightAttack, handleHeavyAttack, handleKickAttack, handleKunai, handleShadowUltimate]);

  // Round progression helper
  const nextRound = (s: typeof game.current) => {
    s.round += 1;
    s.enemiesKilled += 1;
    s.player.hp = Math.min(100, s.player.hp + 40); // Restore partial HP
    s.player.x = 150;
    s.enemy.x = 650;
    s.enemy.hp = 100 + s.round * 25;
    s.enemy.maxHp = 100 + s.round * 25;

    if (s.round === 2) {
      s.enemy.name = 'Titan of AI Slop';
      s.enemy.type = 'titan';
    } else {
      s.enemy.name = 'Eclipse Ronin Grandmaster';
      s.enemy.type = 'shogun';
    }

    setBossName(s.enemy.name);
    setCurrentRound(s.round);
    setEnemyMaxHp(s.enemy.maxHp);
    setAnnouncement(`ROUND ${s.round} — ${s.enemy.name.toUpperCase()}!`);
    setTimeout(() => setAnnouncement(null), 1800);
  };

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let secondTimer = 0;

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const s = game.current;

      // Timer countdown
      secondTimer += dt;
      if (secondTimer >= 1) {
        secondTimer = 0;
        if (s.timeLeft > 0 && s.running) {
          s.timeLeft -= 1;
          setTimeLeft(s.timeLeft);
        }
      }

      // Check Game Over
      if ((s.timeLeft <= 0 || s.player.hp <= 0) && !s.gameOverTriggered) {
        s.gameOverTriggered = true;
        s.running = false;
        sounds.playGameOver();
        onGameOver(s.score, s.maxCombo, s.enemiesKilled, false);
      }

      // Check Enemy Defeated
      if (s.enemy.hp <= 0 && s.enemy.action !== 'knockdown' && !s.gameOverTriggered) {
        s.enemy.action = 'knockdown';
        s.enemy.actionTimer = 60;
        s.score += 1000 * s.round;
        sounds.playVictory();
        spawnParticles(s.enemy.x, s.enemy.y - 40, 50, '#F59E0B');

        if (s.round < 3) {
          setTimeout(() => nextRound(s), 1500);
        } else {
          s.gameOverTriggered = true;
          s.running = false;
          onGameOver(s.score, s.maxCombo, 3, true);
        }
      }

      // Update Player Movement & Physics
      if (s.player.action === 'idle' || s.player.action === 'run') {
        if (s.keys.left) {
          s.player.vx = -5;
          s.player.facing = -1;
          s.player.action = 'run';
        } else if (s.keys.right) {
          s.player.vx = 5;
          s.player.facing = 1;
          s.player.action = 'run';
        } else {
          s.player.vx *= 0.7;
          s.player.action = 'idle';
        }

        if (s.keys.up && s.player.isGrounded) {
          s.player.vy = -14;
          s.player.isGrounded = false;
          s.player.action = 'jump';
          sounds.playSwordSwish();
        }
      } else {
        s.player.vx *= 0.85;
      }

      // Gravity
      if (!s.player.isGrounded) {
        s.player.vy += 0.8;
      }

      s.player.x += s.player.vx;
      s.player.y += s.player.vy;

      // Ground Clamp (Y = 360)
      if (s.player.y >= 360) {
        s.player.y = 360;
        s.player.vy = 0;
        s.player.isGrounded = true;
        if (s.player.action === 'jump') s.player.action = 'idle';
      }

      // Screen boundaries
      s.player.x = Math.max(50, Math.min(750, s.player.x));

      // Action timers
      if (s.player.actionTimer > 0) {
        s.player.actionTimer -= 1;
        if (s.player.actionTimer === 0 && s.player.action !== 'block') {
          s.player.action = 'idle';
        }
      }

      if (s.player.comboWindow > 0) {
        s.player.comboWindow -= 1;
        if (s.player.comboWindow === 0) s.combo = 0;
      }

      // ENEMY AI BEHAVIOR
      if (s.enemy.hp > 0 && s.enemy.action !== 'knockdown' && s.enemy.action !== 'hurt') {
        const dist = s.player.x - s.enemy.x;
        s.enemy.facing = dist > 0 ? 1 : -1;

        if (s.enemy.aiCooldown > 0) {
          s.enemy.aiCooldown -= 1;
        } else {
          // AI Decision Making
          const absDist = Math.abs(dist);
          if (absDist > 140) {
            // Move towards player
            s.enemy.vx = s.enemy.facing * (s.enemy.type === 'shinobi' ? 4.5 : 2.8);
            s.enemy.action = 'run';
          } else if (absDist <= 140 && Math.random() < 0.4) {
            // Strike!
            const attackChoice = Math.random();
            if (attackChoice < 0.6) {
              s.enemy.action = 'attack_light';
              s.enemy.actionTimer = 20;
              s.enemy.aiCooldown = 45;
              sounds.playSlash();

              // Hit player
              setTimeout(() => {
                if (s.enemy.action === 'attack_light' && Math.abs(s.player.x - s.enemy.x) < 110) {
                  const isBlocked = s.player.action === 'block';
                  const dmg = isBlocked ? 3 : 15;
                  s.player.hp = Math.max(0, s.player.hp - dmg);
                  if (!isBlocked) {
                    s.player.action = 'hurt';
                    s.player.actionTimer = 14;
                    sounds.playHit();
                    s.screenShake = 6;
                    spawnParticles(s.player.x, s.player.y - 40, 10, '#EF4444');
                    addFloater(s.player.x, s.player.y - 60, `-${dmg}`, '#EF4444');
                  } else {
                    sounds.playBlock();
                    spawnParticles(s.player.x, s.player.y - 40, 6, '#3B82F6');
                    addFloater(s.player.x, s.player.y - 60, 'GUARDED', '#60A5FA');
                  }
                }
              }, 120);
            } else {
              s.enemy.action = 'attack_heavy';
              s.enemy.actionTimer = 28;
              s.enemy.aiCooldown = 60;
              sounds.playCritical();

              setTimeout(() => {
                if (s.enemy.action === 'attack_heavy' && Math.abs(s.player.x - s.enemy.x) < 130) {
                  const dmg = 25;
                  s.player.hp = Math.max(0, s.player.hp - dmg);
                  s.player.action = 'knockdown';
                  s.player.actionTimer = 26;
                  s.player.vx = s.enemy.facing * 10;
                  sounds.playHit();
                  s.screenShake = 12;
                  spawnParticles(s.player.x, s.player.y - 40, 20, '#EF4444');
                  addFloater(s.player.x, s.player.y - 70, `HEAVY HIT -${dmg}`, '#DC2626');
                }
              }, 200);
            }
          } else {
            // Block or back away
            s.enemy.action = Math.random() < 0.5 ? 'block' : 'idle';
            s.enemy.vx = -s.enemy.facing * 2;
            s.enemy.aiCooldown = 25;
          }
        }
      }

      s.enemy.x += s.enemy.vx;
      s.enemy.vx *= 0.85;
      s.enemy.x = Math.max(50, Math.min(750, s.enemy.x));

      if (s.enemy.actionTimer > 0) {
        s.enemy.actionTimer -= 1;
        if (s.enemy.actionTimer === 0) s.enemy.action = 'idle';
      }

      // Update Projectiles
      for (let i = s.projectiles.length - 1; i >= 0; i--) {
        const p = s.projectiles[i];
        p.x += p.vx;
        p.life -= 1;

        // Hit enemy
        if (p.isPlayer && Math.abs(p.x - s.enemy.x) < 30 && Math.abs(p.y - (s.enemy.y - 40)) < 40) {
          const dmg = 20;
          s.enemy.hp = Math.max(0, s.enemy.hp - dmg);
          s.enemy.action = 'hurt';
          s.enemy.actionTimer = 15;
          sounds.playHit();
          spawnParticles(p.x, p.y, 15, '#C084FC');
          addFloater(s.enemy.x, s.enemy.y - 60, `SHURIKEN ${dmg}`, '#E9D5FF');
          s.projectiles.splice(i, 1);
          continue;
        }

        if (p.life <= 0 || p.x < 0 || p.x > 800) {
          s.projectiles.splice(i, 1);
        }
      }

      // Update Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.life += 1;
        p.alpha = 1 - p.life / p.maxLife;
        if (p.life >= p.maxLife) {
          s.particles.splice(i, 1);
        }
      }

      // Update Floaters
      for (let i = s.floaters.length - 1; i >= 0; i--) {
        const f = s.floaters[i];
        f.y += f.vy;
        f.alpha -= 0.025;
        if (f.alpha <= 0) {
          s.floaters.splice(i, 1);
        }
      }

      // Push state to React state
      setPlayerHp(s.player.hp);
      setPlayerShadowEnergy(s.player.shadowEnergy);
      setEnemyHp(s.enemy.hp);
      setComboCount(s.combo);
      setScore(s.score);

      // ==========================================
      // CANVAS RENDERING (SHADOW FIGHT 2/3 STYLE)
      // ==========================================
      ctx.save();

      // Screen Shake
      if (s.screenShake > 0) {
        ctx.translate((Math.random() - 0.5) * s.screenShake, (Math.random() - 0.5) * s.screenShake);
        s.screenShake *= 0.85;
        if (s.screenShake < 0.5) s.screenShake = 0;
      }

      // 1. Atmospheric Dojo Background
      ctx.fillStyle = '#07070B';
      ctx.fillRect(0, 0, 800, 450);

      // Ambient Purple Cyber Fog & Moon
      const grad = ctx.createRadialGradient(400, 180, 20, 400, 180, 380);
      grad.addColorStop(0, 'rgba(147, 51, 234, 0.25)');
      grad.addColorStop(0.5, 'rgba(88, 28, 135, 0.12)');
      grad.addColorStop(1, 'rgba(7, 7, 11, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 450);

      // Distant Japanese Cyber Pagoda Silhouettes
      ctx.fillStyle = '#0D0D14';
      // Pagoda roof silhouettes in backdrop
      ctx.beginPath();
      ctx.moveTo(100, 260);
      ctx.lineTo(160, 230);
      ctx.lineTo(220, 260);
      ctx.lineTo(200, 360);
      ctx.lineTo(120, 360);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(580, 270);
      ctx.lineTo(640, 240);
      ctx.lineTo(700, 270);
      ctx.lineTo(680, 360);
      ctx.lineTo(600, 360);
      ctx.fill();

      // Ground Platform (Dojo Floor)
      ctx.fillStyle = '#12121B';
      ctx.fillRect(0, 360, 800, 90);
      ctx.strokeStyle = '#9333EA';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#9333EA';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, 360);
      ctx.lineTo(800, 360);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 2. Draw Projectiles (Glowing Kunai)
      for (const p of s.projectiles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.shadowColor = '#C084FC';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Kunai blade line
        ctx.strokeStyle = '#A855F7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-p.vx * 1.5, 0);
        ctx.lineTo(p.vx * 0.8, 0);
        ctx.stroke();
        ctx.restore();
      }

      // 3. DRAW PLAYER SILHOUETTE (SAMURAI HERO)
      ctx.save();
      ctx.translate(s.player.x, s.player.y);
      ctx.scale(s.player.facing, 1);

      // Shadow on floor
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 28, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Shadow Form Aura Wings
      if (s.shadowUltimateActive || s.player.shadowEnergy >= 100) {
        ctx.shadowColor = '#C084FC';
        ctx.shadowBlur = 25;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, -45, 38, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Body Silhouette
      ctx.fillStyle = '#050508';
      ctx.strokeStyle = '#2E1065';
      ctx.lineWidth = 1.5;

      // Torso & Armor
      ctx.beginPath();
      ctx.roundRect(-14, -60, 28, 35, 6);
      ctx.fill();
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(-8, -25);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-2, -25);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(4, -25);
      ctx.lineTo(10, 0);
      ctx.lineTo(16, 0);
      ctx.lineTo(8, -25);
      ctx.fill();

      // Head & Kabuto Helmet
      ctx.beginPath();
      ctx.arc(0, -72, 14, 0, Math.PI * 2);
      ctx.fill();

      // Helmet Horns / Crest
      ctx.beginPath();
      ctx.moveTo(-10, -82);
      ctx.lineTo(0, -92);
      ctx.lineTo(10, -82);
      ctx.lineTo(0, -85);
      ctx.fill();

      // Glowing Purple Eyes (Visor)
      ctx.shadowColor = '#C084FC';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#C084FC';
      ctx.fillRect(2, -74, 8, 3);
      ctx.shadowBlur = 0;

      // Glowing Scarf
      ctx.fillStyle = '#9333EA';
      ctx.beginPath();
      ctx.moveTo(-6, -65);
      ctx.lineTo(-22, -60 + Math.sin(time * 0.01) * 4);
      ctx.lineTo(-6, -58);
      ctx.fill();

      // Katana Blade (Luminous Neon Purple)
      ctx.shadowColor = '#C084FC';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = '#E9D5FF';
      ctx.lineWidth = 3;

      let bladeAngle = -0.4;
      let handX = 14;
      let handY = -45;

      if (s.player.action === 'light1') {
        bladeAngle = 0.5;
        handX = 22;
      } else if (s.player.action === 'light2') {
        bladeAngle = -1.2;
        handX = 20;
      } else if (s.player.action === 'light3') {
        bladeAngle = 1.4;
        handX = 26;
      } else if (s.player.action === 'heavy') {
        bladeAngle = 0.1;
        handX = 35;
      } else if (s.player.action === 'block') {
        bladeAngle = -1.5;
        handX = 10;
      }

      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.lineTo(handX + Math.cos(bladeAngle) * 55, handY + Math.sin(bladeAngle) * 55);
      ctx.stroke();

      // Katana Aura Edge
      ctx.strokeStyle = '#9333EA';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.lineTo(handX + Math.cos(bladeAngle) * 55, handY + Math.sin(bladeAngle) * 55);
      ctx.stroke();
      ctx.restore();

      // 4. DRAW ENEMY SILHOUETTE
      ctx.save();
      ctx.translate(s.enemy.x, s.enemy.y);
      ctx.scale(s.enemy.facing, 1);

      // Shadow on floor
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(0, 0, s.enemy.type === 'titan' ? 38 : 28, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Enemy Silhouette body
      ctx.fillStyle = '#050508';
      ctx.strokeStyle = '#450A0A';
      ctx.lineWidth = 1.5;

      const scaleMultiplier = s.enemy.type === 'titan' ? 1.25 : 1;

      // Torso
      ctx.beginPath();
      ctx.roundRect(-15 * scaleMultiplier, -60 * scaleMultiplier, 30 * scaleMultiplier, 35 * scaleMultiplier, 6);
      ctx.fill();
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.arc(0, -72 * scaleMultiplier, 14 * scaleMultiplier, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Crimson Eyes
      ctx.shadowColor = '#EF4444';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(2 * scaleMultiplier, -74 * scaleMultiplier, 8 * scaleMultiplier, 3);
      ctx.shadowBlur = 0;

      // Enemy Weapon (Dual daggers or heavy club or katana)
      ctx.shadowColor = '#EF4444';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#FCA5A5';
      ctx.lineWidth = s.enemy.type === 'titan' ? 6 : 3;

      let eBladeAngle = -0.3;
      if (s.enemy.action === 'attack_light') eBladeAngle = 0.6;
      if (s.enemy.action === 'attack_heavy') eBladeAngle = 1.2;

      ctx.beginPath();
      ctx.moveTo(14 * scaleMultiplier, -45 * scaleMultiplier);
      ctx.lineTo(
        (14 + Math.cos(eBladeAngle) * (s.enemy.type === 'titan' ? 65 : 45)) * scaleMultiplier,
        (-45 + Math.sin(eBladeAngle) * (s.enemy.type === 'titan' ? 65 : 45)) * scaleMultiplier
      );
      ctx.stroke();
      ctx.restore();

      // 5. Draw Particles
      for (const p of s.particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. Draw Floater Texts
      for (const f of s.floaters) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, f.alpha);
        ctx.font = 'bold 16px Oswald, sans-serif';
        ctx.fillStyle = f.color;
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 10;
        ctx.fillText(f.text, f.x, f.y);
        ctx.restore();
      }

      ctx.restore();

      if (s.running) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onGameOver]);

  return (
    <div className="bg-[#0B0B12] border border-[#9333EA]/40 rounded-3xl p-4 sm:p-6 relative select-none shadow-2xl overflow-hidden font-sans">
      {/* SHADOW FIGHT TOP FIGHTER HUD */}
      <div className="grid grid-cols-12 gap-3 sm:gap-6 items-center mb-4">
        {/* PLAYER SIDE */}
        <div className="col-span-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#1A112E] border border-[#9333EA] flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(147,51,234,0.4)]">
                🥷
              </div>
              <span className="text-xs sm:text-sm font-black font-heading tracking-wide uppercase text-white">
                VIKRANT (YOU)
              </span>
            </div>
            <span className="text-xs font-bold text-[#C084FC]">{playerHp}%</span>
          </div>

          {/* HP Bar */}
          <div className="w-full h-3.5 bg-[#171724] rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9333EA] via-[#A855F7] to-[#C084FC] transition-all duration-150 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
              style={{ width: `${Math.max(0, playerHp)}%` }}
            />
          </div>

          {/* Shadow Energy Bar */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[9px] font-bold text-[#C084FC] uppercase font-mono">SHADOW</span>
            <div className="flex-1 h-2 bg-[#12121A] rounded-full overflow-hidden border border-purple-500/20">
              <div
                className={`h-full transition-all duration-200 ${
                  playerShadowEnergy >= 100
                    ? 'bg-gradient-to-r from-[#F59E0B] via-[#EC4899] to-[#C084FC] animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]'
                    : 'bg-[#9333EA]'
                }`}
                style={{ width: `${playerShadowEnergy}%` }}
              />
            </div>
            {playerShadowEnergy >= 100 && (
              <span className="text-[9px] font-black text-amber-300 uppercase animate-bounce">
                READY (U)
              </span>
            )}
          </div>
        </div>

        {/* CENTER TIMER & ROUND INFO */}
        <div className="col-span-2 text-center flex flex-col items-center justify-center">
          <span className="text-[10px] font-black uppercase text-[#A1A1AA] tracking-widest">
            ROUND {currentRound}
          </span>
          <div className="text-2xl sm:text-3xl font-black font-heading text-white px-3 py-0.5 bg-[#141420] border border-white/10 rounded-xl shadow-lg">
            {timeLeft}s
          </div>
          {comboCount > 1 && (
            <span className="text-xs font-extrabold text-amber-400 animate-bounce mt-1 uppercase">
              {comboCount}× COMBO!
            </span>
          )}
        </div>

        {/* ENEMY SIDE */}
        <div className="col-span-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400">{Math.round((enemyHp / enemyMaxHp) * 100)}%</span>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black font-heading tracking-wide uppercase text-white">
                {bossName}
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-950/40 border border-rose-500/50 flex items-center justify-center text-xs font-bold text-rose-400">
                👹
              </div>
            </div>
          </div>

          {/* Enemy HP Bar */}
          <div className="w-full h-3.5 bg-[#171724] rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-l from-rose-600 via-rose-500 to-amber-400 transition-all duration-150 shadow-[0_0_12px_rgba(244,63,94,0.8)] ml-auto"
              style={{ width: `${Math.max(0, (enemyHp / enemyMaxHp) * 100)}%` }}
            />
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono text-zinc-400 uppercase">
              Score: <strong className="text-white font-heading text-xs">{score.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* CANVAS ARENA */}
      <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl bg-black">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-auto aspect-[16/9] block"
        />

        {/* Announcement Banner Overlay */}
        {announcement && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="px-8 py-3 bg-[#08080C]/90 border-y-2 border-[#9333EA] text-2xl sm:text-4xl font-black font-heading uppercase text-white tracking-widest shadow-[0_0_40px_rgba(147,51,234,0.8)] animate-in zoom-in-90 duration-200">
              {announcement}
            </div>
          </div>
        )}
      </div>

      {/* ARCADE CONTROLS FOR TOUCH / LAPTOP CLICKS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 items-center">
        {/* Left: Directional Controls */}
        <div className="md:col-span-4 flex items-center justify-center gap-2">
          <button
            onMouseDown={() => { game.current.keys.left = true; }}
            onMouseUp={() => { game.current.keys.left = false; }}
            onTouchStart={() => { game.current.keys.left = true; }}
            onTouchEnd={() => { game.current.keys.left = false; }}
            className="w-14 h-12 rounded-2xl bg-[#141420] hover:bg-[#1E1E30] border border-white/10 active:border-[#9333EA] text-white font-bold text-xs flex flex-col items-center justify-center active:scale-95 transition"
          >
            <span>◀</span>
            <span className="text-[9px] text-[#A1A1AA]">A</span>
          </button>

          <button
            onClick={() => {
              if (game.current.player.isGrounded) {
                game.current.player.vy = -14;
                game.current.player.isGrounded = false;
                sounds.playSwordSwish();
              }
            }}
            className="w-14 h-12 rounded-2xl bg-[#141420] hover:bg-[#1E1E30] border border-white/10 active:border-[#9333EA] text-white font-bold text-xs flex flex-col items-center justify-center active:scale-95 transition"
          >
            <span>▲ JUMP</span>
            <span className="text-[9px] text-[#A1A1AA]">SPACE</span>
          </button>

          <button
            onMouseDown={() => { game.current.keys.right = true; }}
            onMouseUp={() => { game.current.keys.right = false; }}
            onTouchStart={() => { game.current.keys.right = true; }}
            onTouchEnd={() => { game.current.keys.right = false; }}
            className="w-14 h-12 rounded-2xl bg-[#141420] hover:bg-[#1E1E30] border border-white/10 active:border-[#9333EA] text-white font-bold text-xs flex flex-col items-center justify-center active:scale-95 transition"
          >
            <span>▶</span>
            <span className="text-[9px] text-[#A1A1AA]">D</span>
          </button>
        </div>

        {/* Right: Combat Buttons */}
        <div className="md:col-span-8 flex flex-wrap items-center justify-center md:justify-end gap-2">
          {/* Light Strike */}
          <button
            onClick={handleLightAttack}
            className="px-4 py-2.5 rounded-xl bg-[#1C152E] hover:bg-[#2A1F45] border border-[#9333EA]/60 text-white font-black text-xs uppercase flex items-center gap-1.5 active:scale-95 transition shadow-md shadow-[#9333EA]/20"
          >
            <span>⚔️ SLASH</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-[#C084FC]">J</span>
          </button>

          {/* Heavy Thrust */}
          <button
            onClick={handleHeavyAttack}
            className="px-4 py-2.5 rounded-xl bg-[#2E1025] hover:bg-[#421735] border border-pink-500/60 text-white font-black text-xs uppercase flex items-center gap-1.5 active:scale-95 transition shadow-md shadow-pink-500/20"
          >
            <span>💥 HEAVY</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-pink-300">K</span>
          </button>

          {/* Sweep Kick */}
          <button
            onClick={handleKickAttack}
            className="px-4 py-2.5 rounded-xl bg-[#171724] hover:bg-[#222235] border border-white/10 text-white font-bold text-xs uppercase flex items-center gap-1.5 active:scale-95 transition"
          >
            <span>🦵 SWEEP</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-zinc-400">L</span>
          </button>

          {/* Shuriken */}
          <button
            onClick={handleKunai}
            className="px-3.5 py-2.5 rounded-xl bg-[#141420] hover:bg-[#1E1E30] border border-white/10 text-white font-bold text-xs uppercase flex items-center gap-1.5 active:scale-95 transition"
          >
            <span>🎯 KUNAI</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-zinc-400">I</span>
          </button>

          {/* Shadow Ultimate */}
          <button
            onClick={handleShadowUltimate}
            disabled={playerShadowEnergy < 100}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 active:scale-95 transition shadow-lg ${
              playerShadowEnergy >= 100
                ? 'bg-gradient-to-r from-[#9333EA] via-[#EC4899] to-[#F59E0B] text-white shadow-[0_0_20px_rgba(236,72,153,0.6)] animate-pulse cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 border border-white/5 opacity-50 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SHADOW SLICE</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-white">U</span>
          </button>
        </div>
      </div>
    </div>
  );
};
