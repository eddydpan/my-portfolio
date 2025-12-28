import { Link } from 'react-router-dom';

export default function BaseSubpage({ title, intro, galleryImages, customDescription, learnMoreLink }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Title */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">{title}</h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Gallery - only show if galleryImages exist and have items */}
        {galleryImages && galleryImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {galleryImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${title} - Gallery Image ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        {/* Markdown Content */}
        <div className="prose-custom">
          {customDescription}
        </div>

        {/* Learn More Link */}
        {learnMoreLink && (
          <div className="mt-12">
            <a
              href={learnMoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              More Information
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
