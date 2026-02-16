// ===================================
// DOM ELEMENTS
// ===================================
const searchInput = document.querySelector('.search-input');
const wishlistButtons = document.querySelectorAll('.wishlist-btn');
const deviceCards = document.querySelectorAll('.device-card');
const categoryCards = document.querySelectorAll('.category-card');

// ===================================
// SEARCH FUNCTIONALITY
// ===================================
let searchTimeout;

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    // Clear existing timeout
    clearTimeout(searchTimeout);
    
    // Add loading state (debounced)
    searchTimeout = setTimeout(() => {
        if (searchTerm.length > 2) {
            console.log('Searching for:', searchTerm);
            // In production, this would trigger an API call
            // showSearchResults(searchTerm);
        }
    }, 300);
});

// Clear search on ESC key
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchInput.value = '';
        searchInput.blur();
    }
});

// ===================================
// WISHLIST FUNCTIONALITY
// ===================================
const wishlistItems = new Set();

wishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        const deviceCard = button.closest('.device-card');
        const deviceTitle = deviceCard.querySelector('.device-title').textContent;
        
        // Toggle wishlist state
        if (wishlistItems.has(deviceTitle)) {
            wishlistItems.delete(deviceTitle);
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 17.5L8.825 16.45C4.4 12.36 1.5 9.72 1.5 6.5C1.5 4.02 3.42 2 5.9 2C7.29 2 8.62 2.66 9.5 3.7C10.38 2.66 11.71 2 13.1 2C15.58 2 17.5 4.02 17.5 6.5C17.5 9.72 14.6 12.36 10.175 16.45L10 17.5Z" stroke="currentColor" stroke-width="2"/>
                </svg>
            `;
            button.style.background = 'white';
            button.style.color = 'var(--gray-600)';
            
            showNotification('Removed from wishlist', 'info');
        } else {
            wishlistItems.add(deviceTitle);
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 17.5L8.825 16.45C4.4 12.36 1.5 9.72 1.5 6.5C1.5 4.02 3.42 2 5.9 2C7.29 2 8.62 2.66 9.5 3.7C10.38 2.66 11.71 2 13.1 2C15.58 2 17.5 4.02 17.5 6.5C17.5 9.72 14.6 12.36 10.175 16.45L10 17.5Z"/>
                </svg>
            `;
            button.style.background = 'var(--error)';
            button.style.color = 'white';
            
            showNotification('Added to wishlist', 'success');
        }
        
        // Update badge count
        updateWishlistBadge();
    });
});

function updateWishlistBadge() {
    const badge = document.querySelector('.badge');
    if (badge) {
        badge.textContent = wishlistItems.size;
    }
}

// ===================================
// DEVICE CARD INTERACTIONS
// ===================================
deviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't navigate if clicking wishlist button
        if (e.target.closest('.wishlist-btn')) return;
        
        const deviceTitle = card.querySelector('.device-title').textContent;
        console.log('Navigating to device:', deviceTitle);
        // In production: window.location.href = `/device/${deviceId}`;
        
        // Visual feedback
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    });
});

// ===================================
// CATEGORY CARD ANALYTICS
// ===================================
categoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
        const categoryTitle = card.querySelector('.category-title').textContent;
        console.log('Category clicked:', categoryTitle);
        // Track analytics event
        // trackEvent('category_click', { category: categoryTitle });
    });
});

// ===================================
// NOTIFICATION SYSTEM
// ===================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${getNotificationIcon(type)}
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        border-left: 4px solid ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--info)'};
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="#10B981" fill-opacity="0.1"/>
                <path d="M6 10L9 13L14 7" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `,
        error: `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="#EF4444" fill-opacity="0.1"/>
                <path d="M7 7L13 13M7 13L13 7" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `,
        info: `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="#3B82F6" fill-opacity="0.1"/>
                <path d="M10 6V10M10 14H10.01" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `
    };
    
    return icons[type] || icons.info;
}

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// HEADER SCROLL EFFECT
// ===================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    // Hide header on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 500) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for scroll animations
document.querySelectorAll('.device-card, .category-card, .trust-card').forEach(card => {
    observer.observe(card);
});

// ===================================
// PRICE FORMATTER
// ===================================
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(price);
}

// ===================================
// LAZY LOADING IMAGES (for production)
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================
document.addEventListener('keydown', (e) => {
    // Focus search with '/' key
    if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Clear search with ESC
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.blur();
    }
});

// ===================================
// ADD ANIMATION STYLES DYNAMICALLY
// ===================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        color: var(--gray-900);
    }
    
    /* Smooth header transitions */
    .header {
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);

// ===================================
// CONSOLE WELCOME MESSAGE
// ===================================
console.log('%cGo2Hand', 'color: #667eea; font-size: 24px; font-weight: bold;');
console.log('%cQuality Pre-Owned Tech, Trusted & Verified', 'color: #6B7280; font-size: 14px;');
console.log('%c\nInterested in joining our team? Check out careers at Go2Hand.com/careers', 'color: #10B981; font-size: 12px;');

// ===================================
// PERFORMANCE MONITORING
// ===================================
if (window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${pageLoadTime}ms`);
        }, 0);
    });
}

// ===================================
// INITIALIZE APP
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Go2Hand app initialized');
    
    // Set initial wishlist badge
    updateWishlistBadge();
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
});