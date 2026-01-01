import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { getAllProjects } from '../utils/loadProjects';
import AnimatedShapesSection from './AnimatedShapesSection';
import PROJECT_ORDER from '../config/projectOrder';

const ProjectsItem = ({ slug, image, title, category }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden group">
    <div className="relative overflow-hidden h-48">
      <Link to={`/projects/${slug}`} className="block w-full h-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </Link>
    </div>
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-600 mt-2">{category}</p>
    </div>
  </div>
);

export default function Projects({ id, order }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  // Persist showAll state in localStorage
  const [showAll, setShowAll] = useState(() => {
    const saved = localStorage.getItem('projectsShowAll');
    return saved === 'true';
  });

  // Save to localStorage whenever showAll changes
  useEffect(() => {
    localStorage.setItem('projectsShowAll', showAll);
  }, [showAll]);

  // Load projects from markdown files and combine with static projects
  const rawProjects = useMemo(() => getAllProjects(), []);

  // Determine effective order: use passed-in `order` prop if provided,
  // otherwise fall back to the centralized `PROJECT_ORDER` list.
  const projectsItems = useMemo(() => {
    const effectiveOrder = Array.isArray(order) && order.length > 0 ? order : PROJECT_ORDER;
    if (Array.isArray(effectiveOrder) && effectiveOrder.length > 0) {
      const map = new Map(rawProjects.map((p) => [p.slug, p]));
      const ordered = effectiveOrder.map((s) => map.get(s)).filter(Boolean);
      const remaining = rawProjects.filter((p) => !effectiveOrder.includes(p.slug));
      return [...ordered, ...remaining];
    }
    return rawProjects;
  }, [rawProjects, order]);

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gray-100 relative"
    >
      {/* Animated Shapes Divider Section */}
      <AnimatedShapesSection 
        shape="triangle"
        color="red"
        count={12} 
        orientation="vertical"
        height="160px"
        spreadX={{ min: 0, max: 100 }}
        spreadY={{ min: 20, max: 80 }}
        className="mb-8"
      />

      {/* Projects Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800">Projects</h3>
          <p className="text-gray-600 mt-4">
            Here are a few of my technical projects I've done throughout my time at Olin College.
          </p>
          <div className="mt-4 w-16 h-1 bg-indigo-500 mx-auto"></div>
        </div>
        <div className="relative">
          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsItems.map((item, index) => {
              const isFirstRow = index < 3;
              const isSecondRow = index >= 3 && index < 6;
              const isBeyondSecondRow = index >= 6;
              
              return (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 1 }}
                  animate={{ 
                    opacity: !showAll && isSecondRow ? 0.4 : 1,
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: !showAll && isBeyondSecondRow ? 'none' : 'block',
                    pointerEvents: !showAll && !isFirstRow ? 'none' : 'auto',
                  }}
                  className={!showAll && isSecondRow ? 'overflow-hidden relative' : ''}
                >
                  <ProjectsItem
                    slug={item.slug}
                    image={item.image}
                    title={item.title}
                    category={item.category}
                  />
                  {/* Clip mask for second row preview */}
                  {!showAll && isSecondRow && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 pointer-events-none" style={{ top: '50%' }} />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* More button positioned right after second row */}
          {!showAll && projectsItems.length > 3 && (
            <motion.div 
              className="relative z-10 -mt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full flex flex-col items-center py-3 bg-transparent hover:bg-black/5 transition-all duration-300 group"
                aria-label="Show more projects"
              >
                <span className="text-base font-semibold text-black mb-1">
                  More
                </span>
                <motion.svg
                  className="w-24 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  animate={{ y: [0, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                >
                  {/* Two chevrons stacked tightly */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 8l-7 7-7-7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12l-7 7-7-7" />
                </motion.svg>
              </button>
            </motion.div>
          )}

          {/* Show Less button at bottom when expanded */}
          {showAll && projectsItems.length > 3 && (
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full flex flex-col items-center py-4 bg-transparent hover:bg-black/5 text-black transition-all duration-300 rounded-lg"
                aria-label="Show less projects"
              >
                <span className="text-lg font-semibold mb-2">
                  Show Less
                </span>
                <svg
                  className="w-24 h-8 rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 8l-7 7-7-7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12l-7 7-7-7" />
                </svg>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
