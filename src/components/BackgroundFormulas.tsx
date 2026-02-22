"use client";
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useScroll, useTransform } from 'motion/react';

const integrationFormulas = [
  "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
  "∫ eˣ dx = eˣ + C",
  "∫ 1/x dx = ln|x| + C",
  "∫ sin x dx = -cos x + C",
  "∫ cos x dx = sin x + C",
  "∫ sec² x dx = tan x + C",
  "∫ 1/(1+x²) dx = arctan x + C",
  "∫ ln x dx = x ln x - x + C",
  "∫ 1/√(1-x²) dx = arcsin x + C",
  "∫ u dv = uv - ∫ v du",
  "∫ tan x dx = ln|sec x| + C",
  "∫ cot x dx = ln|sin x| + C",
  "∫ sec x dx = ln|sec x + tan x| + C",
  "∫ csc x dx = ln|csc x - cot x| + C",
  "∫ aˣ dx = aˣ/ln a + C",
  "∫ 1/√(a²-x²) dx = arcsin(x/a) + C",
  "∫ 1/(a²+x²) dx = (1/a)arctan(x/a) + C",
  "∫ sinh x dx = cosh x + C",
  "∫ cosh x dx = sinh x + C"
];

const FormulaElement = ({ el, smoothX, smoothY, scrollY }: { el: any, smoothX: any, smoothY: any, scrollY: any }) => {
  // Calculate scroll parallax based on element size (depth)
  const scrollOffset = useTransform(scrollY, [0, 1000], [0, el.size * -100]);
  
  // Combine mouse and scroll parallax
  const x = useTransform(smoothX, (val: number) => val * (el.size * 20));
  const y = useTransform([smoothY, scrollOffset], ([mY, sO]: any) => mY * (el.size * 20) + sO);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${el.x}%`,
        top: `${el.y}%`,
        fontSize: `${el.size}rem`,
        rotate: el.rotate,
        x,
        y,
        opacity: 0.08,
        color: '#F59E0B',
        fontFamily: 'var(--font-handwritten), cursive',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        willChange: 'transform',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.08 }}
      transition={{ duration: 2 }}
    >
      {el.text}
    </motion.div>
  );
};

const BubbleFormula = ({ text, delay }: { text: string, delay: number }) => {
  const [pos] = useState({
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    scale: Math.random() * 0.4 + 0.7
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0.05, 0.05, 0.5, 0.05, 0.05],
        scale: [pos.scale, pos.scale * 1.1, pos.scale],
        y: [0, -40, 0],
        x: [0, 20, 0]
      }}
      transition={{ 
        duration: 10 + Math.random() * 5, 
        delay, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      style={{
        left: `${pos.x}vw`,
        top: `${pos.y}vh`,
        fontFamily: 'var(--font-handwritten), cursive',
        willChange: 'transform, opacity',
      }}
      className="fixed pointer-events-none text-amber-400 text-2xl whitespace-nowrap z-[-5] drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
    >
      {text}
    </motion.div>
  );
};

const BackgroundFormulas = () => {
  const [elements, setElements] = useState<{ id: number, text: string, x: number, y: number, size: number, rotate: number }[]>([]);
  const [showIntegrations, setShowIntegrations] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollY } = useScroll();

  // Smooth out mouse movement
  const springConfig = { damping: 40, stiffness: 80 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const newElements = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      text: integrationFormulas[Math.floor(Math.random() * integrationFormulas.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.2 + 1.0,
      rotate: Math.random() * 30 - 15,
    }));
    setElements(newElements);

    const timer = setTimeout(() => setShowIntegrations(true), 1500);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_80%)]" />
      
      {elements.map((el) => (
        <FormulaElement 
          key={el.id} 
          el={el} 
          smoothX={smoothX} 
          smoothY={smoothY} 
          scrollY={scrollY} 
        />
      ))}

      {showIntegrations && integrationFormulas.map((formula, i) => (
        <BubbleFormula key={i} text={formula} delay={i * 2} />
      ))}

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-500 rounded-full blur-sm animate-pulse" />
        <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-amber-400 rounded-full blur-sm animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/10 w-1 h-1 bg-amber-600 rounded-full blur-sm animate-pulse delay-1000" />
      </div>
    </div>
  );
};

export default BackgroundFormulas;
