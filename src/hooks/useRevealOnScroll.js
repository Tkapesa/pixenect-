import { useEffect } from 'react';

function useRevealOnScroll(deps = []) {
  useEffect(() => {
    const animated = document.querySelectorAll('[data-reveal]');
    if (!animated.length) return undefined;

    animated.forEach((el) => el.removeAttribute('data-revealed'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', 'true');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );

    animated.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, deps);
}

export default useRevealOnScroll;
