import { useEffect, useId, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set worker to the public static file to avoid Vite build-time import resolution issues.
// The worker file is copied from node_modules to public/ during setup.
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

function Chevron({ open }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round"
      className={`h-5 w-5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const PAGE_BUTTON =
  'px-3 pt-2 pb-1.5 font-semibold text-ink ring-1 ring-ink/15 hover:bg-paper-shade disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt';

export default function PdfViewer({ src, initialPage = 1, title = 'Read the PDF' }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const frameRef = useRef(null);
  const panelId = useId();

  // Render pages at the width of their container so they fit on any screen
  useEffect(() => {
    if (!isOpen || !frameRef.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [isOpen]);

  // Guard: do not render when no src provided
  if (!src) return null;

  const onDocumentLoadSuccess = ({ numPages: n }) => {
    setNumPages(n);
    setError(null);
    if (pageNumber > n) setPageNumber(1);
  };

  const onDocumentLoadError = (err) => {
    console.error('PDF load error:', err);
    setError('The PDF could not be loaded here.');
  };

  return (
    <div className="my-6 w-full bg-paper ring-1 ring-ink/10">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 px-5 pt-4 pb-3.5 text-left font-semibold text-ink hover:bg-paper-shade focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cobalt"
      >
        <span>{title}</span>
        <Chevron open={isOpen} />
      </button>

      {isOpen && (
        <div id={panelId} className="border-t border-ink/10 p-3 md:p-4">
          {error ? (
            <p className="p-2 text-ink/80">
              {error}{' '}
              <a href={src} target="_blank" rel="noopener noreferrer" className="font-semibold text-cobalt underline underline-offset-[3px]">
                Open it in a new tab
              </a>
              .
            </p>
          ) : (
            <>
              <div ref={frameRef} className="max-h-[75vh] overflow-y-auto bg-paper-shade">
                <Document file={src} onLoadSuccess={onDocumentLoadSuccess} onError={onDocumentLoadError}>
                  {width > 0 && <Page pageNumber={pageNumber} width={width} renderTextLayer={false} />}
                </Document>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-ink/75">
                <span className="tabular-nums">Page {pageNumber}{numPages ? ` of ${numPages}` : ''}</span>
                <div className="flex items-center gap-2">
                  <a href={src} target="_blank" rel="noopener noreferrer" className="mr-2 font-semibold text-cobalt underline decoration-cobalt/35 underline-offset-[3px] hover:text-cobalt">
                    Open full PDF
                  </a>
                  <button
                    type="button"
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    className={PAGE_BUTTON}
                    disabled={pageNumber <= 1}
                  >Previous</button>
                  <button
                    type="button"
                    onClick={() => setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p + 1))}
                    className={PAGE_BUTTON}
                    disabled={Boolean(numPages) && pageNumber >= numPages}
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
