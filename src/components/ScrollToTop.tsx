'use client';
import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.pageYOffset > 400);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-night-800 border border-line text-ink hover:border-line-lit shadow-lift flex items-center justify-center transition-all duration-250 ease-out-soft hover:scale-110 active:scale-95"
      aria-label="Retour en haut"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
}
