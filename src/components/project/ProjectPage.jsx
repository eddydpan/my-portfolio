import { Children, cloneElement, isValidElement, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { motion, useReducedMotion } from 'motion/react';
import { getAllProjects, getProjectBySlug } from '../../utils/loadProjects';
import PROJECT_ORDER from '../../config/projectOrder';
import AnimatedShapes from '../AnimatedShapes';
import { RAISED_SHADOW, SETTLE_EASE } from '../../lib/depth';
import { ProjectContext } from './ProjectContext';
import { ArrowIcon, FAN_EASE, PrimaryLink, ShapeGlyph, ShapeLink } from './controls';
import FieldShapes from './FieldShapes';
import { linkLabel } from './media';

// The writeups name their margin colors loosely; the page keeps them inside the site palette
const PALETTE = {
  red: 'var(--color-signal)',
  pink: 'var(--color-signal)',
  orange: 'var(--color-sun)',
  yellow: 'var(--color-sun)',
  blue: 'var(--color-cobalt)',
  green: 'var(--color-cobalt)',
  cyan: 'var(--color-cobalt)',
  purple: 'var(--color-cobalt)',
};

function MarginShapes({ config, side }) {
  if (!config) return null;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 bottom-0 hidden xl:block ${side === 'left' ? 'left-0 pr-3' : 'right-0 pl-3'}`}
      style={{ width: 'calc((100% - 72rem) / 2)' }}
    >
      <AnimatedShapes
        shape={config.shape || 'triangle'}
        color={PALETTE[config.color] || config.color || PALETTE.red}
        count={config.count || 12}
        orientation={config.orientation || 'vertical'}
        height="100%"
        spreadX={config.spreadX || { min: 10, max: 90 }}
        spreadY={config.spreadY || { min: 0, max: 100 }}
      />
    </div>
  );
}

// repo can be one URL or a list of { label, url }; learnMoreLink is added unless it repeats one
function projectLinks({ repo, learnMoreLink, links = [] }) {
  const list = [];
  const add = (entry) => {
    const item = typeof entry === 'string' ? { url: entry } : entry;
    if (item?.url && !list.some((l) => l.url === item.url)) {
      list.push({ label: item.label || linkLabel(item.url), url: item.url });
    }
  };
  (Array.isArray(repo) ? repo : [repo]).forEach(add);
  add(learnMoreLink);
  links.forEach(add);
  return list;
}

function siblingProjects(slug) {
  const all = getAllProjects();
  const order = PROJECT_ORDER.length > 0 ? PROJECT_ORDER : all.map((p) => p.slug);
  const ordered = order.map((s) => all.find((p) => p.slug === s)).filter(Boolean);
  const index = ordered.findIndex((p) => p.slug === slug);
  return {
    previous: index > 0 ? ordered[index - 1] : null,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}

function SiblingLink({ project, direction, accent, shape }) {
  if (!project) return <div className="hidden md:block" />;
  const isNext = direction === 'next';

  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`group relative isolate block text-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-cobalt ${
        isNext ? 'md:col-start-2' : ''
      }`}
    >
      {/* The accent sheet waits underneath and fans out toward the direction of travel */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-transform duration-500 ${FAN_EASE} motion-reduce:transition-none ${
          isNext
            ? 'group-hover:[transform:translate(10px,10px)_rotate(2.5deg)]'
            : 'group-hover:[transform:translate(-10px,10px)_rotate(-2.5deg)]'
        }`}
        style={{ background: accent }}
      />
      <span
        className={`flex h-full items-center gap-5 bg-paper px-7 py-6 ring-1 ring-ink/[0.06] transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-1 motion-reduce:transition-none ${
          isNext ? 'flex-row-reverse text-right' : ''
        }`}
        style={{ boxShadow: RAISED_SHADOW }}
      >
        <ArrowIcon
          direction={isNext ? 'right' : 'left'}
          className={`h-6 w-6 shrink-0 text-ink transition-transform duration-300 ${isNext ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}
        />
        <span className="min-w-0 flex-1">
          <span className="sr-only">{isNext ? 'Next project: ' : 'Previous project: '}</span>
          <span className="text-xl font-bold tracking-tight text-balance">{project.title}</span>
        </span>
        <ShapeGlyph
          shape={shape}
          color={accent}
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-500 ${FAN_EASE} group-hover:rotate-[135deg] group-hover:scale-125 motion-reduce:transition-none`}
        />
      </span>
    </Link>
  );
}

// Gap above a section: parts of one writeup section sit close together, full-width breaks get
// room on both sides, and any section can ask for `space="tight" | "normal" | "loose"`
const SPACE = { tight: 'mt-10 md:mt-14', normal: 'mt-16 md:mt-24', loose: 'mt-24 md:mt-36' };

function gapAbove(child, previous) {
  if (!previous) return '';
  if (child.props.space) return SPACE[child.props.space] ?? SPACE.normal;
  const breaks = (el) => el.type?.isBreak;
  if (breaks(child) || breaks(previous)) return SPACE.loose;
  const sameSection = child.props.section && child.props.section === previous.props.section;
  return sameSection ? SPACE.tight : SPACE.normal;
}

