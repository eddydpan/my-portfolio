import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

import stock from '../assets/project1.png';
import stock1 from '../assets/project2.png';
import stock2 from '../assets/project3.png';
import stock3 from '../assets/project4.png';
import stock4 from '../assets/project5.png';
import stock5 from '../assets/project6.png';

const portfolioItems = [
  {
    slug: 'dancing-links',
    image: stock,
    title: 'Dancing Links (Algorithm X)',
    category: 'HTML5 CSS3 Bootstrap ReactJS',
  },
  {
    slug: 'iron-man',
    image: stock1,
    title: 'Iron Man Helmet',
    category: 'HTML5 CSS3 Bootstrap Webpack SmoothScrolling VanillaJS',
  },
  {
    slug: 'bettafish-chess-player',
    image: stock2,
    title: 'Robot Chess Player - BettaFish',
    category: 'Python -- Robotics',
  },
  {
    slug: 'farm-nerds',
    image: stock3,
    title: 'FarmNerds Documentation Tool',
    category: 'Python -- Full-Stack -- OCR',
  },
  {
    slug: 'pVMpkin',
    image: stock4,
    title: 'pVMpkin - LC3 Virtual Machine',
    category: 'C',
  },
  {
    slug: 'hms-recyclability-predictor',
    image: stock5,
    title: 'How To Recycle - General Vision-Language Model for Predicting Recyclability',
    category: 'Machine Learning -- Python -- R -- Academic Literature',
  },
  {
    slug: 'kung-fu-panda-showdown',
    image: stock4,
    title: 'Kung Fu Panda Showdown',
    category: 'Python',
  },
];

const PortfolioItem = ({ slug, image, title, category }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden group">
    <div className="relative overflow-hidden">
      <Link to={`/portfolio/${slug}`}>
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

export default function Portfolio({ id }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="py-12 bg-gray-100 relative"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800">Portfolio</h3>
          <p className="text-gray-600 mt-4">
            Here are a few of my projects! Click on each icon to learn more.
          </p>
          <div className="mt-4 w-16 h-1 bg-indigo-500 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <PortfolioItem
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
