import { searchBooks, getBookDetails } from './api.js';
import { bookCardTemplate, bookDetailsTemplate } from './templates.js';
import { qs, onClick, debounce } from './utils.js';

// Elements
const searchInput = qs('#search-input');
const searchButton = qs('#search-button');
const resultsContainer = qs('#search-results');
const modal = qs('#book-modal');
const modalBody = qs('#modal-body');
const closeModalBtn = qs('#close-modal');

// Event Listeners
if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
}

if (searchInput) {
    // Add debounce to search input if desired, or just enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.close();
    });
}

// Close modal when clicking outside
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.close();
        }
    });
}

/**
 * Handles the search action.
 */
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    // Show loading state (optional)
    resultsContainer.innerHTML = '<p>Searching...</p>';
    resultsContainer.classList.remove('hidden');

    try {
        const books = await searchBooks(query);
        renderBookList(books);
    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = '<p>An error occurred while searching.</p>';
    }
}

/**
 * Renders the list of books to the results container.
 * @param {Array} books - Array of book objects.
 */
function renderBookList(books) {
    if (books.length === 0) {
        resultsContainer.innerHTML = '<p>No books found.</p>';
        return;
    }

    resultsContainer.innerHTML = books.map(book => bookCardTemplate(book)).join('');

    // Add click listeners to new book cards
    const cards = resultsContainer.querySelectorAll('.book-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.dataset.id;
            showBookDetails(bookId);
        });
    });
}

/**
 * Fetches and displays book details in a modal.
 * @param {string} id - The book ID.
 */
async function showBookDetails(id) {
    modalBody.innerHTML = '<p>Loading details...</p>';
    modal.showModal();

    try {
        const book = await getBookDetails(id);
        if (book) {
            modalBody.innerHTML = bookDetailsTemplate(book);
        } else {
            modalBody.innerHTML = '<p>Details not found.</p>';
        }
    } catch (error) {
        console.error(error);
        modalBody.innerHTML = '<p>Error loading details.</p>';
    }
}

console.log('LitTrack initialized');
