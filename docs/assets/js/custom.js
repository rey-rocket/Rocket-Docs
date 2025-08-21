// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Rocket Documentation Loaded');
    
    // Initialize all interactive components
    initScrollAnimations();
    initProgressBars();
    initInteractiveChecklists();
    initMetricsCounters();
    initTabSwitcher();
    initTooltips();
    initSmoothScrolling();
    initSearchEnhancements();
    initThemeToggle();
    initNavigationHighlight();
    initIconFallbacks();
    
    // Add loading complete class for CSS animations
    document.body.classList.add('loaded');
});

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for different element types
                if (entry.target.classList.contains('metric-card')) {
                    animateMetricCard(entry.target);
                } else if (entry.target.classList.contains('progress-container')) {
                    animateProgressBar(entry.target);
                } else if (entry.target.classList.contains('feature-card')) {
                    animateFeatureCard(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(`
        .hero-section, 
        .metric-card, 
        .feature-card, 
        .success-story, 
        .progress-container,
        .timeline-item,
        .implementation-checklist,
        .process-step
    `);

    animatableElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== PROGRESS BARS =====
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const percentage = bar.getAttribute('data-progress') || '0';
        bar.style.width = '0%';
        
        // Store the target percentage for animation
        bar.dataset.targetProgress = percentage;
    });
}

function animateProgressBar(container) {
    const progressFill = container.querySelector('.progress-fill');
    const percentageDisplay = container.querySelector('.progress-percentage');
    
    if (!progressFill) return;
    
    const targetProgress = parseInt(progressFill.dataset.targetProgress) || 0;
    let currentProgress = 0;
    
    const animation = setInterval(() => {
        currentProgress += 2;
        
        if (currentProgress >= targetProgress) {
            currentProgress = targetProgress;
            clearInterval(animation);
        }
        
        progressFill.style.width = currentProgress + '%';
        if (percentageDisplay) {
            percentageDisplay.textContent = currentProgress + '%';
        }
    }, 20);
}

// ===== INTERACTIVE CHECKLISTS =====
function initInteractiveChecklists() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            this.classList.toggle('checked');
            
            const textElement = this.nextElementSibling;
            if (textElement) {
                textElement.classList.toggle('completed');
            }
            
            // Update progress if this is part of a checklist
            updateChecklistProgress(this.closest('.implementation-checklist'));
            
            // Add satisfying animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

function updateChecklistProgress(checklist) {
    if (!checklist) return;
    
    const checkboxes = checklist.querySelectorAll('.checklist-checkbox');
    const checkedBoxes = checklist.querySelectorAll('.checklist-checkbox.checked');
    
    const progress = Math.round((checkedBoxes.length / checkboxes.length) * 100);
    
    const progressContainer = checklist.querySelector('.progress-container');
    if (progressContainer) {
        const progressFill = progressContainer.querySelector('.progress-fill');
        const progressPercentage = progressContainer.querySelector('.progress-percentage');
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressPercentage) progressPercentage.textContent = progress + '%';
    }
}

// ===== METRICS COUNTERS =====
function initMetricsCounters() {
    const metricNumbers = document.querySelectorAll('.metric-number');
    
    metricNumbers.forEach(metric => {
        const text = metric.textContent;
        const number = parseFloat(text.replace(/[^\d.]/g, ''));
        
        if (!isNaN(number)) {
            metric.dataset.targetNumber = number;
            metric.dataset.originalText = text;
            metric.textContent = text.replace(number, '0');
        }
    });
}

function animateMetricCard(card) {
    const metricNumber = card.querySelector('.metric-number');
    if (!metricNumber || !metricNumber.dataset.targetNumber) return;
    
    const targetNumber = parseFloat(metricNumber.dataset.targetNumber);
    const originalText = metricNumber.dataset.originalText;
    let currentNumber = 0;
    
    const increment = targetNumber / 50; // 50 steps for smooth animation
    
    const counter = setInterval(() => {
        currentNumber += increment;
        
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(counter);
        }
        
        // Update display with original formatting
        const displayNumber = Math.round(currentNumber);
        metricNumber.textContent = originalText.replace(targetNumber, displayNumber);
    }, 30);
}

