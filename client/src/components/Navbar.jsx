import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Plane, CheckCircle } from 'lucide-react'; // Icons

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Helper to check active tab
  const isActive = (path) => location.pathname.includes(path) 
    ? "bg-gray-700 text-white" 
    : "text-gray-400 hover:text-white hover:bg-gray-800";

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
      {/* LEFT: Logo & Tabs */}
      <div className="flex items-center space-x-8">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          DayFlow
        </div>
        
        <div className="flex space-x-2">
          {user?.role === 'ADMIN' && (
            <Link to="/employees" className={`px-4 py-2 rounded-md text-sm font-medium transition ${isActive('/employees')}`}>
              Employees
            </Link>
          )}
          <Link to="/attendance" className={`px-4 py-2 rounded-md text-sm font-medium transition ${isActive('/attendance')}`}>
            Attendance
          </Link>
          <Link to="/leaves" className={`px-4 py-2 rounded-md text-sm font-medium transition ${isActive('/leaves')}`}>
            Time Off
          </Link>
        </div>
      </div>

      {/* RIGHT: Status & Profile */}
      <div className="flex items-center space-x-6">
        {/* Status Indicator (Hardcoded for now, dynamic later) */}
        <div className="flex items-center space-x-2 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          <span className="text-xs text-gray-300">Checked In</span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-700">
                <p className="text-sm text-white font-bold">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                My Profile
              </Link>
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;