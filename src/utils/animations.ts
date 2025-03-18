
import { useEffect, useRef, useState } from 'react';

// Detect when an element enters the viewport
export const useInView = (options = {}, once = true) => {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (once && ref.current) {
          observer.unobserve(ref.current);
        }
      } else if (!once) {
        setIsInView(false);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options, once]);

  return { ref, isInView };
};

// Smooth scroll to a section
export const scrollToSection = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 80, // Offset for fixed header
      behavior: 'smooth',
    });
  }
};

// Staggered animation for multiple elements
export const useStaggeredAnimation = (itemCount: number, baseDelay = 0.1) => {
  return Array.from({ length: itemCount }, (_, i) => ({
    style: { 
      opacity: 0,
      transform: 'translateY(20px)',
      animation: `fade-up 0.6s ease-out forwards`,
      animationDelay: `${baseDelay + i * 0.1}s`
    }
  }));
};
