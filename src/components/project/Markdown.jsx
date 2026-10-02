import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { resolveImageSrc } from '../../utils/loadProjects';
import PdfViewer from '../PdfViewer';
import { youtubeEmbedUrl } from './media';
import { toneOf } from './tones';

// Colors come from the surface the text sits on (see tones.js) through these custom properties.
// Long bare URLs would otherwise push the page wider than a phone, hence overflow-wrap.
const LINK_CLASS =
  'font-semibold underline decoration-[1.5px] underline-offset-[3px] [color:var(--md-link)] ' +
  '[text-decoration-color:color-mix(in_srgb,var(--md-link)_40%,transparent)] ' +
  'hover:[color:var(--md-link)] hover:[text-decoration-color:var(--md-link)] [overflow-wrap:anywhere] rounded-[1px] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--md-link)]';
const STRONG = '[color:var(--md-strong)]';

// A bare URL used as its own link text, shortened to read like a link: host plus the start of the path
function shortUrl(href) {
  try {
    const url = new URL(href);
    const segments = url.pathname.split('/').filter(Boolean);
    const path = segments.length ? `/${segments[0]}${segments.length > 1 || url.search ? '/…' : ''}` : '';
    return `${url.hostname.replace(/^www\./, '')}${path}`;
  } catch {
    return href;
  }
}

// react-markdown hands each renderer its syntax-tree node, which isn't a DOM attribute
function domProps(props) {
  const rest = { ...props };
  delete rest.node;
  return rest;
}

const components = {
  h2: (props) => <h2 className={`mt-10 mb-3 text-[1.25em] font-bold tracking-tight ${STRONG} first:mt-0`} {...domProps(props)} />,
  h3: (props) => <h3 className={`mt-8 mb-2 text-[1.15em] font-bold tracking-tight ${STRONG} first:mt-0`} {...domProps(props)} />,
  h4: (props) => <h4 className={`mt-6 mb-2 text-[1.05em] font-bold ${STRONG} first:mt-0`} {...domProps(props)} />,
  p: (props) => <p className="mb-4 last:mb-0" {...domProps(props)} />,
  ul: (props) => <ul className="mb-4 list-disc space-y-2 pl-5 marker:[color:var(--md-mark)] last:mb-0" {...domProps(props)} />,
  ol: (props) => <ol className="mb-4 list-decimal space-y-2 pl-5 marker:[color:var(--md-mark)] last:mb-0" {...domProps(props)} />,
  li: (props) => <li className="pl-1" {...domProps(props)} />,
  strong: (props) => <strong className={`font-bold ${STRONG}`} {...domProps(props)} />,
  a: (props) => {
    const { href, children } = props;
    const bare = typeof children === 'string' && children.trim() === href;
    return (
      <a className={LINK_CLASS} {...domProps(props)}>
        {bare ? shortUrl(href) : children}
      </a>
    );
  },
  blockquote: (props) => (
    <blockquote
      className={`my-6 border-y border-current/15 py-5 text-[1.25em] font-semibold leading-snug ${STRONG}`}
      {...domProps(props)}
    />
  ),
  img: ({ src, alt, ...props }) => (
    <img src={resolveImageSrc(src)} alt={alt ?? ''} className="my-6 w-full ring-1 ring-ink/10" {...domProps(props)} />
  ),
  // Fenced ```youtube and ```pdf blocks embed media; anything else is shown as code
  pre: ({ children }) => children,
  code: ({ className, children, ...props }) => {
    const lang = className?.replace('language-', '') ?? '';
    const content = String(children).trim();
    const isBlock = Boolean(className) || String(children).includes('\n');

    if (!isBlock) {
      return <code className="bg-current/10 px-1.5 py-0.5 font-mono text-[0.9em]" {...domProps(props)}>{children}</code>;
    }
    if (lang === 'pdf' || lang === 'pdf-url') {
      return <PdfViewer src={resolveImageSrc(content) || content} />;
    }
    if (lang === 'youtube' || lang === 'youtube-url') {
      return (
        <div className="relative my-6 aspect-video w-full bg-ink">
          <iframe
            src={youtubeEmbedUrl(content)}
            title="Embedded YouTube video"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      );
    }
    return (
      <pre className="my-6 overflow-x-auto bg-ink p-4 font-mono text-sm leading-relaxed text-paper">
        <code {...domProps(props)}>{content}</code>
      </pre>
    );
  },
};

const VARIANTS = {
  sm: 'text-base leading-[1.7]',
  md: 'text-[1.0625rem] leading-[1.75]',
  lg: 'text-[1.125rem] leading-[1.75] md:text-[1.25rem]',
  lead: 'text-2xl font-semibold leading-snug md:text-[2rem] md:leading-[1.3]',
  caption: 'text-sm leading-snug',
};

/**
 * Writeup text in the project page's reading style. `variant` is a body size (sm, md, lg),
 * `lead` for pull quotes, or `caption`; `tone` is the surface it sits on, which sets its colors.
 */
export default function Markdown({ children, variant = 'md', tone = 'paper' }) {
  const colors = toneOf(tone);
  return (
    <div
      className={VARIANTS[variant] ?? VARIANTS.md}
      style={{
        color: variant === 'lead' ? colors.strong : colors.text,
        '--md-strong': colors.strong,
        '--md-link': colors.link,
        '--md-mark': colors.mark,
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
