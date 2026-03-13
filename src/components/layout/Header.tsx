import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { UserMenu } from '../ui/UserMenu';
import { Search } from '../ui/Search';
import { RoleBasedAccess, StaffOnly, UserOnly, AdminOrAgent } from '../auth/RoleBasedAccess';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  isMobileMenuOpen
}) => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseEnter = (dropdown: string) => {
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
    setOpenSubmenu(null);
  };

  const handleSubmenuEnter = (submenu: string) => {
    setOpenSubmenu(submenu);
  };

  const handleSubmenuLeave = () => {
    setOpenSubmenu(null);
  };

  return (
    <header className="relative z-50">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-900 dark:bg-secondary-500 rounded-lg">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Qatar Charity
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bangladesh
                </p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Search />

              <ThemeToggle />

                {isAuthenticated ? (
                  <div className="hidden md:block">
                    <UserMenu />
                  </div>
                ) : (
                  <Button
                    onClick={login}
                    variant="ghost"
                    //className="bg-primary-900 text-white hover:bg-primary-800 dark:bg-secondary-500 dark:hover:bg-secondary-600 hidden md:inline-flex"
                  className="bg-none text-primary-900 hover:bg-primary-900 hover:text-white font-semibold transition-all duration-300 hidden md:inline-flex"
                  >
                    Sign In
                  </Button>
                )}

                <button
                  onClick={onMenuToggle}
                  className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary-900 hover:bg-gray-100 dark:hover:text-secondary-500 dark:hover:bg-gray-800 transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20"></div>

      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex items-center justify-center h-14 space-x-8">
            <Link
              to="/"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 transition-colors duration-200 border-b-2 border-transparent hover:border-primary-900 dark:hover:border-secondary-500 h-full flex items-center"
            >
              HOME
            </Link>

            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('programs')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 transition-colors duration-200 h-full border-b-2 border-transparent hover:border-primary-900 dark:hover:border-secondary-500">
                PROGRAMS
              </button>
              {openDropdown === 'programs' && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-white dark:bg-gray-800 rounded-b-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[100]">
                  <div className="py-2">
                    <StaffOnly>
                      <Link
                        to="/applications/create"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Orphan Campaign
                      </Link>
                    </StaffOnly>
                    <StaffOnly>
                      <div
                        className="relative"
                        onMouseEnter={() => handleSubmenuEnter('medical')}
                        onMouseLeave={handleSubmenuLeave}
                      >
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <span>Medical Support</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        {openSubmenu === 'medical' && (
                          <div className="absolute left-full top-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[101]">
                            <div className="py-2">
                              <Link
                                to="/medical/heart-surgery/create"
                                className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                              >
                                Heart Surgery
                              </Link>
                              <Link
                                to="/medical/eye-surgery/create"
                                className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                              >
                                Eye Surgery
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </StaffOnly>
                    <UserOnly>
                      <Link
                        to="/applications/create"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        My Enrollments
                      </Link>
                    </UserOnly>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('dashboard')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 transition-colors duration-200 h-full border-b-2 border-transparent hover:border-primary-900 dark:hover:border-secondary-500">
                DASHBOARD
              </button>
              {openDropdown === 'dashboard' && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-white dark:bg-gray-800 rounded-b-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[100]">
                  <div className="py-2">
                    <StaffOnly>
                      <Link
                        to="/applications"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Orphan Applications
                      </Link>
                    </StaffOnly>
                    <StaffOnly>
                      <Link
                        to="/medical/heart-surgery"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Heart Surgery Applications
                      </Link>
                    </StaffOnly>
                    <StaffOnly>
                      <Link
                        to="/medical/eye-surgery"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Eye Surgery Applications
                      </Link>
                    </StaffOnly>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('user')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 transition-colors duration-200 h-full border-b-2 border-transparent hover:border-primary-900 dark:hover:border-secondary-500">
                USER
              </button>
              {openDropdown === 'user' && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-white dark:bg-gray-800 rounded-b-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[100]">
                  <div className="py-2">
                    <AdminOrAgent>
                      <Link
                        to="/users/create"
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Create User
                      </Link>
                    </AdminOrAgent>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={scrollToFooter}
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 transition-colors duration-200 border-b-2 border-transparent hover:border-primary-900 dark:hover:border-secondary-500 h-full flex items-center"
            >
              ABOUT
            </button>

            <Link
              to="/notices"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 transition-colors duration-200 border-b-2 border-transparent hover:border-primary-900 dark:hover:border-secondary-500 h-full flex items-center"
            >
              NOTICE
            </Link>
          </nav>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden animate-slide-down bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <div className="px-3 py-2 mb-3">
                <UserMenu />
              </div>
            ) : (
              <div className="px-3 py-2 mb-3">
                <Button
                  onClick={login}
                  variant="primary"
                  size="sm"
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
            )}

            <Link
              to="/"
              className="block px-3 py-2 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
            >
              HOME
            </Link>

            <div className="space-y-1">
              <div className="px-3 py-2 text-sm font-bold text-gray-900 dark:text-white">
                PROGRAMS
              </div>
              <StaffOnly>
                <Link
                  to="/applications/create"
                  className="block px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
                  Orphan Campaign
                </Link>
              </StaffOnly>
              <StaffOnly>
                <div className="px-6 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Medical Support
                </div>
                <Link
                  to="/medical/heart-surgery/create"
                  className="block px-9 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
                  Heart Surgery
                </Link>
                <Link
                  to="/medical/eye-surgery/create"
                  className="block px-9 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
                  Eye Surgery
                </Link>
              </StaffOnly>
              <UserOnly>
                <Link
                  to="/applications/create"
                  className="block px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
                  My Enrollments
                </Link>
              </UserOnly>
            </div>

            <div className="space-y-1">
              <div className="px-3 py-2 text-sm font-bold text-gray-900 dark:text-white">
                DASHBOARD
              </div>
              <StaffOnly>
                <Link
                  to="/applications"
                  className="block px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
                  Orphan Applications
                </Link>
              </StaffOnly>
              <StaffOnly>
                <Link
                  to="/medical/heart-surgery"
                  className="block px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
                  Heart Surgery Applications
                </Link>
              </StaffOnly>
              <StaffOnly>
                <Link
                  to="/medical/eye-surgery"
                  className="block px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
                  Eye Surgery Applications
                </Link>
              </StaffOnly>
            </div>

            <div className="space-y-1">
              <div className="px-3 py-2 text-sm font-bold text-gray-900 dark:text-white">
                USER
              </div>
              <AdminOrAgent>
                <Link
                  to="/users/create"
                  className="block px-6 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                >
                  Create User
                </Link>
              </AdminOrAgent>
            </div>

            <button
              onClick={scrollToFooter}
              className="block w-full text-left px-3 py-2 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
            >
              ABOUT
            </button>

            <Link
              to="/notices"
              className="block px-3 py-2 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-900 dark:hover:text-secondary-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
            >
              NOTICE
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
