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
      title="Iron Man MK5 Helmet"
      intro={`Over the course of half a semester, my friends and I built this mockup of the Iron Man Mark-5 helmet. 
      We wanted it to have all the features the helmet has from the movies--especially the AI voice assistant, 
      AR Heads-Up Display (HUD), and mask actuation. After many sleepless nights, three prototype iterations, and 
      a rollercoaster of emotions, I present to you our take on the MK5 Helmet.`}
      galleryImages={[]}
      customDescription={<Description sections={descriptionSections} />}
      learnMoreLink="https://olincollege.github.io/pie-2024-03/iron-man/"
    />
  );
}
