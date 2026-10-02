import { ProjectPage, HeroImage, Split, Wide, TextBlock } from '../../components/project';

// Layout for chess-robot.md. Each `section` names a `##` heading there; `part` picks a piece split by `---`.
export default function ChessRobot() {
  return (
    <ProjectPage hero={<HeroImage image="chess-bot-action" still="chess-bot-action-still" aspect="4/5" focus="center 35%" />}>
      <TextBlock section="Overview" part={1} side="left" />
      <Split section="Overview" part={2} image="chess-bot-sim" fit="contain" emphasis="image" side="right" />
      <Split section="Overview" part={3} image="chess-grid-segmentation" side="left" />
      <Wide image="bettafish-sys-arch" />
      <TextBlock section="Documentation" side="right" />
    </ProjectPage>
  );
}
