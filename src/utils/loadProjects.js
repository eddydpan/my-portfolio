import matter from 'gray-matter';

// Dynamically import all images and videos from assets directory
const imageModules = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,gif,svg,webp,mp4,webm,mov}', { 
  eager: true,
  import: 'default'
});

// Build imageMap from all imported images and videos
// Keys will be the filename without extension (e.g., 'project2', 'seven-segment-display', 'demo-video')
const imageMap = {};

for (const path in imageModules) {
  const imageSrc = imageModules[path];
  // Extract filename without extension from path
  // e.g., '/src/assets/sequencer/seven-segment-display.png' -> 'seven-segment-display'
  const filename = path.split('/').pop().replace(/\.\w+$/, '');
  imageMap[filename] = imageSrc;
}

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

// Export helper to resolve image sources in markdown
export const resolveImageSrc = (src) => {
  // Check if src is a key in imageMap
  if (imageMap[src]) {
    return imageMap[src];
  }
  // Otherwise return the src as-is (for external URLs)
  return src;
};
