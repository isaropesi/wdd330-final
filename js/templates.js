export function bookCardTemplate(book) {
    const info = book.volumeInfo || book; // Handle API result vs stored simplified object
    const thumbnail = (info.imageLinks && info.imageLinks.thumbnail) || info.thumbnail || 'https://via.placeholder.com/128x192?text=No+Image';
    const authors = Array.isArray(info.authors) ? info.authors.join(', ') : (info.authors || 'Unknown Author');

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

export function libraryBookTemplate(book) {
    const thumbnail = book.thumbnail || 'https://via.placeholder.com/128x192?text=No+Image';
    const authors = Array.isArray(book.authors) ? book.authors.join(', ') : (book.authors || 'Unknown Author');
    const progressPercent = book.pageCount > 0 ? Math.round((book.currentPage / book.pageCount) * 100) : 0;

    let actionsHTML = '';

    if (book.status === 'reading') {
        actionsHTML = `
            <div class="progress-section">
                <div class="progress-text">
                    <span>${progressPercent}% Complete</span>
                    <span class="pages">${book.currentPage} / ${book.pageCount} pages</span>
                </div>
                <div class="progress-container">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div style="margin-top: 0.5rem; display: flex; align-items: center;">
                    <input type="number" class="page-input" value="${book.currentPage}" min="0" max="${book.pageCount}" data-id="${book.id}">
                    <button class="update-btn" data-id="${book.id}">Update</button>
                </div>
            </div>
        `;
    } else if (book.status === 'want-to-read') {
        actionsHTML = `<button class="move-btn" data-id="${book.id}" data-status="reading">Start Reading</button>`;
    } else if (book.status === 'read') {
        actionsHTML = `<span style="color: green; font-weight: bold;">Matches complete!</span>`;
    }

    return `
        <div class="book-card library-card" data-id="${book.id}">
            <div style="position: relative;">
                <button class="remove-btn" data-id="${book.id}" style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;">&times;</button>
                <img src="${thumbnail}" alt="${book.title}" class="book-cover">
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${authors}</p>
                ${actionsHTML}
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
                <div class="action-buttons" style="margin: 1rem 0; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <select id="shelf-select" style="padding: 0.5rem; border-radius: 4px;">
                        <option value="want-to-read">Want to Read</option>
                        <option value="reading">Currently Reading</option>
                        <option value="read">Read</option>
                    </select>
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
