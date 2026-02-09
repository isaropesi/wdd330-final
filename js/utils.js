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
