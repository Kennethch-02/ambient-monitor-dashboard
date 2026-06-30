// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Environmental Monitor
          </h1>
          <ThemeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;