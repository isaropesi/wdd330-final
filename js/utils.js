// Utility functions 

/**
 * Debounce function to limit the rate at which a function can fire.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
export function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Initializes the theme based on local storage or system preference.
 */
export function initTheme() {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    
    // Check for system preference if no saved theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

/**
 * Toggles between light and dark mode.
 */
export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    return newTheme;
}

/**
 * Get an element from the DOM by selector.
 * @param {string} selector - The CSS selector.
 * @returns {HTMLElement} - The DOM element.
 */
export function qs(selector) {
    return document.querySelector(selector);
}

/**
 * Set click listener on an element.
 * @param {string} selector - The CSS selector.
 * @param {Function} callback - The event handler.
 */
export function onClick(selector, callback) {
    const element = qs(selector);
    if (element) {
        element.addEventListener('click', callback);
    }
}
