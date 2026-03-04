"use client";
import React, { useEffect, useRef } from 'react';

const MathVisualizations = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Lorenz Attractor variables
    let x = 0.1, y = 0, z = 0;
    const a = 10, b = 28, c = 8 / 3;
    const dt = 0.01;
    const points: { x: number, y: number, z: number }[] = [];
    const maxPoints = 500;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const drawGrid = () => {
      const step = 50;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.03)'; // Very subtle amber
      ctx.lineWidth = 1;

      // Vertical lines
      for (let i = 0; i < canvas.width; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = 0; i < canvas.height; i += step) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Origin indicators
      ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
      for (let i = 0; i < canvas.width; i += step * 5) {
        for (let j = 0; j < canvas.height; j += step * 5) {
          ctx.beginPath();
          ctx.arc(i, j, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const updateLorenz = () => {
      const dx = a * (y - x) * dt;
      const dy = (x * (b - z) - y) * dt;
      const dz = (x * y - c * z) * dt;
      x += dx;
      y += dy;
      z += dz;

      points.push({ x, y, z });
      if (points.length > maxPoints) {
        points.shift();
      }
    };

    const drawLorenz = () => {
      if (points.length < 2) return;

      ctx.save();
      // Position it in a corner or center subtly
      ctx.translate(canvas.width * 0.8, canvas.height * 0.7);
      ctx.scale(7, 7);
      ctx.rotate(time * 0.1);

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.1)';
      ctx.lineWidth = 0.2;

      for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.stroke();
      ctx.restore();
    };

    const drawFibonacci = () => {
      ctx.save();
      ctx.translate(canvas.width * 0.2, canvas.height * 0.3);
      ctx.rotate(time * 0.05);
      
      let a = 0, b = 1, temp;
      let angle = 0;
      const scale = 2;

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let i = 0; i < 12; i++) {
        const radius = b * scale;
        ctx.arc(0, 0, radius, angle, angle + Math.PI / 2);
        
        temp = a;
        a = b;
        b = temp + b;
        
        // Move to next center
        const move = a * scale;
        ctx.translate(move, 0);
        ctx.rotate(Math.PI / 2);
        angle = 0;
      }
      ctx.stroke();
      ctx.restore();
    };

    const drawSineWave = () => {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.05)';
      ctx.lineWidth = 1;
      
      const amplitude = 20;
      const frequency = 0.01;
      const centerY = canvas.height * 0.9;
      
      ctx.moveTo(0, centerY);
      for (let x = 0; x < canvas.width; x++) {
        const y = centerY + Math.sin(x * frequency + time) * amplitude;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };

    const drawGeometricPulse = () => {
      ctx.save();
      ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
      
      const radius = (Math.sin(time * 0.5) + 1) * 100 + 50;
      const opacity = (Math.cos(time * 0.5) + 1) * 0.02;
      
      ctx.beginPath();
      ctx.strokeStyle = `rgba(245, 158, 11, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6 + time * 0.2;
        const hx = Math.cos(angle) * (radius * 0.8);
        const hy = Math.sin(angle) * (radius * 0.8);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.01;

      drawGrid();
      updateLorenz();
      drawLorenz();
      drawFibonacci();
      drawSineWave();
      drawGeometricPulse();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-20"
    />
  );
};

export default MathVisualizations;