/**
 * The frame every project page shares: title band, links, margin shapes, and the way out.
 * Children are the page's sections, top to bottom. `hero` is optional media for the title band;
 * a HeroImage sits beside the title and a HeroVideo runs full width beneath it. Large pale
 * shapes fill the field behind the sections in the page's margin shape; `backdrop` picks another
 * shape (square, circle, triangle), or false turns them off.
 */
export default function ProjectPage({ slug: slugProp, hero = null, backdrop, children }) {
  const params = useParams();
  const slug = slugProp ?? params.slug;
  const project = getProjectBySlug(slug);
  const usedParts = useRef(new Set()).current;
  const reduceMotion = useReducedMotion();

  const { frontmatter, sections, file } = project;
  const { title, summary, category } = frontmatter;
  const tags = category ? category.split('|').map((t) => t.trim()).filter(Boolean) : [];
  const links = projectLinks(frontmatter);
  const siblings = siblingProjects(slug);
  const heroLayout = hero?.props?.layout ?? hero?.type?.heroLayout ?? 'side';
  const heroBeside = hero && heroLayout === 'side';
  // The page's accent color and shape, taken from its margin shapes
  const accent = PALETTE[frontmatter.leftAnimation?.color] ?? PALETTE.blue;
  const shape = frontmatter.leftAnimation?.shape ?? 'square';

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} · Eddy Pan`;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  // While developing, point out writeup text that no section on the page renders
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const unused = sections.flatMap((s) =>
      s.parts.map((_, i) => `${s.key}#${i + 1}`).filter((id) => !usedParts.has(id))
        .map((id) => (s.parts.length > 1 ? `"## ${s.heading}" part ${id.split('#')[1]}` : `"## ${s.heading ?? '(before the first heading)'}"`))
    );
    if (unused.length) console.warn(`[${file}.md] Not shown on the page: ${unused.join(', ')}`);
  }, [sections, usedParts, file]);

  // Split sections without an explicit side alternate text left, right, left..., and each
  // section is spaced by how it relates to the one before it
  let splitCount = 0;
  let previous = null;
  const body = Children.toArray(children).filter(isValidElement).map((child) => {
    let element = child;
    if (child.type?.alternates) {
      const side = child.props.side ?? (splitCount % 2 === 0 ? 'left' : 'right');
      splitCount += 1;
      element = cloneElement(child, { side });
    }
    const wrapped = (
      <div key={child.key} className={gapAbove(child, previous)}>
        {element}
      </div>
    );
    previous = child;
    return wrapped;
  });

  const enter = (delay) =>
    reduceMotion ? { duration: 0 } : { duration: 0.9, ease: SETTLE_EASE, delay };

  return (
    <ProjectContext.Provider value={{ frontmatter, sections, usedParts, file, accent, shape }}>
      <div className="relative isolate overflow-hidden bg-field text-ink selection:bg-sun/60 selection:text-ink">
        <MarginShapes config={frontmatter.leftAnimation} side="left" />
        <MarginShapes config={frontmatter.rightAnimation} side="right" />

        <header className="mx-auto max-w-6xl px-6 pt-10 pb-16 md:pt-16 md:pb-24">
          <HashLink
            to="/#projects"
            className="group inline-flex items-center gap-2 py-2 text-sm font-semibold text-ink/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt"
          >
            <ArrowIcon direction="left" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All projects
          </HashLink>

          <div className={`mt-8 md:mt-10 ${heroBeside ? 'grid items-center gap-12 md:grid-cols-12 lg:gap-16' : ''}`}>
            <motion.div
              className={heroBeside ? 'md:col-span-7' : 'max-w-4xl'}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={enter(0)}
            >
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              {summary && (
                <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink/75 md:text-xl">{summary}</p>
              )}
              {tags.length > 0 && (
                <ul aria-label="Built with" className="mt-6 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li key={tag} className="bg-paper/70 px-2.5 pt-[0.4em] pb-[0.25em] text-sm leading-none text-ink/75 ring-1 ring-ink/10">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              {links.length > 0 && (
                <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                  {links.map((link, i) =>
                    i === 0 ? (
                      <PrimaryLink key={link.url} href={link.url}>{link.label}</PrimaryLink>
                    ) : (
                      <ShapeLink key={link.url} href={link.url}>{link.label}</ShapeLink>
                    )
                  )}
                </div>
              )}
            </motion.div>

            {heroBeside && <div className="md:col-span-5">{hero}</div>}
          </div>

          {hero && !heroBeside && <div className="mt-12 md:mt-16">{hero}</div>}
        </header>

        <main className="relative mx-auto max-w-6xl px-6">
          {backdrop !== false && <FieldShapes shape={typeof backdrop === 'string' ? backdrop : shape} />}
          {body}
        </main>

        <nav aria-label="More projects" className="mx-auto grid max-w-6xl gap-5 px-6 pt-24 pb-24 md:grid-cols-2 md:gap-10 md:pt-32 md:pb-32">
          <SiblingLink project={siblings.previous} direction="previous" accent={accent} shape={shape} />
          <SiblingLink project={siblings.next} direction="next" accent={accent} shape={shape} />
        </nav>
      </div>
    </ProjectContext.Provider>
  );
}
