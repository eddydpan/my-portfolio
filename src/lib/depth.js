// Elevation for paper surfaces sitting on the field. Both lists have the same layers in the
// same order so motion can interpolate between them as a surface lifts off the page.
// Light comes from above: a tight contact shadow, a mid key shadow, and a long soft ambient one.
export const RAISED_SHADOW = [
  '0 1px 2px rgb(22 26 46 / 0.08)',
  '0 10px 22px -10px rgb(22 26 46 / 0.20)',
  '0 30px 56px -24px rgb(22 26 46 / 0.30)',
].join(', ');

export const RESTING_SHADOW = [
  '0 1px 1px rgb(22 26 46 / 0.06)',
  '0 2px 4px -2px rgb(22 26 46 / 0.06)',
  '0 4px 8px -6px rgb(22 26 46 / 0.04)',
].join(', ');

// A step further off the page, for hovered links and controls
export const LIFTED_SHADOW = [
  '0 2px 4px rgb(22 26 46 / 0.10)',
  '0 16px 30px -12px rgb(22 26 46 / 0.26)',
  '0 40px 70px -28px rgb(22 26 46 / 0.34)',
].join(', ');

// Exponential ease-out shared by entrances on the project pages
export const SETTLE_EASE = [0.16, 1, 0.3, 1];

// Shadow for the colored sheet tucked under a hero surface, matching About Me's under-sheets
export const UNDER_SHEET_SHADOW = [
  '0 8px 16px -6px rgb(22 26 46 / 0.22)',
  '0 28px 48px -16px rgb(22 26 46 / 0.30)',
].join(', ');

// Highest step, for the one surface a page wants to float above the rest
export const FLOATING_SHADOW = [
  '0 3px 6px rgb(22 26 46 / 0.10)',
  '0 24px 44px -14px rgb(22 26 46 / 0.30)',
  '0 60px 100px -36px rgb(22 26 46 / 0.40)',
].join(', ');

export const ELEVATION = {
  flat: RESTING_SHADOW,
  raised: RAISED_SHADOW,
  lifted: LIFTED_SHADOW,
  floating: FLOATING_SHADOW,
};

// The same steps as drop-shadow filters, for clipped shapes that can't carry a box-shadow
export const ELEVATION_FILTER = {
  flat: 'drop-shadow(0 2px 3px rgb(22 26 46 / 0.08))',
  raised: 'drop-shadow(0 10px 12px rgb(22 26 46 / 0.14)) drop-shadow(0 24px 28px rgb(22 26 46 / 0.12))',
  lifted: 'drop-shadow(0 14px 16px rgb(22 26 46 / 0.18)) drop-shadow(0 34px 36px rgb(22 26 46 / 0.16))',
  floating: 'drop-shadow(0 20px 22px rgb(22 26 46 / 0.20)) drop-shadow(0 50px 50px rgb(22 26 46 / 0.20))',
};
