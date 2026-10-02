import { motion, useReducedMotion } from 'motion/react';
import { useProject, useSection, useMedia } from './ProjectContext';
import Raised from './Raised';
import { SETTLE_EASE, UNDER_SHEET_SHADOW } from '../../lib/depth';
import Markdown from './Markdown';
import PdfViewer from '../PdfViewer';
import { youtubeEmbedUrl } from './media';

// Grid placements for a text box set to one side of the 12-column page
const TEXT_SIDE = {
  left: 'md:col-span-8 md:col-start-1',
  center: 'md:col-span-8 md:col-start-3',
  right: 'md:col-span-8 md:col-start-5',
};

/**
 * A layout that points at writeup text that isn't there (a renamed heading, a part that was
 * merged away) shows this marker while developing, and renders nothing on the live site.
 */
function MissingSection({ message }) {
  if (!import.meta.env.DEV) return null;
  return (
    <div className="border-2 border-dashed border-signal bg-paper px-6 py-5 font-mono text-sm text-signal">
      Layout error: {message}
    </div>
  );
}

// heading prop: undefined shows the section heading on its first part only, false hides it,
// and a string replaces it
function resolveHeading(heading, sectionHeading, part) {
  if (heading === false) return null;
  if (typeof heading === 'string') return heading;
  return part == null || part === 1 ? sectionHeading : null;
}

function SectionText({ heading, body }) {
  return (
    <>
      {heading && (
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-ink text-balance md:text-[1.75rem]">
          {heading}
        </h2>
      )}
      <Markdown>{body}</Markdown>
    </>
  );
}

/**
 * The page's one colored sheet, tucked under its hero media and fanned out as the page opens,
 * the same device as the sheets under the About Me cards. Its color follows the margin shapes.
 */
