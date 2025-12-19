import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: 'heart' | 'star' | 'dot';
  alpha: number;
  targetAlpha: number;
  angle: number;
  angularVelocity: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const animationRef = useRef<number>();

  const colors = [
    'hsla(344, 52%, 77%, ', // Rose gold
    'hsla(20, 100%, 88%, ', // Peach
    'hsla(43, 74%, 52%, ',  // Gold
    'hsla(30, 50%, 96%, ',  // Cream
  ];

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const types: ('heart' | 'star' | 'dot')[] = ['heart', 'star', 'dot', 'dot', 'dot'];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: types[Math.floor(Math.random() * types.length)],
      alpha: Math.random() * 0.5 + 0.2,
      targetAlpha: Math.random() * 0.5 + 0.2,
      angle: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 0.02,
    };
  }, []);

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.fill();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const innerAngle = outerAngle + Math.PI / 5;
      if (i === 0) {
        ctx.moveTo(Math.cos(outerAngle) * size, Math.sin(outerAngle) * size);
      } else {
        ctx.lineTo(Math.cos(outerAngle) * size, Math.sin(outerAngle) * size);
      }
      ctx.lineTo(Math.cos(innerAngle) * size * 0.4, Math.sin(innerAngle) * size * 0.4);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Initialize particles
    const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 8000));
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Mouse interaction - magnetic attraction with gentle repulsion
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 200;

          if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * 0.02;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
            particle.targetAlpha = Math.min(1, particle.alpha + 0.3);
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.angle += particle.angularVelocity;

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Alpha transition
        particle.alpha += (particle.targetAlpha - particle.alpha) * 0.05;
        particle.targetAlpha = Math.random() * 0.5 + 0.2;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.fillStyle = particle.color + particle.alpha + ')';

        if (particle.type === 'heart') {
          drawHeart(ctx, particle.x, particle.y, particle.size);
        } else if (particle.type === 'star') {
          drawStar(ctx, particle.x, particle.y, particle.size, particle.angle);
        } else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{ background: 'transparent' }}
    />
  );
};

export default ParticleBackground;
