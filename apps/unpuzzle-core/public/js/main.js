

// Add smooth scrolling to all links
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
};

// Add active class to current navigation item
const initActiveNav = () => {
    const currentLocation = location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });
};

// Initialize all features
const init = () => {
    initSmoothScroll();
    initActiveNav();

    // Add loading state to all links
    document.querySelectorAll('a[href]').forEach(elem => {
        elem.addEventListener('click', (e) => {
            document.body.classList.add('loading');
            setTimeout(() => {
                document.body.classList.remove('loading');
            }, 3000);
        });
    });

    
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
            }
        });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.classList.add('loaded');
        });
    }

};

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

export { initSmoothScroll, initActiveNav, init }; 