import profilePicture from '../assets/profile.jpg';

export default function AboutSection({ id }) {
  return (
    <div id={id} className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 bg-gray-100 text-gray-800">
      {/* About text */}
      <div className="md:w-5/8 w-full md:pr-8 mb-8 md:mb-0">
        <h2 className="text-4xl font-bold mb-4">About Me</h2>
        <p className="text-lg leading-relaxed">
          Hello! I'm [Your Name], a web developer with a passion for creating
          beautiful and functional web applications. I specialize in modern
          frameworks like React and Tailwind CSS, and I love solving complex
          problems with elegant solutions. When I'm not coding, you can find me
          exploring new technologies, reading, or enjoying the outdoors.
        </p>
      </div>

      {/* Profile picture */}
      <div className="md:w-3/8 w-full flex justify-center">
        <img
          src={profilePicture}
          alt="Profile"
          className="rounded-full w-48 h-48 object-cover shadow-lg"
        />
      </div>
    </div>
  );
}
