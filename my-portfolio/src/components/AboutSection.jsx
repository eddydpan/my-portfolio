import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import profilePicture from '../assets/profile.jpg';
import TrianglesBackground from './TrianglesBackground';

export default function AboutSection({ id }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 bg-gray-100 text-gray-800 relative"
    >
      {/* Background Triangles */}
      <TrianglesBackground count={10} />

      {/* Horizontal Navy Dashed Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute top-16 left-8 right-8 h-0.5 border-t-2 border-dashed border-navy origin-center"
      />

      {/* About text */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        whileHover={{ scale: 1.05 }}
        className="container mx-auto px-4"
      >
        <div className="md:w-5/8 w-full md:pr-8 mb-8 md:mb-0 md:ml-8">
          <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg md:ml-24">
            <h2 className="text-4xl font-bold mb-4 leading-tight">About Me</h2>
            <p className="text-lg leading-loose">
              Hello! I'm [Your Name], a software engineer with a passion for creating
              beautiful and functional web applications. I specialize in modern
              frameworks like React and Tailwind CSS, and I love solving complex
              problems with elegant solutions. When I'm not coding, you can find me
              exploring new technologies, reading, or enjoying the outdoors.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Profile picture */}
      <motion.div
        className="md:w-3/8 w-full flex justify-center"
        whileHover={{ scale: 1.1 }}
      >
        <img
          src={profilePicture}
          alt="Profile"
          className="rounded-full w-56 h-56 object-cover shadow-lg"
        />
      </motion.div>
    </motion.section>
  );
}
