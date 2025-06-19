import { useEffect } from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  useEffect(() => {
    document.title = "Eddy Pan | Portfolio";
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background GIF */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      >
        <source src="/background.gif" type="video/mp4" />
      </video>

      {/* Overlay for readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold"
        >
          Eddy Pan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-4 text-xl md:text-2xl"
        >
          Engineering. Software. Storytelling.
        </motion.p>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-10 animate-bounce"
        >
          <span className="text-white text-2xl">↓</span>
        </motion.div>
      </div>
    </div>
  );
}
