import React, { useState, useRef, useEffect } from "react";

const VinylPlayer = ({ audioSrc, coverImg }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2 group">
      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 text-white px-2 py-1 rounded shadow-lg mb-1 pointer-events-none">
        {isPlaying ? "Pausar" : "Tocar Música"}
      </span>

      <div
        onClick={togglePlay}
        className="relative w-32 h-32 cursor-pointer hover:scale-105 transition-transform duration-300 ease-out"
        title="Clique para tocar"
      >
        <div
          className={`w-full h-full rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-900 bg-neutral-900 overflow-hidden relative ${
            isPlaying ? "animate-[spin_10s_linear_infinite]" : ""
          }`}
          style={{ animationPlayState: isPlaying ? "running" : "paused" }}
        >
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background:
                "repeating-radial-gradient(#333 0, #333 2px, #111 3px, #111 4px)",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-full" />

          <div
            className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border border-gray-800 shadow-inner overflow-hidden ${
              !coverImg ? "bg-red-600 border-2 border-red-800" : "bg-black"
            }`}
          >
            {coverImg && (
              <img
                src={coverImg}
                alt="Capa do Álbum"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
            )}

            <div className="relative z-20 w-1.5 h-1.5 bg-black rounded-full" />
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
};

export default VinylPlayer;
