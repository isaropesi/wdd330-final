const LIBRARY_KEY = 'littrack_library';

/**
 * Retrieves the user's library from LocalStorage.
 * @returns {Array} Array of book objects.
 */
export function getLibrary() {
    const libraryJSON = localStorage.getItem(LIBRARY_KEY);
    return libraryJSON ? JSON.parse(libraryJSON) : [];
}

/**
 * Saves or updates a book in the library.
 * @param {Object} book - The book object to save.
 * @param {string} status - The reading status ('want-to-read', 'reading', 'read').
 */
export function saveBook(book, status = 'want-to-read') {
    const library = getLibrary();
    const existingIndex = library.findIndex(item => item.id === book.id);

    // Create a simplified book object to save space and keep consistent structure
    const bookData = {
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors,
        thumbnail: book.volumeInfo.imageLinks?.thumbnail,
        pageCount: book.volumeInfo.pageCount || 0,
        status: status,
        currentPage: existingIndex !== -1 ? library[existingIndex].currentPage : 0,
        rating: existingIndex !== -1 ? library[existingIndex].rating : null,
        addedDate: existingIndex !== -1 ? library[existingIndex].addedDate : new Date().toISOString()
    };

    if (existingIndex !== -1) {
        library[existingIndex] = { ...library[existingIndex], ...bookData };
    } else {
        library.push(bookData);
    }

    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
}

/**
 * Removes a book from the library.
 * @param {string} id - The ID of the book to remove.
 */
export function removeBook(id) {
    let library = getLibrary();
    library = library.filter(item => item.id !== id);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
}

/**
 * Updates the reading progress of a book.
 * @param {string} id - The book ID.
 * @param {number} currentPage - The new page number.
 */
export function updateProgress(id, currentPage) {
    const library = getLibrary();
    const bookIndex = library.findIndex(item => item.id === id);

    if (bookIndex !== -1) {
        library[bookIndex].currentPage = parseInt(currentPage, 10);
        localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
    }
}

/**
 * Retrieves a specific book from the library.
 * @param {string} id 
 * @returns {Object|undefined}
 */
export function getBookInLibrary(id) {
    const library = getLibrary();
    return library.find(item => item.id === id);
}
