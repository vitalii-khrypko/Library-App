export class BooksView {
    constructor() {
        this.bookList = document.getElementById("book-list");
        this.searchInput = document.getElementById("book-search");
        this.addButton = document.getElementById("add-book");
    }

    renderBooks(books) {
        this.bookList.innerHTML = "";
        books.forEach((book, index) => {
            const row = document.createElement("div");
            row.classList.add("book-item");
            row.innerHTML = `
                <span>${book.title} (${book.pages} сторінок, жанр - ${book.genre || "Невідомий жанр"})</span>
                <button class="edit-book" data-index="${index}">Редагувати</button>
                <button class="delete-book" data-index="${index}">Видалити</button>
                <button class="genre-book" data-index="${index}">Додати жанр</button>
            `;
            this.bookList.appendChild(row);
        });
    }

    showEditForm(index, book) {
        const newTitle = prompt("Введіть нову назву книги:", book.title);
        return newTitle;
    }

    promptForGenre() {
        return prompt("Введіть новий жанр для книги:");
    }

    clearInput() {
        this.searchInput.value = ""; // Очищення поля вводу
    }
}