// ===== TAB SWITCHER =====
function initTabSwitcher() {
    const tabGroups = document.querySelectorAll('.tab-group');
    
    tabGroups.forEach(group => {
        const tabs = group.querySelectorAll('.tab-button');
        const contents = group.querySelectorAll('.tab-content');
        
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                if (contents[index]) {
                    contents[index].classList.add('active');
                }
                
                // Animate content change
                contents[index]?.classList.add('fade-in-up');
            });
        });
    });
}

// ===== TOOLTIPS =====
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            showTooltip(this, this.getAttribute('data-tooltip'));
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'rocket-tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => tooltip.classList.add('visible'), 10);
}

function hideTooltip() {
    const tooltip = document.querySelector('.rocket-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
        setTimeout(() => tooltip.remove(), 200);
    }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

// ===== SEARCH ENHANCEMENTS =====
function initSearchEnhancements() {
    const searchInput = document.querySelector('.md-search__input');
    
    if (searchInput) {
        // Add search suggestions
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            
            if (query.length > 2) {
                highlightSearchTerms(query);
            } else {
                clearHighlights();
            }
        });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl+K or Cmd+K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
            
            // Escape to clear search
            if (e.key === 'Escape' && document.activeElement === searchInput) {
                searchInput.value = '';
                searchInput.blur();
                clearHighlights();
            }
        });
    }
}

function highlightSearchTerms(query) {
    // This would typically integrate with MkDocs search
    console.log('Searching for:', query);
}

function clearHighlights() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        highlight.outerHTML = highlight.innerHTML;
    });
}

// ===== THEME TOGGLE ENHANCEMENT =====
function initThemeToggle() {
    const themeToggle = document.querySelector('[data-md-color-scheme]');
    
    if (themeToggle) {
        // Add custom theme transition
        themeToggle.addEventListener('click', function() {
            document.body.classList.add('theme-transition');
            
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 300);
        });
    }
}

// ===== NAVIGATION HIGHLIGHT =====
function initNavigationHighlight() {
    const navLinks = document.querySelectorAll('.md-nav__link');
    
    // Highlight current section based on scroll position
    window.addEventListener('scroll', throttle(() => {
        const scrollPosition = window.scrollY + 100;
        
        const sections = document.querySelectorAll('h1, h2, h3');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollPosition >= sectionTop) {
                currentSection = section.id;
            }
        });
        
        // Update navigation highlight
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentSection)) {
                link.classList.add('current-section');
            } else {
                link.classList.remove('current-section');
            }
        });
    }, 100));
}

// ===== FEATURE CARD ANIMATION =====
function animateFeatureCard(card) {
    const icon = card.querySelector('.feature-icon');
    if (icon) {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }, 500);
    }
}

// ===== UTILITY FUNCTIONS =====

// Throttle function for scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce function for input events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ROCKET-SPECIFIC INTERACTIONS =====

// Add sparkle effect to CTA buttons
function addSparkleEffect() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            createSparkles(this);
        });
    });
}

function createSparkles(element) {
    const sparkles = 6;
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < sparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * rect.width + 'px';
        sparkle.style.top = Math.random() * rect.height + 'px';
        
        element.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

// Dynamic success metrics
function updateSuccessMetrics() {
    const metrics = [
        { element: '.engagement-metric', baseValue: 45, variance: 5 },
        { element: '.completion-metric', baseValue: 23, variance: 3 },
        { element: '.satisfaction-metric', baseValue: 89, variance: 2 }
    ];
    
    metrics.forEach(metric => {
        const element = document.querySelector(metric.element);
        if (element) {
            const variation = (Math.random() - 0.5) * metric.variance;
            const newValue = Math.round(metric.baseValue + variation);
            
            const numberElement = element.querySelector('.metric-number');
            if (numberElement) {
                numberElement.textContent = newValue + '%';
            }
        }
    });
}

// Initialize sparkle effects after DOM load
document.addEventListener('DOMContentLoaded', function() {
    addSparkleEffect();
    
    // Update metrics every 30 seconds for demo effect
    setInterval(updateSuccessMetrics, 30000);
});

// ===== ROCKET LAUNCH ANIMATION =====
function createRocketLaunch() {
    const rocket = document.createElement('div');
    rocket.innerHTML = '⚡';
    rocket.className = 'rocket-launch';
    
    document.body.appendChild(rocket);
    
    setTimeout(() => {
        rocket.remove();
    }, 3000);
}

// Trigger rocket launch on special interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('launch-rocket')) {
        createRocketLaunch();
    }
});

