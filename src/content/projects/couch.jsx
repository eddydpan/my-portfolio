import { ProjectPage, HeroVideo, Split, Wide, TextBlock } from '../../components/project';

// Layout for couch.md. Each `section` names a `##` heading there; `part` picks a piece split by `---`.
// Looks (tone, shape, elevation, stack, tilt, size, width) are listed in components/project/sections.jsx.
export default function Couch() {
  return (
    <ProjectPage hero={<HeroVideo src="https://youtu.be/RcAKfHjtkew" section="Hype Video" title="COUCH hype video" />}>
      <Split section="Overview" image="couch-debugging-candid" imageTilt={2} imageStack="shade" />
      <Wide image="couch-final-photoshoot" aspect="21/9" focus="center 62%" />
      <TextBlock section="Reflections" part={1} side="left" tone="cobalt" shape="arch" />
      <TextBlock section="Reflections" part={2} side="right" heading={false} elevation="lifted" stack="shade" />
      <Split section="Visibility" image="couch-pre-drive" emphasis="image" side="right" tone="sun" size="lg" />
    </ProjectPage>
  );
}
