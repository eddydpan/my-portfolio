import React, { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { getAllProjects } from '../utils/loadProjects';
import TrianglesBackground from './TrianglesBackground';

import stock from '../assets/project1.png';
import stock1 from '../assets/project2.png';
import stock2 from '../assets/project3.png';
import stock3 from '../assets/project4.png';
import stock4 from '../assets/project5.png';
import stock5 from '../assets/project6.png';

// Fallback static projects for those without markdown files yet
const staticProjects = [
  {
    slug: 'project-one',
    image: stock,
    title: 'Project One',
    category: 'HTML5 CSS3 Bootstrap ReactJS',
  },
  {
    slug: 'project-four',
    image: stock3,
    title: 'Project Four',
    category: 'Bootstrap ReactJS GoogleAPI',
  },
  {
    slug: 'project-five',
    image: stock4,
    title: 'Project Five',
    category: 'MERN',
  },
  {
    slug: 'project-six',
    image: stock5,
    title: 'Project Six',
    category: 'HTML5 CSS3 Bootstrap MERN',
  },
];

const ProjectsItem = ({ slug, image, title, category }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden group">
    <div className="relative overflow-hidden">
      <Link to={`/projects/${slug}`}>
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-75"
        />
      </Link>
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
    try {
      const markdownProjects = getAllProjects();
      // Combine markdown projects with static projects
      return [...markdownProjects, ...staticProjects];
    } catch (error) {
      console.error('Error loading markdown projects:', error);
      // Fallback to static projects only
      return staticProjects;
    }
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
      {/* Triangles Divider Section */}
      <div className="h-40 relative overflow-hidden mb-8">
        <TrianglesBackground 
          count={12} 
          orientation="horizontal"
          height="100%"
          spreadX={{ min: 0, max: 100 }}
          spreadY={{ min: 20, max: 80 }}
        />
      </div>

      {/* Projects Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800">Projects</h3>
          <p className="text-gray-600 mt-4">
            Incididunt nostrud id aute culpa excepteur pariatur consequat elit culpa nulla enim anim incididunt.
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
