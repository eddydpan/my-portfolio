import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { motion } from 'motion/react';
import NAV_ITEMS from '../config/navigation';

export default function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [pastLanding, setPastLanding] = useState(!isHome);
  const [hasFocus, setHasFocus] = useState(false);

  // On the home page the header stays tucked away until the visitor scrolls past the landing screen
  useEffect(() => {
    if (!isHome) {
      setPastLanding(true);
      return;
    }
    const update = () => setPastLanding(window.scrollY > window.innerHeight * 0.85);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isHome]);

  // Keyboard users tabbing into the nav still get to see it
  const visible = pastLanding || hasFocus;

  return (
    <motion.header
      initial={false}
      animate={{ y: visible ? '0%' : 'calc(-100% - 8px)' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onFocus={() => setHasFocus(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHasFocus(false);
      }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm"
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Name */}
          <Link to="/" className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
            Eddy Pan
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            {NAV_ITEMS.map((item) => (
              <HashLink
                key={item.name}
                smooth
                to={item.path}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {item.name}
              </HashLink>
            ))}
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
