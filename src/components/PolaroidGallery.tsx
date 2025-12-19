import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface PolaroidRawData {
  id: string;
  file: string;
  text: string;
  tags: string[];
}

interface Polaroid extends PolaroidRawData {
  rotation: number;
  bgColor: string;
  size: "small" | "medium" | "large";
}

const PolaroidCard: React.FC<{
  polaroid: Polaroid;
  onClick: () => void;
  index: number;
}> = ({ polaroid, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: "w-40 md:w-48",
    medium: "w-48 md:w-56",
    large: "w-56 md:w-64",
  };

  return (
    <motion.div
      layoutId={`card-container-${polaroid.id}`}
      initial={{ opacity: 0, scale: 0.8, rotateZ: polaroid.rotation * 2 }}
      whileInView={{ opacity: 1, scale: 1, rotateZ: polaroid.rotation }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        type: "spring",
        stiffness: 80,
      }}
      viewport={{ once: true, margin: "-50px" }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="cursor-pointer relative z-10"
      style={{ zIndex: isHovered ? 20 : 10 }}
    >
      <motion.div
        animate={{
          rotateZ: polaroid.rotation,
          scale: isHovered ? 1.05 : 1,
          y: isHovered ? -10 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
      >
        <div
          className="tape -top-3 left-1/2 -translate-x-1/2 z-10 absolute h-8 w-24 bg-white/30 backdrop-blur-sm border border-white/20 shadow-sm rotate-[-2deg]"
          style={{
            transform: `translateX(-50%) rotate(${-polaroid.rotation}deg)`,
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        />

        <div
          className={`polaroid ${
            sizeClasses[polaroid.size]
          } bg-white shadow-xl relative p-3 pb-12 transition-shadow duration-300 hover:shadow-2xl`}
        >
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            <motion.img
              layoutId={`img-${polaroid.id}`}
              src={polaroid.file}
              alt={polaroid.text}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none" />
          </div>

          <p className="font-sans text-xs md:text-sm text-center text-gray-600 mt-4 px-1 leading-tight font-medium line-clamp-2">
            {polaroid.text}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PolaroidGallery: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [polaroids, setPolaroids] = useState<Polaroid[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedPolaroid = polaroids.find((p) => p.id === selectedId);

  useEffect(() => {
    const loadPolaroids = async () => {
      try {
        const response = await fetch(
          "https://imlusca.github.io/galeria/mapper.json"
        );
        const data: PolaroidRawData[] = await response.json();

        const sizes: ("small" | "medium" | "large")[] = [
          "small",
          "medium",
          "large",
        ];
        const bgColors = [
          "from-pink-500/20 to-purple-500/20",
          "from-blue-400/20 to-cyan-300/20",
          "from-amber-200/20 to-orange-100/20",
        ];

        const enhancedData: Polaroid[] = data.map((item, index) => ({
          ...item,
          file: `https://imlusca.github.io/galeria/polaroid/${item.file}`,
          rotation: (index % 2 === 0 ? 1 : -1) * (Math.random() * 4 + 1),
          size: sizes[index % 3],
          bgColor: bgColors[index % bgColors.length],
        }));

        setPolaroids(enhancedData);
      } catch (error) {
        console.error("Erro ao carregar polaroids:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPolaroids();
  }, []);

  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Carregando memórias...
      </div>
    );
  }

  return (
    <section className="py-24 md:py-20 bg-background relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50" />

      <div className="container mx-auto px-4 relative z-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-serif text-5xl md:text-7xl text-gray-900 mb-6">
            Galeria de <span className="text-yellow-600/80">Memórias</span>
          </h2>
          <p className="font-sans text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
            Clique em uma foto para dar zoom
          </p>
        </motion.div>

        <div className="relative flex flex-wrap justify-center gap-8 md:gap-14 max-w-7xl mx-auto pb-20">
          {polaroids.map((polaroid, index) => (
            <div
              key={polaroid.id}
              className={`${index % 2 === 0 ? "mt-0" : "md:mt-16"}`}
            >
              <PolaroidCard
                polaroid={polaroid}
                index={index}
                onClick={() => setSelectedId(polaroid.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedId && selectedPolaroid && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              layoutId={`card-container-${selectedPolaroid.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white p-4 shadow-2xl rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-2 right-2 z-20 p-2 bg-white/80 hover:bg-gray-100 rounded-full text-gray-800 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>

              <div className="relative w-full mb-6">
                <motion.img
                  layoutId={`img-${selectedPolaroid.id}`}
                  src={selectedPolaroid.file}
                  alt={selectedPolaroid.text}
                  className="w-full h-auto max-h-[70vh] object-contain mx-auto block rounded-sm bg-gray-50"
                />
              </div>

              <div className="text-center space-y-4 px-2 pb-4">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.01 }}
                  className="font-serif text-3xl text-gray-800"
                >
                  {selectedPolaroid.text}
                </motion.h3>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PolaroidGallery;
