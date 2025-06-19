import BaseSubpage from '../BaseSubpage';
import Description from '../Description';
// import galleryImage1 from '../../assets/ironman1.png';
// import galleryImage2 from '../../assets/ironman2.png';

export default function IronManSubpage() {
  const descriptionSections = [
    {
      header: 'Features',
      content: 'Real-time motion tracking, voice-controlled commands, and an integrated heads-up display (HUD) for enhanced situational awareness.',
    },
    {
      header: 'Technologies Used',
      content: 'Python, TensorFlow, and ROS (Robot Operating System) were used to develop the AI-powered suit.',
    },
    {
      header: 'Future Plans',
      content: 'The next iteration will include advanced exoskeleton support and integration with AR/VR technologies.',
    },
  ];

  return (
    <BaseSubpage
      title="Iron Man Project"
      intro="The Iron Man Project is a cutting-edge AI-powered suit designed to enhance human capabilities. It combines advanced robotics, machine learning, and state-of-the-art materials."
      galleryImages={[]} // No images for now
      customDescription={<Description sections={descriptionSections} />}
      learnMoreLink="/portfolio/iron-man/details"
    />
  );
}
