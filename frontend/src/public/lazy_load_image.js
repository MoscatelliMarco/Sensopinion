import 'intersection-observer';

export function lazyLoad(node) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target;
            const src = image.dataset.src;
            // Replace the placeholder with the actual src
            image.src = src;
            // Stop observing the image
            observer.unobserve(image);
          }
        });
      });
  
      observer.observe(node);
      return {
        destroy() {
          observer.unobserve(node);
        }
      };
    }
  }