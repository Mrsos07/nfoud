'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  slug: string | null;
}

export default function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from('news')
        .select('id, title, category, slug')
        .ilike('title', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(6);
      setResults(data || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const categoryMap: Record<string, string> = {
    politics: 'سياسية',
    economy: 'اقتصادية',
    local: 'محلية',
    sports: 'رياضية',
  };

  const handleSelect = (item: SearchResult) => {
    const articlePath = `/article/${item.slug || item.id}`;
    router.push(articlePath);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="text-gold p-2 hover:bg-secondary/10 rounded-lg transition-colors"
          aria-label="بحث"
        >
          <Search size={22} />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن خبر..."
              className="w-48 md:w-64 h-9 rounded-lg bg-secondary/20 border border-gold/30 text-primary-foreground placeholder:text-gold/50 px-3 pr-9 text-sm focus:outline-none focus:border-gold/60 transition-all"
              dir="rtl"
            />
            <Search size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gold/50" />
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              setQuery('');
              setResults([]);
            }}
            className="text-gold/70 hover:text-gold p-1 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 top-full mt-2 w-72 md:w-96 bg-primary border border-gold/20 rounded-xl shadow-elegant overflow-hidden z-50">
          {loading ? (
            <div className="p-4 text-center text-gold/60 text-sm">جاري البحث...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gold/60 text-sm">لا توجد نتائج</div>
          ) : (
            <ul>
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleSelect(item)}
                    className="w-full text-right px-4 py-3 hover:bg-secondary/10 transition-colors border-b border-gold/10 last:border-0"
                  >
                    <p className="text-primary-foreground text-sm font-medium line-clamp-2 leading-relaxed">
                      {item.title}
                    </p>
                    <span className="text-gold/60 text-xs mt-1 inline-block">
                      {categoryMap[item.category] || item.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
