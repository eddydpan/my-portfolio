import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getProjectBySlug } from '../utils/loadProjects';
import BaseSubpage from './subpages/BaseSubpage';

export default function ProjectSubpage() {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = () => {
      try {
        setLoading(true);
        
        // Get project data from pre-loaded projects
        const projectData = getProjectBySlug(slug);
        
        if (!projectData) {
          setError('Project not found');
          setLoading(false);
          return;
        }
        
        setContent(projectData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Project not found');
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  const { frontmatter, markdownBody } = content;

  // Custom markdown description component with inline styles and image support
  const MarkdownDescription = () => (
    <div className="markdown-content">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-800 mt-8 mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2" {...props} />,
          h4: ({node, ...props}) => <h4 className="text-lg font-bold text-gray-800 mt-3 mb-2" {...props} />,
          p: ({node, ...props}) => <p className="text-gray-600 mb-4 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2" {...props} />,
          li: ({node, ...props}) => <li className="text-gray-600" {...props} />,
          a: ({node, ...props}) => <a className="text-indigo-500 hover:text-indigo-600 underline" {...props} />,
          img: ({node, ...props}) => <img className="w-full rounded-lg shadow-md my-4" {...props} />,
          code: ({node, inline, ...props}) => 
            inline ? 
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} /> : 
              <code className="block bg-gray-100 p-4 rounded text-sm font-mono overflow-x-auto" {...props} />,
        }}
      >
        {markdownBody}
      </ReactMarkdown>
    </div>
  );

  return (
    <BaseSubpage
      title={frontmatter.title}
      galleryImages={frontmatter.galleryImages || []}
      customDescription={<MarkdownDescription />}
      learnMoreLink={frontmatter.learnMoreLink}
    />
  );
}
