import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set worker to the public static file to avoid Vite build-time import resolution issues.
// The worker file is copied from node_modules to public/ during setup.
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PdfViewer({ src, initialPage = 1, title = 'PDF' }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

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
    <div className="pdf-viewer my-6 w-full">
      {/* Collapsible header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded px-4 py-3 text-left transition-colors"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <span className="text-indigo-600 text-lg">{isCollapsed ? '▶' : '▼'}</span>
      </button>

      {/* Collapsible content */}
      {!isCollapsed && (
        <div className="bg-white rounded-b shadow-md p-4 border border-t-0 border-indigo-200 mt-0">
          {error ? (
            <div className="text-red-600 text-sm p-2">{error}</div>
          ) : (
            <>
              <div style={{ maxHeight: '600px', overflowY: 'auto', marginBottom: '1rem' }}>
                <Document file={src} onLoadSuccess={onDocumentLoadSuccess} onError={onDocumentLoadError}>
                  <Page pageNumber={pageNumber} width={800} renderTextLayer={false} />
                </Document>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>Page {pageNumber}{numPages ? ` / ${numPages}` : ''}</div>
                <div className="space-x-2">
                  <button
                    onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                    className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                    disabled={pageNumber <= 1}
                  >Prev</button>
                  <button
                    onClick={() => setPageNumber(p => (numPages ? Math.min(numPages, p + 1) : p + 1))}
                    className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                    disabled={numPages && pageNumber >= numPages}
                  >Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
