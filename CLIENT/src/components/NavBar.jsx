import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Finance', path: '/finance' },
    { name: 'Deadline', path: '/deadline' },
    { name: 'Discussion', path: '/discussion' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-xl font-bold text-blue-600">MyApp</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} className="text-gray-600">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className="block text-gray-700 hover:text-blue-600 transition"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
