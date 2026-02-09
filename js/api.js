const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Searches for books using the Google Books API.
 * @param {string} query - The search term.
 * @returns {Promise<Array>} - A promise that resolves to an array of book objects.
 */
export async function searchBooks(query) {
    if (!query) return [];
    
    try {
        const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=20`);
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
 * Fetches details for a specific book by ID.
 * @param {string} id - The volume ID.
 * @returns {Promise<Object|null>} - A promise that resolves to the book details object.
 */
export async function getBookDetails(id) {
    if (!id) return null;

    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching book details:', error);
        return null;
    }
}
