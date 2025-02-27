export class BooksController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.addButton.addEventListener("click", () => this.searchBook());

        this.view.searchInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                this.searchBook();
            }
        });

        this.view.bookList.addEventListener("click", (event) => {
            const index = event.target.dataset.index;
            if (event.target.classList.contains("edit-book")) {
                this.editBook(index);
            } else if (event.target.classList.contains("delete-book")) {
                this.deleteBook(index);
            } else if (event.target.classList.contains("genre-book")) {
                this.addGenre(index);
            }
        });
    }

    async searchBook() {
        const query = this.view.searchInput.value.trim();
        if (!query || query.length < 3) {
            alert("Будь ласка, введіть назву книги (не менше 3 символів).");
            return;
        }

        try {
            // Пошук книги за назвою
            const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;
            const searchResponse = await fetch(searchUrl);
            if (!searchResponse.ok) throw new Error("Помилка отримання даних");
            const searchData = await searchResponse.json();
            if (!searchData.docs || searchData.docs.length === 0) {
                console.warn("Книга не знайдена");
                return;
            }
            const bookData = searchData.docs[0];
            if (!bookData.key) {
                console.warn("Книга не має унікального ключа");
                return;
            }

            // За замовчуванням встановлюємо, що інформації немає
            let pages = "Немає інформації";

            // 1. Спробуємо використати дані з результату пошуку
            if (bookData.number_of_pages_median) {
                pages = bookData.number_of_pages_median;
            } else {
                // 2. Спробуємо отримати дані про видання
                const editionsUrl = `https://openlibrary.org${bookData.key}/editions.json`;
                const editionsResponse = await fetch(editionsUrl);
                if (editionsResponse.ok) {
                    const editionsData = await editionsResponse.json();
                    if (Array.isArray(editionsData.entries) && editionsData.entries.length > 0) {
                        const editionWithPages = editionsData.entries.find(edition => typeof edition.number_of_pages === "number");
                        if (editionWithPages) {
                            pages = editionWithPages.number_of_pages;
                        }
                    }
                }
            }

            // 3. Отримуємо детальну інформацію про книгу
            const detailsUrl = `https://openlibrary.org${bookData.key}.json`;
            const detailsResponse = await fetch(detailsUrl);
            let detailsData = {};
            if (detailsResponse.ok) {
                detailsData = await detailsResponse.json();
            }

            // Формуємо об'єкт книги
            const book = {
                title: bookData.title || "Немає назви",
                pages: pages,
                genre: (Array.isArray(detailsData.subjects) && detailsData.subjects.length > 0)
                    ? detailsData.subjects[0]
                    : "Немає інформації"
            };

            this.model.addBook(book);
            this.view.renderBooks(this.model.getBooks());
            this.view.clearInput();
        } catch (error) {
            console.error("Помилка при отриманні книги:", error);
        }
    }

    editBook(index) {
        const books = this.model.getBooks();
        if (index < 0 || index >= books.length) {
            console.warn("Неправильний індекс книги для редагування.");
            return;
        }
        const book = books[index];
        const newTitle = this.view.showEditForm(index, book);
        if (newTitle) {
            this.model.updateBook(index, newTitle);
            this.view.renderBooks(this.model.getBooks());
        }
    }

    deleteBook(index) {
        const books = this.model.getBooks();
        if (index < 0 || index >= books.length) {
            console.warn("Неправильний індекс книги для видалення.");
            return;
        }
        this.model.deleteBook(index);
        this.view.renderBooks(this.model.getBooks());
    }

    addGenre(index) {
        const books = this.model.getBooks();
        if (index < 0 || index >= books.length) {
            console.warn("Неправильний індекс книги для додавання жанру.");
            return;
        }

        const newGenre = this.view.promptForGenre();
        if (newGenre) {
            // Перевіряємо, чи жанр вже існує
            if (!books[index].genre) {
                books[index].genre = newGenre; // Якщо жанру ще немає, додаємо його
            } else {
                books[index].genre += `, ${newGenre}`; // Інакше додаємо новий жанр до існуючого
            }
            this.view.renderBooks(books); // Оновлюємо відображення списку книг
        }
    }
}

