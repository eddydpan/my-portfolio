import BaseSubpage from '../BaseSubpage';
import Description from '../Description';
import galleryImage1 from '../../../assets/project3.png';

export default function BettaFishChessPlayerSubpage() {
  const descriptionSections = [
    {
      header: 'Features',
      content: `WidowX-2500 Robot Manipulator
                Hardware integration
                Game logic / orchestration
                computational setup nightmare`,
    },
    {
      header: 'Motivations',
      content: 'Inspired by the success of Stockfish, BettaFish Chess Player aims to make advanced chess strategies accessible to everyone.',
    },
    {
      header: 'Next Steps',
      content: 'Future plans include integrating AI-based opponent modeling and support for online multiplayer games.',
    },
  ];

  return (
    <BaseSubpage
      title="BettaFish Chess Player"
      intro="BettaFish Chess Player is an advanced chess engine inspired by Stockfish. It leverages cutting-edge algorithms to analyze millions of moves and provide the best possible strategies for players of all levels."
      galleryImages={[galleryImage1]} // Only project3.png is included
      customDescription={<Description sections={descriptionSections} />}
      learnMoreLink="/portfolio/bettafish-chess-player/details"
    />
  );
}
