import { Link } from 'react-router-dom';

export default function BaseSubpage({ title, intro, galleryImages, customDescription, learnMoreLink }) {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {/* Title */}
        <div className="p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
          <p className="text-gray-600 text-lg mb-6">{intro}</p>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6">
          {galleryImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${title} - Gallery Image ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>

        {/* Custom Description */}
        <div className="p-6">
          {customDescription}

          {/* Learn More Link */}
          {learnMoreLink && (
            <Link
              to={learnMoreLink}
              className="inline-block px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition mt-6"
            >
              Learn More
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
