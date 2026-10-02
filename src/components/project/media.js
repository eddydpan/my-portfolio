// Accepts a raw YouTube video id or any youtube.com / youtu.be URL (including Shorts)
export function youtubeId(value) {
  const match = String(value).match(
    /(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/
  );
  return match ? match[1] : String(value).trim();
}

export function youtubeEmbedUrl(value) {
  return `https://www.youtube-nocookie.com/embed/${youtubeId(value)}?rel=0`;
}

// Short label for a link, named after where it goes
export function linkLabel(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (host === 'github.com') return 'View code on GitHub';
    if (host.endsWith('github.io')) return 'Visit project site';
    if (host === 'docs.google.com') return 'View slides';
    return `Visit ${host}`;
  } catch {
    return 'Learn more';
  }
}
