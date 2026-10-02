import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { getProjectBySlug } from '../utils/loadProjects';
import DefaultLayout from './project/DefaultLayout';

// Optional per-project layouts sit beside their writeups: couch.md is laid out by couch.jsx
const layoutModules = import.meta.glob('/src/content/projects/*.jsx', { eager: true, import: 'default' });
const layouts = Object.fromEntries(
  Object.entries(layoutModules).map(([path, Layout]) => [path.split('/').pop().replace(/\.jsx$/, ''), Layout])
);

function ProjectNotFound() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center bg-field px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">This project isn't here</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink/75">
          The link may be old, or the project may have been renamed. Every project is listed on the home page.
        </p>
        <HashLink
          to="/#projects"
          className="mt-8 inline-flex items-center bg-ink px-5 pt-3.5 pb-3 font-semibold text-paper hover:bg-cobalt hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt"
        >
          See all projects
        </HashLink>
      </div>
    </div>
  );
}

export default function ProjectSubpage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  if (!project) return <ProjectNotFound />;

  const Layout = layouts[project.file];
  return Layout ? <Layout key={slug} /> : <DefaultLayout key={slug} slug={slug} />;
}
