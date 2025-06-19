import React from 'react';
import { Link } from 'react-router-dom';
import stock from '../assets/project1.png';
import stock1 from '../assets/project2.png';
import stock2 from '../assets/project3.png';
import stock3 from '../assets/project4.png';
import stock4 from '../assets/project5.png';
import stock5 from '../assets/project6.png';

const portfolioItems = [
  {
    slug: 'project-one',
    image: stock,
    title: 'Project One',
    category: 'HTML5 CSS3 Bootstrap ReactJS',
  },
  {
    slug: 'project-two',
    image: stock1,
    title: 'Project Two',
    category: 'HTML5 CSS3 Bootstrap Webpack SmoothScrolling VanillaJS',
  },
  {
    slug: 'bettafish-chess-player',
    image: stock2,
    title: 'Robot Chess Player - BettaFish',
    category: 'HTML5 CSS3 Bootstrap Webpack ReactJS',
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
  return (
    <section id={id} className="py-12 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800">Portfolio</h3>
          <p className="text-gray-600 mt-4">
            Incididunt nostrud id aute culpa excepteur pariatur consequat elit culpa nulla enim anim incididunt.
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
    </section>
  );
}
