import { motion, useReducedMotion } from 'motion/react';
import { RAISED_SHADOW, RESTING_SHADOW, SETTLE_EASE } from '../../lib/depth';

/**
 * A paper surface raised off the field. Text boxes and image frames share it, so their edges
 * and shadows match. With `lift`, it is the page's moment of motion: always visible, it lifts
 * the last few pixels into place as it scrolls into view while its shadow deepens, like a
 * sheet picked up off the table. Hero media and full-width breaks lift; everything else is
 * already settled.
 */
export default function Raised({ as = 'div', lift = false, delay = 0, className = '', children, ...rest }) {
  const reduceMotion = useReducedMotion();
  const surface = `bg-paper ring-1 ring-ink/[0.06] ${className}`;

  if (!lift || reduceMotion) {
    const Tag = as;
    return (
      <Tag className={surface} style={{ boxShadow: RAISED_SHADOW }} {...rest}>
        {children}
      </Tag>
    );
  }

  const Component = motion[as];
  return (
    <Component
      className={surface}
      initial={{ y: 18, boxShadow: RESTING_SHADOW }}
      whileInView={{ y: 0, boxShadow: RAISED_SHADOW }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: SETTLE_EASE, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}
