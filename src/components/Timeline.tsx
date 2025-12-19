import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  icon: string;
  orbitIcons: string[];
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    date: 'O Começo',
    title: 'O Primeiro Encontro',
    description: 'O dia em que nossos mundos colidiram e as estrelas se alinharam. Um sorriso, uma conexão, e o começo de tudo.',
    icon: '💫',
    orbitIcons: ['✨', '🌟', '💕'],
  },
  {
    id: 2,
    date: 'Descobertas',
    title: 'Ana Vitória no Som',
    description: 'Quando descobrimos que compartilhamos o mesmo gosto musical. Ana Vitória virou a trilha sonora do nosso amor.',
    icon: '🎵',
    orbitIcons: ['🎸', '🎤', '💜'],
  },
  {
    id: 3,
    date: 'Tardes Douradas',
    title: 'Piqueniques ao Pôr do Sol',
    description: 'Aquelas tardes mágicas vendo o sol se pôr juntos. Uma toalha, lanches, e muito amor sob o céu alaranjado.',
    icon: '🌅',
    orbitIcons: ['🧺', '🍓', '☀️'],
  },
  {
    id: 4,
    date: 'Momentos Doces',
    title: 'Petit Gâteau',
    description: 'Nossa sobremesa favorita que virou tradição. Chocolate derretendo, assim como nossos corações um pelo outro.',
    icon: '🍫',
    orbitIcons: ['🍰', '🍨', '❤️'],
  },
  {
    id: 5,
    date: 'Presente Especial',
    title: 'GT R34 de Lego',
    description: 'O presente que simboliza nosso carinho pelos detalhes. Peça por peça, construímos memórias juntos.',
    icon: '🚗',
    orbitIcons: ['🧱', '🏎️', '🎁'],
  },
  {
    id: 6,
    date: 'Dezembro',
    title: 'Operação Natal',
    description: 'Nossa missão especial de fim de ano. Luzes, magia e muito amor espalhado em cada detalhe natalino.',
    icon: '🎄',
    orbitIcons: ['🎅', '❄️', '⭐'],
  },
  {
    id: 7,
    date: 'Sempre',
    title: 'Nosso Universo',
    description: 'Cada momento juntos é uma nova estrela no céu do nosso amor. Que venham infinitos mais.',
    icon: '💍',
    orbitIcons: ['🌙', '💎', '🔥'],
  },
];

const TimelineItem: React.FC<{ event: TimelineEvent; index: number }> = ({ event, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8`}
    >
      {/* Content Card */}
      <div className={`w-full md:w-5/12 ${isEven ? 'md:text-right' : 'md:text-left'} text-center`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-lg"
        >
          <span className="text-sm font-sans text-primary font-medium">{event.date}</span>
          <h3 className="font-serif text-2xl text-foreground mt-2 mb-3">{event.title}</h3>
          <p className="font-sans text-muted-foreground leading-relaxed">{event.description}</p>
        </motion.div>
      </div>

      {/* Center Point */}
      <div className="relative my-6 md:my-0">
        <motion.div
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative w-20 h-20 flex items-center justify-center cursor-pointer"
        >
          {/* Planet/Star */}
          <motion.div
            animate={isInView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-glow-pulse"
          >
            <span className="text-2xl">{event.icon}</span>
          </motion.div>

          {/* Orbiting Icons */}
          {event.orbitIcons.map((icon, i) => (
            <motion.div
              key={i}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.5
              }}
              className="absolute text-lg animate-orbit"
              style={{ 
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${6 + i * 2}s`
              }}
            >
              {icon}
            </motion.div>
          ))}

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        </motion.div>
      </div>

      {/* Empty space for alignment */}
      <div className="hidden md:block w-5/12" />
    </motion.div>
  );
};

const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      
      const scrolled = Math.max(0, windowHeight - rect.top);
      const progress = Math.min(1, scrolled / (elementHeight + windowHeight * 0.5));
      
      setLineProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="timeline" className="py-20 md:py-32 bg-muted relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-cosmic opacity-50" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Nossa <span className="text-gradient-rose">Constelação</span>
          </h2>
          <p className="font-sans text-muted-foreground text-lg max-w-2xl mx-auto">
            Cada momento é uma estrela que brilha em nosso universo
          </p>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* Animated Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-border/30">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary via-accent to-secondary"
              style={{ height: `${lineProgress * 100}%` }}
            />
          </div>

          {/* Timeline Events */}
          <div className="space-y-16 md:space-y-24">
            {timelineEvents.map((event, index) => (
              <TimelineItem key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
