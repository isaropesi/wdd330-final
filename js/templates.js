export function bookCardTemplate(book) {
    const info = book.volumeInfo;
    const thumbnail = info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Image';
    const authors = info.authors ? info.authors.join(', ') : 'Unknown Author';

    return `
        <div class="book-card" data-id="${book.id}">
            <img src="${thumbnail}" alt="${info.title}" class="book-cover">
            <div class="book-info">
                <h3 class="book-title">${info.title}</h3>
                <p class="book-author">${authors}</p>
            </div>
        </div>
    `;
}

export function bookDetailsTemplate(book) {
    const info = book.volumeInfo;
    const thumbnail = info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Image';
    const authors = info.authors ? info.authors.join(', ') : 'Unknown Author';
    const description = info.description || 'No description available.';

    return `
        <div class="details-grid">
            <div class="details-image">
                <img src="${thumbnail}" alt="${info.title}" style="width: 100%; max-width: 300px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            </div>
            <div class="details-info">
                <h2>${info.title}</h2>
                <h3 style="color: #666; font-weight: 400;">by ${authors}</h3>
                <div class="action-buttons" style="margin: 1rem 0; display: flex; gap: 1rem;">
                    <button id="add-to-library-btn" style="padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Add to Library</button>
                    ${info.previewLink ? `<a href="${info.previewLink}" target="_blank" style="padding: 0.5rem 1rem; background: var(--accent-color); color: var(--text-color); text-decoration: none; border-radius: 4px; display: inline-block;">Preview</a>` : ''}
                </div>
                <div class="meta-info" style="margin-bottom: 1rem; font-size: 0.9rem; color: #555;">
                    <p><strong>Published:</strong> ${info.publishedDate || 'N/A'}</p>
                    <p><strong>Publisher:</strong> ${info.publisher || 'N/A'}</p>
                    <p><strong>Pages:</strong> ${info.pageCount || 'N/A'}</p>
                </div>
                <div class="description" style="max-height: 300px; overflow-y: auto;">
                    ${description}
                </div>
            </div>
        </div>
    `;
}
