"use client";
import React from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { Calculator, Trophy, Lightbulb, Heart } from 'lucide-react';

const Typewriter = ({ text, delay = 20 }: { text: string; delay?: number }) => {
  const [currentText, setCurrentText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

const About = () => {
  const { content, loading } = useContent();

  if (loading) return null;

  const aboutContent = content.about || {
    title: "What is JMC?",
    description: "The Josephite Math Club is dedicated to cultivating a passion for mathematics. Our mission is to provide a supportive environment for students to explore mathematical concepts, participate in competitions, and engage in math-related events. Join us to experience the world of mathematics in a whole new way!",
    mission: ""
  };

  const stats = [
    { number: "10+", label: "Years of Excellence" },
    { number: "100+", label: "Workshops Conducted" },
    { number: "6", label: "National Festivals" },
    { number: "20k+", label: "Students Impacted" },
  ];

  const objectives = [
    {
      title: "Problem Solving",
      description: "Develop your math skills through challenging problems and real-world applications. Build critical thinking and problem-solving abilities.",
      icon: <Calculator className="w-8 h-8" />,
      color: "text-purple-400"
    },
    {
      title: "Olympiad Preparation",
      description: "Preparing for math Olympiads helps you think outside the box and tackle advanced problems with confidence.",
      icon: <Trophy className="w-8 h-8" />,
      color: "text-amber-400"
    },
    {
      title: "Creativity",
      description: "Learn how creativity fuels problem-solving. Apply mathematical thinking in innovative ways.",
      icon: <Lightbulb className="w-8 h-8" />,
      color: "text-emerald-400"
    },
    {
      title: "Love for Math",
      description: "Embrace your passion for mathematics and explore its beauty in a supportive environment.",
      icon: <Heart className="w-8 h-8" />,
      color: "text-rose-400"
    }
  ];

  return (
    <div className="min-h-screen relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* What is JMC Section */}
        <section className="text-center mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold text-white mb-12 font-display tracking-widest uppercase"
          >
            {aboutContent.title.split(' ').map((word: string, i: number) => (
              <span key={i} className={i === 2 ? "gold-text mr-4" : "mr-4"}>{word}</span>
            ))}
          </motion.h2>
          
          <div className="text-zinc-400 max-w-4xl mx-auto text-lg md:text-xl leading-relaxed mb-16 font-light min-h-[120px]">
            <Typewriter text={aboutContent.description} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 flex flex-col items-center justify-center glowing-border transition-all group"
              >
                <span className="text-5xl font-bold text-white mb-4 font-display group-hover:scale-110 transition-transform duration-500">
                  {stat.number}
                </span>
                <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider text-center">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Our Objectives Section */}
        <section className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-20 font-display tracking-widest uppercase"
          >
            Our <span className="gold-text">Objectives</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {objectives.map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="moving-border-container"
              >
                <div className="moving-border-content p-10 flex flex-col items-center text-center group relative overflow-hidden">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className={`mb-8 p-4 rounded-2xl bg-white/5 ${obj.color} group-hover:scale-110 transition-transform duration-500`}>
                    {obj.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-6 font-display border-b border-white/10 pb-4 w-full">
                    {obj.title}
                  </h3>
                  
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">
                    {obj.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
