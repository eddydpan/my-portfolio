import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import profilePicture from '../assets/typography-portrait-full.jpg';

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
      className="py-0 bg-white text-gray-800"
    >
      {/* Content Container - full width with flex */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-0">
          {/* About text - left two thirds */}
          <div className="w-full md:w-2/3 bg-gray-200 p-12 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.45)]">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <p className="text-base leading-relaxed text-gray-700">
              Welcome to my portfolio! I'm a senior at Olin College of Engineering studying Computer Science
              and Robotics. I love working on hands-on software projects and exploring a broad 
              range of topics across the stack. I'm drawn to projects with clear impact, as well as 
              side projects that breathe whimsy into learning. Whether I'm tackling a practical 
              problem or experimenting with a new concept, I enjoy learning by building and iterating.
            </p>
          </div>

          {/* Profile picture - right third */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-full h-96 object-contain"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
