// components/layout/MobileNav.jsx
import React from 'react';
import { Menu, Code } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { authState } from '../../recoil/atoms/authAtom';

const MobileNav = ({ toggleSidebar }) => {
  const auth = useRecoilValue(authState);

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-4 lg:px-6 z-30">
      <button
        onClick={toggleSidebar}
        className="mr-4 text-gray-400 hover:text-white focus:outline-none"
      >
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="flex items-center">
        <Code className="h-6 w-6 text-blue-500 mr-2" />
        <h1 className="text-lg font-bold">DSA Assistant</h1>
      </div>
      
      <div className="ml-auto">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <span className="text-white font-semibold">{auth.user?.name?.charAt(0) || 'U'}</span>
        </div>
      </div>
    </header>
  );
};

export default MobileNav;