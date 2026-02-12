import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiGlobe,
  FiChevronDown
} from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownOpen && !event.target.closest('.language-dropdown')) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langDropdownOpen]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    setLangDropdownOpen(false);
    setIsOpen(false); // Close mobile menu when language changes
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate first then scroll
      window.location.href = `/#${sectionId}`;
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsOpen(false);
  };

  const navLinks = [
    { id: 'home', label: t('nav.home'), action: () => scrollToSection('home') },
    { id: 'about', label: t('nav.about'), action: () => scrollToSection('about') },
    { id: 'professional-summary', label: 'Services', action: () => scrollToSection('professional-summary') },
    { id: 'skills', label: t('nav.skills'), action: () => scrollToSection('skills') },
    { id: 'projects', label: t('nav.projects'), action: () => scrollToSection('projects') },
    { id: 'experience', label: t('nav.experience'), action: () => scrollToSection('experience') },
    { id: 'contact', label: t('nav.contact'), action: () => scrollToSection('contact') }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button 
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.location.href = '/';
              }
            }}
            className="flex items-center cursor-pointer"
          >
            <img 
              src="/images/logo.jpeg" 
              alt="Omar Zouglah Logo" 
              className="h-10 w-10 md:h-12 md:w-12 rounded-lg object-cover"
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={link.action}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/' && window.location.hash === `#${link.id}`
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Language Switcher */}
            <div className="relative ml-4 language-dropdown">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FiGlobe className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentLanguage.code.toUpperCase()}
                </span>
                <FiChevronDown className={`w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          i18n.language === lang.code
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <div className="flex-1">
                          <div className="font-medium">{lang.name}</div>
                          <div className="text-xs opacity-75">{lang.code.toUpperCase()}</div>
                        </div>
                        {i18n.language === lang.code && (
                          <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* Auth Links */}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {t('nav.admin')}
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiUser className="w-5 h-5" />
                <span>{t('nav.login')}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="container-custom py-4 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={link.action}
                  className={`block w-full text-left py-2 text-sm font-medium ${
                    location.pathname === '/' && window.location.hash === `#${link.id}`
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="relative language-dropdown">
                  <button
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                  >
                    <FiGlobe className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {currentLanguage.code.toUpperCase()}
                    </span>
                    <FiChevronDown className={`w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {langDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              i18n.language === lang.code
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span className="text-xl">{lang.flag}</span>
                            <div className="flex-1">
                              <div className="font-medium">{lang.name}</div>
                              <div className="text-xs opacity-75">{lang.code.toUpperCase()}</div>
                            </div>
                            {i18n.language === lang.code && (
                              <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                >
                  {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>
              </div>

              {isAuthenticated ? (
                <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 bg-primary-600 text-white rounded-lg text-center"
                    >
                      {t('nav.admin')}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 bg-primary-600 text-white rounded-lg text-center"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
