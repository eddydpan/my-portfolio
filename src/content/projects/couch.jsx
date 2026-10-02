import { ProjectPage, HeroVideo, Split, Wide, TextBlock } from '../../components/project';

// Layout for couch.md. Each `section` names a `##` heading there; `part` picks a piece split by `---`.
export default function Couch() {
  return (
    <ProjectPage hero={<HeroVideo src="https://youtu.be/RcAKfHjtkew" section="Hype Video" title="COUCH hype video" />}>
      <Split section="Overview" image="couch-debugging-candid" />
      <Wide image="couch-final-photoshoot" aspect="21/9" focus="center 62%" />
      <TextBlock section="Reflections" part={1} side="left" />
      <TextBlock section="Reflections" part={2} side="right" heading={false} />
      <Split section="Visibility" image="couch-pre-drive" emphasis="image" side="right" />
    </ProjectPage>
  );
}
