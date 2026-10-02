import { createContext, useContext } from 'react';
import { resolveImageSrc, sectionKey } from '../../utils/loadProjects';

export const ProjectContext = createContext(null);

export function useProject() {
  const project = useContext(ProjectContext);
  if (!project) throw new Error('Project section components must be rendered inside <ProjectPage>');
  return project;
}

/**
 * Looks up a `##` section of the current writeup by its heading (case-insensitive).
 * `part` is 1-based and picks one `---`-separated piece; leave it out for the whole section.
 * Returns { heading, body, missing }, and records the lookup so ProjectPage can warn about
 * writeup text that no component on the page renders.
 */
export function useSection(name, part) {
  const { sections, usedParts, file } = useProject();
  if (name == null) return { heading: null, body: '', missing: false };

  const section = sections.find((s) => s.key === sectionKey(name));
  if (!section) return { heading: null, body: '', missing: `No "## ${name}" section in ${file}.md` };

  if (part == null) {
    section.parts.forEach((_, i) => usedParts.add(`${section.key}#${i + 1}`));
    return { heading: section.heading, body: section.parts.join('\n\n'), missing: false };
  }

  const body = section.parts[part - 1];
  if (body == null) {
    const count = section.parts.length;
    return {
      heading: section.heading,
      body: '',
      missing: `"## ${name}" has ${count} part${count === 1 ? '' : 's'}; there is no part ${part}`,
    };
  }
  usedParts.add(`${section.key}#${part}`);
  return { heading: section.heading, body, missing: false };
}

/** Resolves an asset name from src/assets to its URL, plus its caption from the frontmatter. */
export function useMedia(name) {
  const { frontmatter } = useProject();
  if (!name) return { src: null, caption: null };
  return { src: resolveImageSrc(name), caption: frontmatter.captions?.[name] ?? null };
}
