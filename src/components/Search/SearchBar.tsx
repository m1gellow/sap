import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { fuzzySearch } from '../../lib/levenshtein';
import { Product } from '../../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, XIcon } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  products?: Product[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, products = [] }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = products
      .filter((product) => fuzzySearch(query, product.name, 2) || fuzzySearch(query, product.brand, 1))
      .slice(0, 5);

    setSuggestions(filtered);
    setFocusedIndex(-1);
  }, [query, products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      onSearch('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: Product) => {
    setQuery(suggestion.name);
    onSearch(suggestion.name);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[focusedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-[563px] mx-auto mt-4 mb-6" ref={searchRef}>
      <div className="relative">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Input
              ref={inputRef}
              className="h-12 pl-11 pr-10 rounded-[50px] border border-gray-200 w-full focus:border-blue focus:ring-2 focus:ring-blue focus:ring-opacity-50 transition-all"
              placeholder="Поиск по названию или бренду"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim() && setShowSuggestions(true)}
              autoComplete="off"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <SearchIcon className="w-5 h-5" />
            </div>

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ul>
                {suggestions.map((suggestion, index) => (
                  <motion.li
                    key={suggestion.id}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''
                    } ${index === focusedIndex ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md overflow-hidden border border-gray-100">
                        <img 
                          src={suggestion.image} 
                          alt={suggestion.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{suggestion.name}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{suggestion.brand}</div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};