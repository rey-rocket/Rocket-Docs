/**
 * Rocket Learning Rewards - Custom JavaScript
 * Enhanced interactions and CedarOS-inspired behaviors
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== ENHANCED NAVIGATION CARDS =====
    const navCards = document.querySelectorAll('.nav-card');
    navCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px) scale(1)';
        });
    });

    // ===== PROGRESS BAR ANIMATIONS =====
    const progressBars = document.querySelectorAll('.progress-bar__fill');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.dataset.progress || '0%';
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 200);
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => {
        // Store original width and set to 0
        const targetWidth = getComputedStyle(bar).width;
        bar.dataset.progress = targetWidth;
        bar.style.width = '0%';
        progressObserver.observe(bar);
    });

    // ===== ANIMATED COUNTERS =====
    const statNumbers = document.querySelectorAll('.stat-item__number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }
                }, 16);
                
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    statNumbers.forEach(counter => {
        counterObserver.observe(counter);
    });

    // ===== ENHANCED SEARCH EXPERIENCE =====
    const searchInput = document.querySelector('.md-search__input');
    if (searchInput) {
        // Add search suggestions enhancement
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('md-search--focused');
        });
        
        searchInput.addEventListener('blur', function() {
            setTimeout(() => {
                this.parentElement.classList.remove('md-search--focused');
            }, 200);
        });
    }

    // ===== TABLE OF CONTENTS HIGHLIGHTING =====
    const tocLinks = document.querySelectorAll('.md-nav--secondary .md-nav__link');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all TOC links
                tocLinks.forEach(link => link.classList.remove('md-nav__link--active'));
                
                // Add active class to corresponding TOC link
                const headingId = entry.target.id;
                if (headingId) {
                    const tocLink = document.querySelector(`.md-nav--secondary a[href="#${headingId}"]`);
                    if (tocLink) {
                        tocLink.classList.add('md-nav__link--active');
                    }
                }
            }
        });
    }, {
        rootMargin: '-50px 0px -50px 0px',
        threshold: 0.5
    });

    headings.forEach(heading => {
        headingObserver.observe(heading);
    });

    // ===== MOBILE NAVIGATION ENHANCEMENTS =====
    const mobileNavToggle = document.querySelector('.md-nav__toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('change', function() {
            document.body.classList.toggle('nav-open', this.checked);
        });
    }

    // ===== KEYBOARD NAVIGATION IMPROVEMENTS =====
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile navigation
        if (e.key === 'Escape') {
            const mobileNavToggle = document.querySelector('.md-nav__toggle');
            if (mobileNavToggle && mobileNavToggle.checked) {
                mobileNavToggle.checked = false;
                document.body.classList.remove('nav-open');
            }
        }
        
        // Ctrl/Cmd + K opens search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.md-search__input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });

    // ===== LAZY LOADING ENHANCEMENTS =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
                
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                });
            }
        });
    }, {
        rootMargin: '50px 0px'
    });

    lazyImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });

    // ===== COPY CODE BUTTON ENHANCEMENTS =====
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const button = block.parentElement.querySelector('.md-clipboard');
        if (button) {
            button.addEventListener('click', function() {
                // Add visual feedback
                this.innerHTML = '✓';
                this.style.color = 'var(--success-green)';
                
                setTimeout(() => {
                    this.innerHTML = '📋';
                    this.style.color = '';
                }, 2000);
            });
        }
    });

    // ===== THEME TOGGLE ENHANCEMENTS =====
    const themeToggle = document.querySelector('[data-md-component="palette"]');
    if (themeToggle) {
        // Store user's theme preference
        const currentTheme = localStorage.getItem('theme') || 'default';
        
        themeToggle.addEventListener('change', function(e) {
            const theme = e.target.checked ? 'slate' : 'default';
            localStorage.setItem('theme', theme);
            
            // Add smooth transition
            document.documentElement.style.transition = 'color 0.3s ease, background-color 0.3s ease';
            
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 300);
        });
    }

    // ===== CONTENT FADE-IN ANIMATION =====
    const contentElements = document.querySelectorAll('.md-content__inner > *');
    contentElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // ===== SCROLL TO TOP BUTTON =====
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: var(--rocket-orange);
        color: var(--white);
        border: none;
        font-size: 1.25rem;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Scroll-dependent code here
        }, 10);
    });
    
    // Preload critical resources
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    ];
    
    criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    });

    console.log('🚀 Rocket Learning Rewards documentation enhanced!');
});

// ===== UTILITY FUNCTIONS =====

// Smooth scroll to element
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        const top = element.offsetTop - offset;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}