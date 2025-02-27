export class View {
    constructor() {
        this.authorList = document.getElementById("author-list");
        this.addButton = document.getElementById("add-author");
        this.searchInput = document.getElementById("author-search");
        this.detailsSection = document.getElementById("author-details");
    }

    renderAuthors(authors) {
        this.authorList.innerHTML = "";
        authors.forEach((author, index) => {
            const row = document.createElement("div");
            row.className = "author-list";
            row.innerHTML = `
                <span>${author.firstName} ${author.lastName} (${author.bookCount} books)</span>
                <button class="edit-author" data-index="${index}">Редагувати</button>
                <button class="delete-author" data-index="${index}">Видалити</button>
                <button class="view-details" data-id="${author.key}">Деталі</button>
            `;
            this.authorList.appendChild(row);
        });
    }

    deleteAuthor(index) {
        const authorElements = this.authorList.children;
        if (authorElements[index]) {
            authorElements[index].remove();
        }

        // Очищення деталей автора без перевірки dataset.currentAuthorIndex
        this.detailsSection.innerHTML = "";
        delete this.detailsSection.dataset.currentAuthorIndex;
    }

    showAuthorDetails(authorDetails) {
        this.detailsSection.dataset.currentAuthorKey = authorDetails.key;
        this.detailsSection.innerHTML = `
        <p><strong>Ім'я:</strong> ${authorDetails.firstName}</p>
        <p><strong>Прізвище:</strong> ${authorDetails.lastName}</p>
        <p><strong>Дата народження:</strong> ${authorDetails.birthDate || "Немає інформації"}</p>
        <h3>Книги автора:</h3>
        <ul id="books-list">
            ${authorDetails.books.slice(0, 3).map(book => `<li>${book.title}</li>`).join('')}
        </ul>
        <button id="show-more" class="btn btn-primary">Show more</button>
        <button id="show-less" class="btn btn-secondary" style="display: none;">Show less</button>
    `;

        const showMoreButton = this.detailsSection.querySelector("#show-more");
        const showLessButton = this.detailsSection.querySelector("#show-less");
        const booksList = this.detailsSection.querySelector("#books-list");

        let currentBooksCount = 3;

        showMoreButton.addEventListener("click", () => {
            currentBooksCount += 3;
            const newBooks = authorDetails.books.slice(0, currentBooksCount).map(book => `<li>${book.title}</li>`).join('');
            booksList.innerHTML = newBooks;

            if (currentBooksCount >= authorDetails.books.length) {
                showMoreButton.style.display = "none";
            }
            showLessButton.style.display = "inline-block";
        });

        showLessButton.addEventListener("click", () => {
            currentBooksCount = Math.max(currentBooksCount - 3, 3);
            const newBooks = authorDetails.books.slice(0, currentBooksCount).map(book => `<li>${book.title}</li>`).join('');
            booksList.innerHTML = newBooks;

            if (currentBooksCount === 3) {
                showLessButton.style.display = "none";
            }
            showMoreButton.style.display = "inline-block";
        });
    }

}