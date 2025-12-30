import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set worker to the public static file to avoid Vite build-time import resolution issues.
// The worker file is copied from node_modules to public/ during setup.
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PdfViewer({ src, initialPage = 1 }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [error, setError] = useState(null);

  // Guard: do not render when no src provided
  if (!src) return null;

  const onDocumentLoadSuccess = ({ numPages: n }) => {
    setNumPages(n);
    setError(null);
    if (pageNumber > n) setPageNumber(1);
  };

  const onDocumentLoadError = (err) => {
    console.error('PDF load error:', err);
    setError('Failed to load PDF file. The file may be inaccessible or corrupted.');
  };

  return (
    <div className="pdf-viewer w-full my-6">
      <div className="bg-white rounded shadow p-4">
        {error ? (
          <div className="text-red-600 text-sm p-2">{error}</div>
        ) : (
          <>
            <Document file={src} onLoadSuccess={onDocumentLoadSuccess} onError={onDocumentLoadError}>
              <Page pageNumber={pageNumber} width={800} />
            </Document>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <div>Page {pageNumber}{numPages ? ` / ${numPages}` : ''}</div>
              <div className="space-x-2">
                <button
                  onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                  className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  disabled={pageNumber <= 1}
                >Prev</button>
                <button
                  onClick={() => setPageNumber(p => (numPages ? Math.min(numPages, p + 1) : p + 1))}
                  className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  disabled={numPages && pageNumber >= numPages}
                >Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
