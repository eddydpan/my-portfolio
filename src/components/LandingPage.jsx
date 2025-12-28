import { useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';
import { autoTyper } from '../utils/autoTyper';
import backgroundGif from '../assets/background.gif';
import { motion } from 'motion/react';

export default function LandingPage() {
  const typerRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  useEffect(() => {
    if (typerRef.current) {
      autoTyper(typerRef.current, "Hi, I'm [Your Name]! I'm a passionate developer specializing in building modern web applications.", 100);
    }
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background GIF */}
      <img
        src={backgroundGif}
        alt="background animation"
        className="absolute inset-0 w-full h-full object-cover -z-10"
        loading="eager"
      />

      {/* Overlay with semi-transparent dark layer for better text visibility */}
      <div className="absolute inset-0 bg-black/60 -z-5"></div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-white text-center">
        <h1 className="text-5xl font-extrabold mb-6">Welcome to My Portfolio</h1>
        <div className="w-full overflow-hidden bg-transparent text-white">
          <div ref={typerRef} className="text-lg"></div>
        </div>

        {/* Links to sections */}
        <div className="mt-8 flex space-x-4">
          <HashLink
            smooth
            to="#about"
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            About Me
          </HashLink>
          <HashLink
            smooth
            to="#projects"
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            My Work
          </HashLink>
        </div>
      </div>

      {/* Typing effect CSS */}
      <style>
        {`.wrap { border-right: 0.08em solid #666; }`}
      </style>
    </motion.div>
  );
}
