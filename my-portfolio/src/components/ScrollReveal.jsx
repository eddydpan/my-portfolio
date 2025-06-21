import { motion } from 'motion/react';
import { animate, scroll } from 'motion';
import { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, className = '', ...props }) {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current || hasAnimated) return;

    scroll(
      () => {
        animate(
          ref.current,
          { opacity: [0, 1], y: [50, 0] },
          { duration: 0.6, easing: 'ease-out' }
        );
        setHasAnimated(true);
      },
      {
        target: ref.current,
        // Adjust offset here
        offset: ['bottom bottom'],
        once: true,
      }
    );
  }, [hasAnimated]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity: hasAnimated ? 1 : 0,
        transform: hasAnimated ? 'translateY(0)' : 'translateY(50px)',
        position: 'relative',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
