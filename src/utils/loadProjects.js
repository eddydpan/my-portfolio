import matter from 'gray-matter';
import stock1 from '../assets/project2.png';
import stock2 from '../assets/project3.png';

// Map of image names to actual imports
const imageMap = {
  'project2': stock1,
  'project3': stock2,
};

// Helper to resolve gallery images
const resolveGalleryImages = (images) => {
  if (!images || !Array.isArray(images)) return [];
  return images.map(img => imageMap[img] || img).filter(Boolean);
};

// Import all markdown files from the projects directory
const projectModules = import.meta.glob('/src/content/projects/*.md', { 
  eager: true,
  query: '?raw',
  import: 'default'
});

// Parse all projects and cache them
const allProjectsData = {};

for (const path in projectModules) {
  const markdownContent = projectModules[path];
  const { data: frontmatter, content: markdownBody } = matter(markdownContent);
  
  allProjectsData[frontmatter.slug] = {
    frontmatter: {
      ...frontmatter,
      image: imageMap[frontmatter.image] || frontmatter.image,
      galleryImages: resolveGalleryImages(frontmatter.galleryImages),
    },
    markdownBody,
  };
}

export const getAllProjects = () => {
  return Object.values(allProjectsData).map(project => ({
    slug: project.frontmatter.slug,
    image: project.frontmatter.image,
    title: project.frontmatter.title,
    category: project.frontmatter.category,
  }));
};

export const getProjectBySlug = (slug) => {
  return allProjectsData[slug] || null;
};
