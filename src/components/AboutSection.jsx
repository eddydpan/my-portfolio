import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import profilePicture from '../assets/profile.jpg';

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
      className="py-20 bg-gray-200 text-gray-800"
    >
      {/* Content Container - full width with flex */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center">
          {/* About text - left half */}
          <div className="w-full md:w-1/2 md:pr-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <p className="text-base leading-relaxed text-gray-700">
              Hello! I'm [Your Name], a software engineer with a passion for exploring breadth.
              I love solving complex problems with elegant solutions. When I'm not coding, you can find me
              exploring new technologies, reading, or enjoying the outdoors.
            </p>
          </div>

          {/* Profile picture - right half */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
            <img
              src={profilePicture}
              alt="Profile"
              className="rounded-full w-40 h-40 md:w-48 md:h-48 object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
