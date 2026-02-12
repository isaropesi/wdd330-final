const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const NYT_BASE_URL = 'https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json';
const NYT_API_KEY = '7dZurFNJ1lCUzfzG4gM5NdWyfHzzutrIeWY1H7c9IUDQ6UGN';
const GOOGLE_API_KEY = 'AIzaSyDMg3F1qUmk3hyvgGSrhiI2LFPGyOj2NFQ';

/**
 * Searches for books using the Google Books API.
 * ... (existing searchBooks) ...
 */

/**
 * Fetches NYT Best Sellers.
 * @returns {Promise<Array>}
 */
export async function getBestSellers() {
    try {
        const response = await fetch(`${NYT_BASE_URL}?api-key=${NYT_API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch best sellers');
        const data = await response.json();
        return data.results.books;
    } catch (error) {
        console.warn('NYT API Error (likely missing key):', error);
        return []; // Return empty array to fail gracefully
    }
}

/**
 * Searches for books using the Google Books API.
 * @param {string} query - The search term.
 * @returns {Promise<Array>} - A promise that resolves to an array of book objects.
 */
export async function searchBooks(query) {
    if (!query) return [];

    try {
        const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=20&key=${GOOGLE_API_KEY}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

/**
 * Searches for a single book by ISBN.
 * @param {string} isbn
 * @returns {Promise<Object|null>}
 */
export async function searchByISBN(isbn) {
    try {
        // ISBN search query format: isbn:NUMBER
        const response = await fetch(`${BASE_URL}?q=isbn:${isbn}&maxResults=1&key=${GOOGLE_API_KEY}`);
        if (!response.ok) throw new Error('Failed to search by ISBN');
        const data = await response.json();
        return data.items ? data.items[0] : null;
    } catch (error) {
        console.error('Error searching ISBN:', error);
        return null;
    }
}

/**
 * Fetches details for a specific book by ID.
 * @param {string} id - The volume ID.
 * @returns {Promise<Object|null>} - A promise that resolves to the book details object.
 */
export async function getBookDetails(id) {
    if (!id) return null;

    try {
        const response = await fetch(`${BASE_URL}/${id}?key=${GOOGLE_API_KEY}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching book details:', error);
        return null;
    }
}
