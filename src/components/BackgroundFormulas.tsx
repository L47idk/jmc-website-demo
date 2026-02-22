"use client";
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useScroll, useTransform } from 'motion/react';

const formulas = [
  "e^{i\\pi} + 1 = 0",
  "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}",
  "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}",
  "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}",
  "i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi",
  "R_{\\mu\\nu} - \\frac{1}{2}Rg_{\\mu\\nu} = 8\\pi G T_{\\mu\\nu}",
  "a^2 + b^2 = c^2",
  "E = mc^2",
  "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n",
  "\\zeta(s) = \\sum_{n=1}^{\\infty} n^{-s}",
  "\\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I",
  "\\frac{d}{dx}\\ln(x) = \\frac{1}{x}",
  "\\sin^2\\theta + \\cos^2\\theta = 1",
  "P(A|B) = \\frac{P(B|A)P(A)}{P(B)}",
  "\\mathbf{F} = m\\mathbf{a}",
  "\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}"
];

const integrationFormulas = [
  "\\int x^n dx = \\frac{x^{n+1}}{n+1} + C",
  "\\int e^x dx = e^x + C",
  "\\int \\frac{1}{x} dx = \\ln|x| + C",
  "\\int \\sin x dx = -\\cos x + C",
  "\\int \\cos x dx = \\sin x + C",
  "\\int \\sec^2 x dx = \\tan x + C",
  "\\int \\frac{1}{1+x^2} dx = \\arctan x + C",
  "\\int \\ln x dx = x \\ln x - x + C",
  "\\int \\frac{1}{\\sqrt{1-x^2}} dx = \\arcsin x + C",
  "\\int udv = uv - \\int vdu"
];

const FormulaElement = ({ el, smoothX, smoothY, scrollY }: { el: any, smoothX: any, smoothY: any, scrollY: any }) => {
  // Calculate scroll parallax based on element size (depth)
  const scrollOffset = useTransform(scrollY, [0, 1000], [0, el.size * -150]);
  
  // Combine mouse and scroll parallax
  const x = useTransform(smoothX, (val: number) => val * (el.size * 30));
  const y = useTransform([smoothY, scrollOffset], ([mY, sO]: any) => mY * (el.size * 30) + sO);

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
        opacity: 0.04,
        color: '#F59E0B',
        fontFamily: 'serif',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.04 }}
      transition={{ duration: 2 }}
    >
      {el.text}
    </motion.div>
  );
};

const ScrollingFormula = ({ text, delay }: { text: string, delay: number }) => (
  <motion.div
    initial={{ y: '110vh', opacity: 0, x: `${Math.random() * 80 + 10}vw` }}
    animate={{ y: '-20vh', opacity: [0, 0.1, 0.1, 0] }}
    transition={{ 
      duration: 15, 
      delay, 
      repeat: Infinity, 
      ease: "linear" 
    }}
    className="fixed pointer-events-none text-amber-500/20 font-serif text-lg whitespace-nowrap z-[-5]"
  >
    {text}
  </motion.div>
);

const BackgroundFormulas = () => {
  const [elements, setElements] = useState<{ id: number, text: string, x: number, y: number, size: number, rotate: number }[]>([]);
  const [showIntegrations, setShowIntegrations] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollY } = useScroll();

  // Smooth out mouse movement
  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const newElements = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      text: formulas[Math.floor(Math.random() * formulas.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.2 + 0.6,
      rotate: Math.random() * 40 - 20,
    }));
    setElements(newElements);

    const timer = setTimeout(() => setShowIntegrations(true), 3000);

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
        <ScrollingFormula key={i} text={formula} delay={i * 3} />
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
