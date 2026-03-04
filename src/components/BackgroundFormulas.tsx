"use client";
import React, { useEffect, useRef } from 'react';

const formulas = [
  "∫ e^x dx = e^x + C",
  "∫ 1/x dx = ln|x| + C",
  "Σ n=1 to ∞ 1/n² = π²/6",
  "e^iπ + 1 = 0",
  "∫ x^n dx = x^(n+1)/(n+1)",
  "√(-1) = i",
  "d/dx sin(x) = cos(x)",
  "lim n→∞ (1+1/n)^n = e",
  "∇ × E = -∂B/∂t",
  "∮ B · dl = μ₀I",
  "∫ u dv = uv - ∫ v du",
  "∫ 1/(1+x²) dx = arctan x + C",
  "∫ sin x dx = -cos x + C",
  "∫ cos x dx = sin x + C",
  "∫ aˣ dx = aˣ/ln a + C"
];

class Formula {
  text: string;
  x: number;
  y: number;
  opacity: number;
  targetOpacity: number;
  fadeSpeed: number;
  fontSize: number;
  rotation: number;
  state: 'hidden' | 'fading-in' | 'visible' | 'fading-out';
  timer: number;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.text = formulas[Math.floor(Math.random() * formulas.length)];
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.opacity = 0;
    this.targetOpacity = 0;
    this.fadeSpeed = 0.003 + Math.random() * 0.007;
    this.fontSize = 60 + Math.random() * 80; // Large size as requested before
    this.rotation = (Math.random() - 0.5) * 0.15;
    this.state = 'hidden';
    this.timer = 0;
    this.width = 0;
    this.height = 0;
  }

  calculateBounds(ctx: CanvasRenderingContext2D) {
    ctx.font = `${this.fontSize}px var(--font-handwritten), cursive`;
    const metrics = ctx.measureText(this.text);
    this.width = metrics.width;
    this.height = this.fontSize;
  }

  checkOverlap(others: Formula[]) {
    const margin = 30;
    for (const other of others) {
      if (other === this || other.state === 'hidden') continue;
      
      const thisRect = {
        left: this.x,
        right: this.x + this.width,
        top: this.y - this.height,
        bottom: this.y
      };
      
      const otherRect = {
        left: other.x - margin,
        right: other.x + other.width + margin,
        top: other.y - other.height - margin,
        bottom: other.y + margin
      };

      if (!(thisRect.left > otherRect.right || 
            thisRect.right < otherRect.left || 
            thisRect.top > otherRect.bottom || 
            thisRect.bottom < otherRect.top)) {
        return true;
      }
    }
    return false;
  }

  update(width: number, height: number, others: Formula[], ctx: CanvasRenderingContext2D) {
    if (this.state === 'hidden') {
      if (Math.random() < 0.002) {
        for (let attempt = 0; attempt < 15; attempt++) {
          this.x = Math.random() * (width - this.width - 100) + 50;
          this.y = Math.random() * (height - 150) + 100;
          this.calculateBounds(ctx);
          if (!this.checkOverlap(others)) {
            this.state = 'fading-in';
            this.targetOpacity = 0.25 + Math.random() * 0.25;
            break;
          }
        }
      }
    } else if (this.state === 'fading-in') {
      this.opacity += this.fadeSpeed;
      if (this.opacity >= this.targetOpacity) {
        this.opacity = this.targetOpacity;
        this.state = 'visible';
        this.timer = 150 + Math.random() * 400;
      }
    } else if (this.state === 'visible') {
      this.timer--;
      if (this.timer <= 0) {
        this.state = 'fading-out';
      }
    } else if (this.state === 'fading-out') {
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0) {
        this.opacity = 0;
        this.state = 'hidden';
        this.text = formulas[Math.floor(Math.random() * formulas.length)];
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.opacity <= 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#F59E0B'; // Amber-500
    ctx.font = `${this.fontSize}px var(--font-handwritten), cursive`;
    
    // Add glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
    
    ctx.fillText(this.text, 0, 0);
    ctx.restore();
  }
}

const BackgroundFormulas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let formulaObjects: Formula[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Create a pool of formulas
      formulaObjects = Array.from({ length: 20 }).map(() => new Formula(canvas.width, canvas.height));
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-init positions on resize
      formulaObjects.forEach(f => {
        f.x = Math.random() * canvas.width;
        f.y = Math.random() * canvas.height;
      });
    };

    window.addEventListener('resize', handleResize);
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      formulaObjects.forEach(f => {
        f.update(canvas.width, canvas.height, formulaObjects, ctx);
        f.draw(ctx);
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
      className="fixed inset-0 pointer-events-none -z-10"
    />
  );
};

export default BackgroundFormulas;
