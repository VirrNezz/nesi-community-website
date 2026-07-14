import React, { createContext, useContext, useState, useEffect } from 'react';

const ScrollActiveContext = createContext<boolean>(false);

export const ScrollActiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isOverThreshold = window.scrollY > 20;
      setIsScrolled((prev) => (prev !== isOverThreshold ? isOverThreshold : prev));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initially
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ScrollActiveContext.Provider value={isScrolled}>
      {children}
    </ScrollActiveContext.Provider>
  );
};

export const useScrollActive = () => useContext(ScrollActiveContext);
