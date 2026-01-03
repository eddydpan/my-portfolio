import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import NAV_ITEMS from '../config/navigation';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
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
    </header>
  );
}
