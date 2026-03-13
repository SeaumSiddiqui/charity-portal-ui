import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SearchResult {
  title: string;
  description: string;
  path: string;
  category: string;
}

export const Search: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const allPages: SearchResult[] = [
    { title: 'Home', description: 'Return to homepage', path: '/', category: 'Navigation' },
    { title: 'Orphan Campaign', description: 'Create new orphan application', path: '/applications/create', category: 'Programs' },
    { title: 'Orphan Applications', description: 'View all orphan applications', path: '/applications', category: 'Dashboard' },
    { title: 'Create User', description: 'Add new user to system', path: '/users/create', category: 'User Management' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = allPages.filter(page => {
      const searchTerm = query.toLowerCase();
      return (
        page.title.toLowerCase().includes(searchTerm) ||
        page.description.toLowerCase().includes(searchTerm) ||
        page.category.toLowerCase().includes(searchTerm)
      );
    });

    setResults(filtered);
  }, [query]);

  const handleResultClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  const handleOpenSearch = () => {
    setIsOpen(true);
  };

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={handleOpenSearch}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-900 dark:hover:border-secondary-500 transition-all duration-200"
        aria-label="Search"
      >
        <SearchIcon className="h-5 w-5" />
        <span className="hidden sm:inline text-sm font-medium">SEARCH</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm">
          <div className="flex items-start justify-center min-h-screen pt-20 px-4">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-down">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search pages, programs, or features..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 text-lg"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {query.trim() === '' ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <SearchIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Start typing to search...</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No results found for "{query}"</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {results.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleResultClick(result.path)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {result.title}
                              </h3>
                              <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-secondary-900/30 text-primary-900 dark:text-secondary-400">
                                {result.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {result.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Press <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs">ESC</kbd> to close
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
