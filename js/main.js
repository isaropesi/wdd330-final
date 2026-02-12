import { searchBooks, getBookDetails, getBestSellers, searchByISBN } from './api.js';
import { bookCardTemplate, bookDetailsTemplate, libraryBookTemplate } from './templates.js';
import { qs, onClick, debounce } from './utils.js';
import { getLibrary, saveBook, removeBook, updateProgress } from './storage.js';

// Elements
const searchInput = qs('#search-input');
const searchButton = qs('#search-button');
const resultsContainer = qs('#search-results');
const bestSellersContainer = qs('#best-sellers');
const bestSellersList = qs('#best-sellers-list');
const libraryContainer = qs('#library-view');
const modal = qs('#book-modal');
const modalBody = qs('#modal-body');
const closeModalBtn = qs('#close-modal');
const navLinks = document.querySelectorAll('.nav-link');
const tabBtns = document.querySelectorAll('.tab-btn');

// State
let currentBook = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadBestSellers();
});

// Event Listeners
if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => modal.close());
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    });
}

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = e.target.dataset.view;
        switchView(view);
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
    });
});

// Tabs
tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const status = e.target.dataset.tab;
        switchTab(status);
    });
});

/**
 * Switch main view between Home (Search) and Library.
 * @param {string} viewName 
 */
function switchView(viewName) {
    if (viewName === 'home') {
        // If search results exist, show them; otherwise show best sellers
        if (resultsContainer.innerHTML && !resultsContainer.classList.contains('hidden') && resultsContainer.children.length > 0) {
            bestSellersContainer.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
        } else {
            bestSellersContainer.classList.remove('hidden');
            resultsContainer.classList.add('hidden');
        }
        libraryContainer.classList.add('hidden');
    } else if (viewName === 'library') {
        bestSellersContainer.classList.add('hidden');
        resultsContainer.classList.add('hidden');
        libraryContainer.classList.remove('hidden');
        renderLibrary();
    }
}

/**
 * Switch tabs within Library view.
 * @param {string} status 
 */
function switchTab(status) {
    // Update buttons
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === status);
    });

    // Update content visibility
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.toggle('hidden', content.id !== status);
        content.classList.toggle('active', content.id === status);
    });
}

/**
 * Handles the search action.
 */
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        // If query cleared, show best sellers
        resultsContainer.innerHTML = '';
        resultsContainer.classList.add('hidden');
        bestSellersContainer.classList.remove('hidden');
        return;
    }

    resultsContainer.innerHTML = '<p>Searching...</p>';
    bestSellersContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');

    // Ensure on home view
    libraryContainer.classList.add('hidden');
    navLinks.forEach(l => l.classList.remove('active'));
    qs('[data-view="home"]').classList.add('active');

    try {
        const books = await searchBooks(query);
        renderBookList(books, resultsContainer);
    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = '<p>An error occurred while searching.</p>';
    }
}

/**
 * Loads and renders Best Sellers.
 */
async function loadBestSellers() {
    try {
        const books = await getBestSellers();
        if (books.length === 0) {
            bestSellersList.innerHTML = '<p>To see best sellers, please add a valid NYT API Key in js/api.js</p>';
            return;
        }

        // Normalize NYT data to match bookCardTemplate expectation
        const normalizedBooks = books.map(book => ({
            id: 'isbn:' + (book.primary_isbn10 || book.primary_isbn13),
            volumeInfo: {
                title: book.title,
                authors: [book.author],
                imageLinks: { thumbnail: book.book_image }
            }
        }));

        renderBookList(normalizedBooks, bestSellersList);
    } catch (error) {
        console.error('Error loading best sellers:', error);
        bestSellersList.innerHTML = '<p>Failed to load best sellers.</p>';
    }
}

/**
 * Renders a list of books to a container.
 * @param {Array} books 
 * @param {HTMLElement} container
 */
function renderBookList(books, container) {
    if (books.length === 0) {
        container.innerHTML = '<p>No books found.</p>';
        return;
    }

    container.innerHTML = books.map(book => bookCardTemplate(book)).join('');

    // Add click listeners to book cards within this container
    const cards = container.querySelectorAll('.book-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.dataset.id;
            showBookDetails(bookId);
        });
    });
}

/**
 * Fetches and displays book details in a modal.
 * @param {string} id 
 */
async function showBookDetails(id) {
    modalBody.innerHTML = '<p>Loading details...</p>';
    modal.showModal();

    try {
        let book;
        if (id.startsWith('isbn:')) {
            const isbn = id.split(':')[1];
            book = await searchByISBN(isbn);
        } else {
            book = await getBookDetails(id);
        }

        if (book) {
            currentBook = book; // Store for adding to library
            modalBody.innerHTML = bookDetailsTemplate(book);

            // Attach listener to "Add to Library" button specifically
            const addBtn = qs('#add-to-library-btn');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    const shelf = qs('#shelf-select').value;
                    handleAddToLibrary(currentBook, shelf);
                });
            }
        } else {
            modalBody.innerHTML = '<p>Details not found (ISBN matching failed).</p>';
        }
    } catch (error) {
        console.error(error);
        modalBody.innerHTML = '<p>Error loading details.</p>';
    }
}

/**
 * Adds the current book to the library.
 * @param {Object} book 
 * @param {string} status 
 */
function handleAddToLibrary(book, status) {
    saveBook(book, status);
    alert(`${book.volumeInfo.title} added to ${status.replace('-', ' ')} shelf!`);
    modal.close();
}

/**
 * Renders the user's library into the appropriate tabs.
 */
function renderLibrary() {
    const library = getLibrary();

    // Clear lists
    qs('#reading-list').innerHTML = '';
    qs('#want-list').innerHTML = '';
    qs('#read-list').innerHTML = '';

    // Render books
    if (library.length === 0) {
        qs('#reading-list').innerHTML = '<p>Your library is empty. Go search for books!</p>';
        return;
    }

    // Filter and render by status
    ['reading', 'want-to-read', 'read'].forEach(status => {
        const books = library.filter(book => book.status === status);
        const container = status === 'want-to-read' ? qs('#want-list') : (status === 'read' ? qs('#read-list') : qs('#reading-list'));

        if (books.length === 0) {
            container.innerHTML = `<p>No books in this shelf.</p>`;
        } else {
            container.innerHTML = books.map(book => libraryBookTemplate(book)).join('');
        }
    });

    // Re-attach listeners for library interactions (Remove, Update Progress, etc.)
    attachLibraryListeners(); // defined below
}

function attachLibraryListeners() {
    // Remove Buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            removeBook(id);
            renderLibrary(); // Re-render to update UI
        });
    });

    // Update Progress Buttons
    document.querySelectorAll('.update-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            // Find the sibling input
            const input = e.target.parentElement.querySelector('.page-input');
            if (input) {
                const newPage = input.value;
                updateProgress(id, newPage);
                renderLibrary(); // Re-render to show updated progress bar
            }
        });
    });
}