function Underlay({ children }) {
  const { accent } = useProject();
  const reduceMotion = useReducedMotion();
  const fanned = { rotate: -2.5, x: -14, y: 16 };
  return (
    <div className="relative">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: accent, boxShadow: UNDER_SHEET_SHADOW }}
        initial={reduceMotion ? fanned : { rotate: 0, x: 0, y: 0 }}
        animate={fanned}
        transition={{ duration: 0.9, ease: SETTLE_EASE, delay: 0.25 }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function Caption({ children }) {
  if (!children) return null;
  return <figcaption className="px-1 pt-3 pb-0.5 text-sm leading-snug text-ink/70">{children}</figcaption>;
}

/**
 * Raised text box beside an image print, separated by a gap. The two boxes always share a
 * height: the text sets it and the image crops to fill (`focus` picks the crop, e.g. "center 30%";
 * `fit="contain"` shows the whole image on a paper mat instead, for screenshots and diagrams).
 * The text gets the wider column; for a short passage, `emphasis="image"` gives it to the image.
 * `side` is where the text sits; ProjectPage alternates it automatically when it's left out.
 */
export function Split({
  section, part, heading, image, side = 'left', emphasis = 'text', focus = 'center', fit = 'cover', alt,
}) {
  const text = useSection(section, part);
  const media = useMedia(image);
  if (text.missing) return <MissingSection message={text.missing} />;

  const textOnRight = side === 'right';
  const imageLed = emphasis === 'image';

  return (
    <section className="grid gap-5 md:grid-cols-12 md:gap-10 lg:gap-14">
      <Raised
        className={`flex flex-col justify-center px-7 py-8 md:px-10 md:py-11 lg:px-12 lg:py-12 ${
          imageLed ? 'md:col-span-5' : 'md:col-span-7'
        } ${textOnRight ? 'md:order-2' : ''}`}
      >
        <SectionText heading={resolveHeading(heading, text.heading, part)} body={text.body} />
      </Raised>

      {media.src && (
        <Raised as="figure" className={`flex flex-col p-2.5 md:p-3 ${imageLed ? 'md:col-span-7' : 'md:col-span-5'}`}>
          <div className={`relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[16rem] md:flex-1 ${fit === 'contain' ? 'bg-paper' : 'bg-paper-shade'}`}>
            <img
              src={media.src}
              alt={alt ?? media.caption ?? ''}
              loading="lazy"
              className={`absolute inset-0 h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
              style={{ objectPosition: focus }}
            />
          </div>
          <Caption>{media.caption}</Caption>
        </Raised>
      )}
    </section>
  );
}
Split.alternates = true;

/** A raised text box with no image, set left, right, or center. */
export function TextBlock({ section, part, heading, side = 'center' }) {
  const text = useSection(section, part);
  if (text.missing) return <MissingSection message={text.missing} />;

  return (
    <section className="md:grid md:grid-cols-12">
      <Raised className={`px-7 py-8 md:px-12 md:py-12 ${TEXT_SIDE[side] ?? TEXT_SIDE.center}`}>
        <SectionText heading={resolveHeading(heading, text.heading, part)} body={text.body} />
      </Raised>
    </section>
  );
}

/**
 * A full-width break: a landscape diagram or photo, a YouTube video, or a PDF.
 * Images show whole by default; pass `aspect` (e.g. "21/9") to crop a photo into a band.
 * The caption comes from the frontmatter's captions, or from a writeup `section` if given.
 */
export function Wide({ image, video, pdf, pdfTitle, section, aspect, focus = 'center', alt }) {
  const media = useMedia(image);
  const text = useSection(section);
  if (text.missing) return <MissingSection message={text.missing} />;

  const caption = section ? <Markdown variant="caption">{text.body}</Markdown> : media.caption;

  return (
    <Raised as="figure" lift className="p-2.5 md:p-3">
      {media.src &&
        (aspect ? (
          <div className="relative overflow-hidden bg-paper-shade" style={{ aspectRatio: aspect }}>
            <img
              src={media.src}
              alt={alt ?? media.caption ?? ''}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: focus }}
            />
          </div>
        ) : (
          <img
            src={media.src}
            alt={alt ?? media.caption ?? ''}
            loading="lazy"
            className="mx-auto max-h-[80vh] w-auto max-w-full"
          />
        ))}
      {video && (
        <div className="relative aspect-video bg-ink">
          <iframe
            src={youtubeEmbedUrl(video)}
            title={alt ?? 'Project video'}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      )}
      {pdf && <PdfViewer src={pdf} title={pdfTitle} />}
      <Caption>{caption}</Caption>
    </Raised>
  );
}

/** A line from the writeup set large, straight on the field. */
export function Quote({ section, part }) {
  const text = useSection(section, part);
  if (text.missing) return <MissingSection message={text.missing} />;

  return (
    <section className="md:grid md:grid-cols-12">
      <div className="relative md:col-span-9 md:col-start-2">
        <svg aria-hidden="true" viewBox="0 0 48 36" className="mb-4 h-8 w-auto fill-signal">
          <path d="M0 36V20C0 8 6 1 18 0v8c-6 1-9 5-9 12h9v16H0Zm30 0V20c0-12 6-19 18-20v8c-6 1-9 5-9 12h9v16H30Z" />
        </svg>
        <Markdown variant="lead">{text.body}</Markdown>
      </div>
    </section>
  );
}

/**
 * Hero media beside the title: an image print in an `aspect` frame, cropped unless
 * `fit="contain"`; `aspect="auto"` keeps the image's own shape. For an animated GIF, `still`
 * names a still frame shown to visitors who have asked for reduced motion.
 */
export function HeroImage({ image, still, aspect = '4/5', focus = 'center', fit = 'cover', alt }) {
  const media = useMedia(image);
  const stillMedia = useMedia(still);
  const reduceMotion = useReducedMotion();
  const src = reduceMotion && stillMedia.src ? stillMedia.src : media.src;
  const natural = aspect === 'auto';

  return (
    <Underlay>
      <Raised as="figure" lift delay={0.1} className="p-2.5 md:p-3">
        <div
          className={`relative overflow-hidden ${fit === 'contain' || natural ? 'bg-paper' : 'bg-paper-shade'}`}
          style={natural ? undefined : { aspectRatio: aspect }}
        >
          <img
            src={src}
            alt={alt ?? media.caption ?? ''}
            fetchPriority="high"
            className={
              natural
                ? 'block h-auto w-full'
                : `absolute inset-0 h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`
            }
            style={natural ? undefined : { objectPosition: focus }}
          />
        </div>
        <Caption>{media.caption}</Caption>
      </Raised>
    </Underlay>
  );
}
HeroImage.heroLayout = 'side';

/** Hero video below the title, full width. Its caption can come from a writeup `section`. */
export function HeroVideo({ src, section, title = 'Project video' }) {
  const text = useSection(section);
  return (
    <Underlay>
      <Raised as="figure" lift delay={0.1} className="p-2.5 md:p-3">
        <div className="relative aspect-video bg-ink">
          <iframe
            src={youtubeEmbedUrl(src)}
            title={title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        {section && !text.missing && (
          <Caption>
            <Markdown variant="caption">{text.body}</Markdown>
          </Caption>
        )}
      </Raised>
    </Underlay>
  );
}
HeroVideo.heroLayout = 'full';
