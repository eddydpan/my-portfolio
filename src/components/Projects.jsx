import React, { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { getAllProjects } from '../utils/loadProjects';
import AnimatedShapesSection from './AnimatedShapesSection';

const ProjectsItem = ({ slug, image, title, category }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden group">
    <div className="relative overflow-hidden h-48 flex items-center justify-center">
      {/* Landscape iPhone aspect box (~812x375 => padding-top 46.2%) */}
      <div className="w-full max-w-[420px] mx-auto" style={{ position: 'relative', paddingTop: '46.2%' }}>
        <Link to={`/projects/${slug}`} className="absolute inset-0 flex items-center justify-center">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 m-auto max-w-full max-h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
      </div>
    </div>
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-600 mt-2">{category}</p>
    </div>
  </div>
);

export default function Projects({ id }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Load projects from markdown files and combine with static projects
  const projectsItems = useMemo(() => {
    return getAllProjects();
  }, []);

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
        orientation="horizontal"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsItems.map((item) => (
            <ProjectsItem
              key={item.slug}
              slug={item.slug}
              image={item.image}
              title={item.title}
              category={item.category}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
