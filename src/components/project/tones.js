// Colors a surface (text box, image frame, stacked sheet) can take, and how text reads on each.
// `text`, `strong`, `link`, and `mark` feed the Markdown inside a text box, so every pairing
// keeps body text at 4.5:1 or better.
const INK_TEXT = { text: 'rgb(22 26 46 / 0.82)', strong: 'var(--color-ink)', link: 'var(--color-cobalt)', mark: 'var(--color-cobalt)' };
const LIGHT_TEXT = { text: 'var(--color-paper)', strong: 'var(--color-paper)', link: 'var(--color-paper)', mark: 'rgb(255 255 255 / 0.75)' };

export const TONES = {
  paper: { bg: 'var(--color-paper)', ...INK_TEXT },
  shade: { bg: 'var(--color-paper-shade)', ...INK_TEXT },
  field: { bg: 'var(--color-field)', ...INK_TEXT },
  sun: { bg: 'var(--color-sun)', text: 'var(--color-ink)', strong: 'var(--color-ink)', link: 'var(--color-ink)', mark: 'var(--color-ink)' },
  cobalt: { bg: 'var(--color-cobalt)', ...LIGHT_TEXT },
  signal: { bg: 'var(--color-signal-deep)', ...LIGHT_TEXT },
  ink: { bg: 'var(--color-ink)', ...LIGHT_TEXT, link: 'var(--color-sun)', mark: 'var(--color-sun)' },
};

export const toneOf = (name) => TONES[name] ?? TONES.paper;

// A sheet or band color: a tone name, or any CSS color
export const colorOf = (value) => TONES[value]?.bg ?? value;
