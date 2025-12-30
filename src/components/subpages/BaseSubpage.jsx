import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BaseSubpage({ title, intro, galleryImages, customDescription, learnMoreLink }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = Array.isArray(galleryImages) ? galleryImages : [];
  const len = images.length;

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowLeft') setCurrentIndex((i) => (i - 1 + len) % len);
      if (e.key === 'ArrowRight') setCurrentIndex((i) => (i + 1) % len);
    }
    if (len > 0) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [len]);

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
        {/* Gallery carousel - show single large image with arrows and dots */}
        {len > 0 && (
          <div className="mb-12">
            <div className="relative">
                  <div className="w-full h-96 bg-white rounded-lg overflow-hidden relative flex items-center justify-center border border-gray-200">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`${title} - Gallery Image ${currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5 }}
                      />
                    </AnimatePresence>
                  </div>

              {/* Prev button */}
              {len > 1 && (
                <button
                  onClick={() => setCurrentIndex((currentIndex - 1 + len) % len)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md"
                >
                  ‹
                </button>
              )}

              {/* Next button */}
              {len > 1 && (
                <button
                  onClick={() => setCurrentIndex((currentIndex + 1) % len)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md"
                >
                  ›
                </button>
              )}
            </div>

            {/* Dots */}
            {len > 1 && (
              <div className="mt-4 flex justify-center items-center space-x-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`w-3 h-3 rounded-full ${i === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            )}
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
