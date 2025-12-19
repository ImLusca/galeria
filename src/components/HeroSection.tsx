import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  delay: number;
}

const HeroSection: React.FC = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [nebulaClicked, setNebulaClicked] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const nebulaRef = useRef<HTMLDivElement>(null);

  const anniversaryDate = new Date("2025-10-19T23:10:00");

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date();
      const diff = now.getTime() - anniversaryDate.getTime();

      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const totalMinutes = Math.floor(diff / (1000 * 60));

      setDays(totalDays);
      setHours(totalHours);
      setMinutes(totalMinutes);
    };

    updateCounter();
    const interval = setInterval(updateCounter, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-cosmic pointer-events-none" />

      <AnimatePresence>
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              x: "50vw",
              y: "50vh",
              rotate: 0,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: `calc(50vw + ${piece.x}vw)`,
              y: `calc(50vh + ${piece.y + 150}vh)`,
              rotate: piece.rotation,
              scale: piece.scale,
              opacity: 0,
            }}
            transition={{
              duration: 3,
              delay: piece.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="fixed pointer-events-none z-50"
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: piece.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
          />
        ))}
      </AnimatePresence>

      <div className="content-layer text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-night-foreground mb-6 leading-tight"
        >
          Nossa galeria particular
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-12"
        >
          <p className="font-sans text-xl md:text-2xl text-night-foreground/80 mb-4">
            Uma jornada com coração no chão
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="text-center">
              <span className="font-serif text-4xl md:text-5xl text-accent font-semibold">
                {days.toLocaleString()}
              </span>
              <p className="text-night-foreground/60 text-sm mt-1">dias</p>
            </div>
            <div className="text-center">
              <span className="font-serif text-4xl md:text-5xl text-primary font-semibold">
                {hours.toLocaleString()}
              </span>
              <p className="text-night-foreground/60 text-sm mt-1">horas</p>
            </div>
            <div className="text-center">
              <span className="font-serif text-4xl md:text-5xl text-secondary font-semibold">
                {minutes.toLocaleString()}
              </span>
              <p className="text-night-foreground/60 text-sm mt-1">minutos</p>
            </div>
          </div>
          <p className="text-night-foreground/50 text-sm mt-4 font-sans">
            ...de nós dois juntos
          </p>
        </motion.div>

        <motion.div
          ref={nebulaRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="relative cursor-pointer group mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className={`
            relative w-48 h-48 md:w-64 md:h-64 rounded-full mx-auto
            ${nebulaClicked ? "opacity-0" : "animate-nebula-pulse"}
            transition-all duration-500
          `}
          >
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl" />
            <div className="absolute inset-4 rounded-full bg-secondary/40 blur-xl" />
            <div className="absolute inset-8 rounded-full bg-accent/30 blur-lg" />
            <div className="absolute inset-12 rounded-full bg-primary/50 blur-md animate-glow-pulse" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-night-foreground/90 blur-sm" />
            </div>
          </div>
        </motion.div>
      </div>

      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-night-foreground/30 rounded-full animate-star-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </section>
  );
};

export default HeroSection;
