import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import Footer from './components/Footer';

export default function AnimatedLayout({ children }) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {children}
      <Footer />
    </motion.div>
  );
}
