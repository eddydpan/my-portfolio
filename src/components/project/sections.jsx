import { useReducedMotion } from 'motion/react';
import { useProject, useSection, useMedia } from './ProjectContext';
import Surface from './Surface';
import Markdown from './Markdown';
import PdfViewer from '../PdfViewer';
import { youtubeEmbedUrl } from './media';
import { colorOf, toneOf } from './tones';

/*
 * Section components for project layouts. Every text box and image frame is a Surface, so they
 * share one set of looks:
 *   tone       paper (default), shade, sun, cobalt, signal, ink
 *   shape      rect (default), arch, slant, circle (TextBlock only; for short text)
 *   elevation  flat, raised (default), lifted, floating
 *   stack      colored sheets fanned out behind it: "cobalt", ["sun", "shade"], or
 *              [{ color, rotate, x, y }]
 *   tilt       degrees, e.g. -2
 * On Split, the plain props style the text box and image* props (imageTone, imageElevation,
 * imageStack, imageTilt) style the image frame. Text boxes also take `size` (sm, md, lg).
 * Any section takes `space` (tight, normal, loose) for the gap above it; see ProjectPage.
 */

const SIZES = {
  sm: { pad: 'px-6 py-7 md:px-9 md:py-9', heading: 'mb-3 text-xl md:text-2xl', body: 'sm' },
  md: { pad: 'px-7 py-8 md:px-12 md:py-12', heading: 'mb-4 text-2xl md:text-[1.75rem]', body: 'md' },
  lg: { pad: 'px-8 py-10 md:px-16 md:py-16', heading: 'mb-6 text-3xl md:text-5xl', body: 'lg' },
};

// Extra room so text clears an arch's curve or a slant's angled edges
const SHAPE_PAD = {
  arch: 'pt-20 md:pt-28',
  slant: 'pt-14 pb-14 md:pt-16 md:pb-16',
};

