import AnimatedShapes from './AnimatedShapes';

/**
 * AnimatedShapesSection renders a full-width section with animated shapes as the background.
 * Replaces the legacy TrianglesSection component with generic shape support.
 * 
 * Props:
 *   - shape: 'triangle', 'circle', 'square' (default: 'triangle')
 *   - color: color name or hex (default: 'red')
 *   - count: number of shapes (default: 12)
 *   - orientation: 'vertical' or 'horizontal' (default: 'horizontal')
 *   - height: CSS height, e.g., '100%', '400px' (default: '160px')
 *   - spreadX, spreadY: position spread config
 *   - className: additional CSS classes for the section wrapper
 */
export default function AnimatedShapesSection({
  shape = 'triangle',
  color = 'red',
  count = 12,
  orientation = 'horizontal',
  height = '160px',
  spreadX = { min: 0, max: 100 },
  spreadY = { min: 20, max: 80 },
  className = '',
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height }}>
      <AnimatedShapes
        shape={shape}
        color={color}
        count={count}
        orientation={orientation}
        height="100%"
        spreadX={spreadX}
        spreadY={spreadY}
      />
    </div>
  );
}