// ===== PERFORMANCE MONITORING =====
function trackPerformance() {
    // Track page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log('Page loaded in', Math.round(loadTime), 'ms');
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                value: Math.round(loadTime),
                event_category: 'Performance'
            });
        }
    });
}

// Initialize performance tracking
trackPerformance();

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initAccessibility() {
    // Add skip links
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Keyboard navigation for custom elements
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const target = e.target;
            if (target.classList.contains('checklist-checkbox')) {
                e.preventDefault();
                target.click();
            }
        }
    });
    
    // Focus management for modals and overlays
    document.addEventListener('focusin', function(e) {
        const modal = document.querySelector('.modal.active');
        if (modal && !modal.contains(e.target)) {
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);

// ===== ICON FALLBACK SYSTEM =====
function initIconFallbacks() {
    setTimeout(() => {
        // Check if Material Design icons loaded properly
        const iconWrappers = document.querySelectorAll('.card-icon-wrapper, .feature-icon-wrapper');
        
        iconWrappers.forEach(wrapper => {
            const materialIcon = wrapper.querySelector('.twemoji, svg');
            
            if (!materialIcon || materialIcon.style.display === 'none') {
                // Show Material Icons font fallback
                console.log('Material Design icon failed to load, showing fallback for:', wrapper.className);
                wrapper.classList.add('icon-fallback');
                
                // Force show the ::before pseudo-element
                const style = document.createElement('style');
                style.textContent = `
                    .${wrapper.className.replace(/\s+/g, '.')}::before {
                        display: flex !important;
                    }
                `;
                document.head.appendChild(style);
            }
        });
        
        // Alternative: Create actual icon elements if pseudo-elements don't work
        createFallbackIcons();
    }, 1000); // Wait for Material icons to load
}

function createFallbackIcons() {
    const iconMap = {
        'primary-icon': '⚡',
        'secondary-icon': '⚡',
        'tertiary-icon': '⚡',
        'accent-icon': '⚡',
        'gamification-icon': '⚡',
        'rewards-icon': '⚡',
        'architecture-icon': '⚡',
        'analytics-icon': '⚡',
        'api-icon': '⚡',
        'support-icon': '⚡'
    };
    
    const iconWrappers = document.querySelectorAll('.card-icon-wrapper, .feature-icon-wrapper');
    
    iconWrappers.forEach(wrapper => {
        const existingIcon = wrapper.querySelector('.twemoji, svg, .fallback-emoji');
        
        if (!existingIcon || existingIcon.offsetWidth === 0) {
            // Find the appropriate emoji based on wrapper classes
            let emoji = '⚡'; // default
            
            Object.keys(iconMap).forEach(className => {
                if (wrapper.classList.contains(className)) {
                    emoji = iconMap[className];
                }
            });
            
            // Create fallback emoji element
            const fallbackIcon = document.createElement('span');
            fallbackIcon.className = 'fallback-emoji';
            fallbackIcon.textContent = emoji;
            fallbackIcon.style.fontSize = wrapper.classList.contains('feature-icon-wrapper') ? '2.5rem' : '2rem';
            fallbackIcon.style.display = 'block';
            fallbackIcon.style.lineHeight = '1';
            
            wrapper.appendChild(fallbackIcon);
            console.log('Added fallback emoji:', emoji, 'to', wrapper.className);
        }
    });
}

// ===== EXPORT FOR EXTERNAL USE =====
window.RocketDocs = {
    animateProgressBar,
    updateChecklistProgress,
    createRocketLaunch,
    showTooltip,
    hideTooltip
};