// TextBlock widths in columns of the 12-column page, and where each sits for each side
const WIDTH_SPAN = { narrow: 6, normal: 8, wide: 10, full: 12 };
const PLACEMENT = {
  6: { left: 'md:col-span-6 md:col-start-1', center: 'md:col-span-6 md:col-start-4', right: 'md:col-span-6 md:col-start-7' },
  8: { left: 'md:col-span-8 md:col-start-1', center: 'md:col-span-8 md:col-start-3', right: 'md:col-span-8 md:col-start-5' },
  10: { left: 'md:col-span-10 md:col-start-1', center: 'md:col-span-10 md:col-start-2', right: 'md:col-span-10 md:col-start-3' },
  12: { left: 'md:col-span-12', center: 'md:col-span-12', right: 'md:col-span-12' },
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

function SectionText({ heading, body, tone, size }) {
  const scale = SIZES[size] ?? SIZES.md;
  return (
    <>
      {heading && (
        <h2
          className={`font-bold leading-[1.1] tracking-tight text-balance ${scale.heading}`}
          style={{ color: toneOf(tone).strong }}
        >
          {heading}
        </h2>
      )}
      <Markdown variant={scale.body} tone={tone}>{body}</Markdown>
    </>
  );
}

function Caption({ children, tone = 'paper' }) {
  if (!children) return null;
  return (
    <figcaption className="px-1 pt-3 pb-0.5 text-sm leading-snug" style={{ color: toneOf(tone).text }}>
      {children}
    </figcaption>
  );
}

/**
 * Text box beside an image print, separated by a gap. The two always share a height: the text
 * sets it and the image crops to fill (`focus` picks the crop, e.g. "center 30%"; `fit="contain"`
 * shows the whole image on its mat instead, for screenshots and diagrams). The text gets the
 * wider column; for a short passage, `emphasis="image"` gives it to the image.
 * `side` is where the text sits; ProjectPage alternates it automatically when it's left out.
 */
export function Split({
  section, part, heading, image, alt,
  side = 'left', emphasis = 'text', focus = 'center', fit = 'cover',
  tone = 'paper', shape = 'rect', elevation = 'raised', stack, tilt = 0, size = 'md',
  imageTone = 'paper', imageElevation = 'raised', imageStack, imageTilt = 0,
}) {
  const text = useSection(section, part);
  const media = useMedia(image);
  if (text.missing) return <MissingSection message={text.missing} />;

  const textOnRight = side === 'right';
  const imageLed = emphasis === 'image';
  const boxShape = shape === 'circle' ? 'rect' : shape;

  return (
    <section className="grid gap-6 md:grid-cols-12 md:gap-10 lg:gap-14">
      <Surface
        tone={tone}
        shape={boxShape}
        elevation={elevation}
        stack={stack}
        tilt={tilt}
        className={`${imageLed ? 'md:col-span-5' : 'md:col-span-7'} ${textOnRight ? 'md:order-2' : ''}`}
        innerClassName={`flex flex-col justify-center ${(SIZES[size] ?? SIZES.md).pad} ${SHAPE_PAD[boxShape] ?? ''}`}
      >
        <SectionText heading={resolveHeading(heading, text.heading, part)} body={text.body} tone={tone} size={size} />
      </Surface>

      {media.src && (
        <Surface
          as="figure"
          tone={imageTone}
          elevation={imageElevation}
          stack={imageStack}
          tilt={imageTilt}
          className={imageLed ? 'md:col-span-7' : 'md:col-span-5'}
          innerClassName="flex flex-col p-2.5 md:p-3"
        >
          <div
            className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[16rem] md:flex-1"
            style={{ background: fit === 'contain' ? toneOf(imageTone).bg : 'var(--color-paper-shade)' }}
          >
            <img
              src={media.src}
              alt={alt ?? media.caption ?? ''}
              loading="lazy"
              className={`absolute inset-0 h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
              style={{ objectPosition: focus }}
            />
          </div>
          <Caption tone={imageTone}>{media.caption}</Caption>
        </Surface>
      )}
    </section>
  );
}
Split.alternates = true;

/**
 * A text box with no image. `side` sets it left, right, or center and `width` sets how much of
 * the page it spans: narrow, normal (default), wide, or full. `shape="circle"` sets short text
 * in a disc.
 */
export function TextBlock({
  section, part, heading, side = 'center', width,
  tone = 'paper', shape = 'rect', elevation = 'raised', stack, tilt = 0, size = 'md',
}) {
  const text = useSection(section, part);
  if (text.missing) return <MissingSection message={text.missing} />;

  const circle = shape === 'circle';
  const span = WIDTH_SPAN[width ?? (circle ? 'narrow' : 'normal')] ?? 8;
  const place = PLACEMENT[span][side] ?? PLACEMENT[span].center;

  return (
    <section className="md:grid md:grid-cols-12">
      <Surface
        tone={tone}
        shape={shape}
        elevation={elevation}
        stack={stack}
        tilt={tilt}
        className={`${place} ${circle ? 'mx-auto aspect-square w-full max-w-[34rem]' : ''}`}
        innerClassName={
          circle
            ? 'flex flex-col items-center justify-center px-[14%] text-center'
            : `${(SIZES[size] ?? SIZES.md).pad} ${SHAPE_PAD[shape] ?? ''}`
        }
      >
        <SectionText heading={resolveHeading(heading, text.heading, part)} body={text.body} tone={tone} size={size} />
      </Surface>
    </section>
  );
}

/**
 * A full-width break: a landscape diagram or photo, a YouTube video, or a PDF.
 * Images show whole by default; pass `aspect` (e.g. "21/9") to crop a photo into a band.
 * It crosses a band of the page's accent color running edge to edge; set `band` to another
 * color, or to false for none. The caption comes from the frontmatter's captions, or from a
 * writeup `section` if given.
 */
export function Wide({
  image, video, pdf, pdfTitle, section, aspect, focus = 'center', alt,
  band, tone = 'paper', elevation = 'lifted', stack, tilt = 0,
}) {
  const { accent } = useProject();
  const media = useMedia(image);
  const text = useSection(section);
  if (text.missing) return <MissingSection message={text.missing} />;

  const caption = section ? <Markdown variant="caption" tone={tone}>{text.body}</Markdown> : media.caption;
  const bandColor = band === false ? null : colorOf(band ?? accent);

  return (
    <div className="relative">
      {bandColor && (
        <div
          aria-hidden="true"
          className="absolute top-[18%] bottom-[18%] left-1/2 -z-10 w-screen -translate-x-1/2"
          style={{ background: bandColor }}
        />
      )}
      <Surface as="figure" lift tone={tone} elevation={elevation} stack={stack} tilt={tilt} innerClassName="p-2.5 md:p-3">
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
        <Caption tone={tone}>{caption}</Caption>
      </Surface>
    </div>
  );
}
Wide.isBreak = true;

/** A line from the writeup set large, straight on the field. `mark` colors the quote mark. */
export function Quote({ section, part, mark = 'signal' }) {
  const text = useSection(section, part);
  if (text.missing) return <MissingSection message={text.missing} />;

  return (
    <section className="md:grid md:grid-cols-12">
      <div className="relative md:col-span-9 md:col-start-2">
        <svg aria-hidden="true" viewBox="0 0 48 36" className="mb-4 h-8 w-auto" style={{ fill: colorOf(mark) }}>
          <path d="M0 36V20C0 8 6 1 18 0v8c-6 1-9 5-9 12h9v16H0Zm30 0V20c0-12 6-19 18-20v8c-6 1-9 5-9 12h9v16H30Z" />
        </svg>
        <Markdown variant="lead" tone="field">{text.body}</Markdown>
      </div>
    </section>
  );
}

/**
 * Hero media beside the title: an image print in an `aspect` frame, cropped unless
 * `fit="contain"`; `aspect="auto"` keeps the image's own shape. For an animated GIF, `still`
 * names a still frame shown to visitors who have asked for reduced motion. It rests on a sheet
 * of the page's accent color; `stack` replaces that, or set it to false for none.
 */
export function HeroImage({
  image, still, aspect = '4/5', focus = 'center', fit = 'cover', alt,
  stack, elevation = 'lifted', tilt = 0,
}) {
  const { accent } = useProject();
  const media = useMedia(image);
  const stillMedia = useMedia(still);
  const reduceMotion = useReducedMotion();
  const src = reduceMotion && stillMedia.src ? stillMedia.src : media.src;
  const natural = aspect === 'auto';

  return (
    <Surface
      as="figure"
      lift
      delay={0.1}
      elevation={elevation}
      stack={stack === false ? null : stack ?? accent}
      tilt={tilt}
      innerClassName="p-2.5 md:p-3"
    >
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
    </Surface>
  );
}
HeroImage.heroLayout = 'side';

/**
 * Hero video below the title, full width. Its caption can come from a writeup `section`.
 * Like HeroImage, it rests on the accent sheet unless `stack` says otherwise.
 */
export function HeroVideo({ src, section, title = 'Project video', stack, elevation = 'lifted', tilt = 0 }) {
  const { accent } = useProject();
  const text = useSection(section);
  return (
    <Surface
      as="figure"
      lift
      delay={0.1}
      elevation={elevation}
      stack={stack === false ? null : stack ?? accent}
      tilt={tilt}
      innerClassName="p-2.5 md:p-3"
    >
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
    </Surface>
  );
}
HeroVideo.heroLayout = 'full';
