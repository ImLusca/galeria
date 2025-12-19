import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Footer: React.FC = () => {
  const [rocketLaunched, setRocketLaunched] = useState(false);

  const launchRocket = () => {
    if (rocketLaunched) return;
    setRocketLaunched(true);

    setTimeout(() => {
      setRocketLaunched(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2500);
  };

  return (
    <footer className="relative py-20 md:py-32 bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-night-foreground/40 rounded-full animate-star-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Main message */}
          <h2 className="font-serif text-4xl md:text-6xl text-night-foreground mb-6 leading-tight">
            Fico imaginando
            <br />{" "}
            <span className="text-gradient-rose">nossas próximas memórias</span>
          </h2>

          {/* Rocket button */}
          <motion.button
            onClick={launchRocket}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-foreground font-sans font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <span className="relative z-10">
              {rocketLaunched ? "Decolando! 🚀" : "Voltar ao Início 🚀"}
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <p className="font-serif text-2xl md:text-3xl text-night-foreground/80 italic">
              "Eu te amo infinitamente"
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-2xl"
              >
                💕
              </motion.span>
            </div>
          </motion.div>

          <div className="mt-16 pt-8 border-t border-night-foreground/10">
            <p className="font-sans text-sm text-night-foreground/50">
              Feito com muito amor • By Lusca
            </p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {rocketLaunched && (
          <>
            {/* Rocket */}
            <motion.div
              initial={{
                x: "50%",
                y: "100%",
                rotate: -45,
                scale: 1,
              }}
              animate={{
                y: "-150%",
                scale: [1, 1.2, 0.8],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                ease: [0.45, 0, 0.55, 1],
              }}
              className="fixed left-1/2 bottom-0 -translate-x-1/2 z-50 text-6xl pointer-events-none"
            >
              🚀
            </motion.div>

            {/* Rocket trail particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: `calc(50% + ${(Math.random() - 0.5) * 100}px)`,
                  y: "100%",
                  opacity: 1,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: `${-50 - Math.random() * 50}%`,
                  opacity: 0,
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
                className="fixed left-0 pointer-events-none"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: `hsl(${Math.random() * 60 + 20}, 80%, 60%)`,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
