import { getProjectBySlug } from '../../utils/loadProjects';
import ProjectPage from './ProjectPage';
import { HeroImage, Split, TextBlock } from './sections';

// Sections that embed a video or PDF need the full text width
const EMBEDS_MEDIA = /```(youtube|pdf)/;

/**
 * The page a project gets when it has no layout file of its own: the thumbnail beside the
 * title (in its own shape, since some thumbnails are diagrams), then every section and part in writeup order, paired with the gallery images in order
 * until they run out.
 */
export default function DefaultLayout({ slug }) {
  const { imageKey, galleryKeys, sections } = getProjectBySlug(slug);
  const images = galleryKeys.filter((key) => key !== imageKey);

  const blocks = sections.flatMap((section) =>
    section.parts.map((body, i) => {
      const key = `${section.key}-${i}`;
      const props = { section: section.heading ?? '', part: i + 1 };
      if (!EMBEDS_MEDIA.test(body) && images.length > 0) {
        return <Split key={key} {...props} image={images.shift()} />;
      }
      return <TextBlock key={key} {...props} />;
    })
  );

  return (
    <ProjectPage slug={slug} hero={imageKey ? <HeroImage image={imageKey} aspect="auto" /> : null}>
      {blocks}
    </ProjectPage>
  );
}
