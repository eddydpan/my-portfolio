import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { getProjectBySlug, resolveImageSrc } from '../utils/loadProjects';
import BaseSubpage from './subpages/BaseSubpage';
import PdfViewer from './PdfViewer';

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

  useEffect(() => {
    // Scroll to top when component mounts or slug changes
    window.scrollTo(0, 0);
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
          img: ({node, src, ...props}) => {
            // Resolve image src through imageMap if it's a key name
            const resolvedSrc = resolveImageSrc(src);
            return <img src={resolvedSrc} className="w-full rounded-lg shadow-md my-4" {...props} />;
          },
          video: ({node, src, ...props}) => {
            // Resolve video src through imageMap if it's a key name
            const resolvedSrc = resolveImageSrc(src);
            return (
              <video 
                controls 
                className="w-full rounded-lg shadow-md my-4"
                {...props}
              >
                <source src={resolvedSrc} type="video/mp4" />
                Your browser doesn't support video playback.
              </video>
            );
          },
          code: ({node, inline, className, children, ...props}) => {
            // Render inline code normally
            if (inline) {
              return <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>;
            }

            // Block code: detect language from className (e.g. 'language-youtube')
            const lang = className ? className.replace('language-', '') : '';
            const codeContent = String(children).trim();
            // Support fenced blocks with language 'pdf' or 'pdf-url'
            if (lang === 'pdf' || lang === 'pdf-url') {
              // codeContent can be a full URL or an app-relative path (e.g. /docs/file.pdf)
              // or a key that resolveImageSrc can resolve (if you import PDF into assets and register it).
              const resolved = resolveImageSrc(codeContent) || codeContent;
              return (
                <div className="w-full my-4">
                  <PdfViewer src={resolved} />
                </div>
              );
            }

            // Support fenced blocks with language 'youtube' or 'youtube-url'
            if (lang === 'youtube' || lang === 'youtube-url') {
              // Accept either a raw video id or a full YouTube URL; extract ID if needed
              let id = codeContent;
              const urlMatch = codeContent.match(/(?:youtu\.be\/([A-Za-z0-9_-]{6,})|v=([A-Za-z0-9_-]{6,})|embed\/([A-Za-z0-9_-]{6,}))/);
              if (urlMatch) {
                id = urlMatch[1] || urlMatch[2] || urlMatch[3] || id;
              }

              const src = `https://www.youtube.com/embed/${id}`;

              return (
                <div className="w-full my-4" style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe
                    src={src}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                </div>
              );
            }

            // Fallback: render regular code block
            return (
              <pre className="bg-gray-100 p-4 rounded text-sm font-mono overflow-x-auto"><code {...props}>{codeContent}</code></pre>
            );
          },
        }}
      >
        {markdownBody}
      </ReactMarkdown>
    </div>
  );

  const CombinedDescription = () => (
    <div>
      <MarkdownDescription />
      {frontmatter.pdf && (
        <div className="mt-6">
          <PdfViewer src={frontmatter.pdf} />
        </div>
      )}
    </div>
  );

  return (
    <BaseSubpage
      title={frontmatter.title}
      galleryImages={frontmatter.galleryImages || []}
      customDescription={<CombinedDescription />}
      learnMoreLink={frontmatter.learnMoreLink}
    />
  );
}
