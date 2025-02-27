export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.addButton.addEventListener("click", () => this.searchAuthor());
        this.view.searchInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                this.searchAuthor();
            }
        });

        this.view.authorList.addEventListener("click", (event) => {
            if (event.target.classList.contains("edit-author")) {
                const index = event.target.dataset.index;
                this.editAuthor(index);
            } else if (event.target.classList.contains("delete-author")) {
                const index = event.target.dataset.index;
                this.deleteAuthor(index);
            } else if (event.target.classList.contains("view-details")) {
                const authorKey = event.target.dataset.id;
                this.fetchAuthorDetails(authorKey);
            }
        });
    }

    async searchAuthor() {
        const query = this.view.searchInput.value.trim();
        if (!query) return;

        const url = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            if (data.docs && data.docs.length > 0) {
                const author = {
                    key: data.docs[0].key,
                    firstName: data.docs[0].name.split(" ")[0] || "Невідомо",
                    lastName: data.docs[0].name.split(" ").slice(1).join(" ") || "Невідомо",
                    bookCount: data.docs[0].work_count || 0,
                    birthDate: data.docs[0].birth_date || "Немає інформації"
                };

                this.model.addAuthor(author);
                this.view.renderAuthors(this.model.getAuthors());

                this.view.searchInput.value = "";
            }
        } catch (error) {
            console.error("Error fetching author:", error);
        }
    }

    async editAuthor(index) {
        const author = this.model.getAuthors()[index];
        const { newFirstName, newLastName } = this.view.showEditForm(index, author);

        if (newFirstName && newLastName) {
            this.model.authors[index].firstName = newFirstName;
            this.model.authors[index].lastName = newLastName;
            this.view.renderAuthors(this.model.getAuthors());
        }
    }

    deleteAuthor(index) {
        this.model.authors.splice(index, 1);
        this.view.renderAuthors(this.model.getAuthors());

        // Викликаємо метод для очищення деталей
        this.view.deleteAuthor(index);
    }


    async fetchAuthorDetails(authorKey) {
        try {
            // Запит для отримання основних даних про автора
            const authorResponse = await fetch(`https://openlibrary.org/authors/${authorKey}.json`);
            if (!authorResponse.ok) throw new Error("Не вдалося отримати деталі автора");
            const authorData = await authorResponse.json();

            // Запит для отримання книг автора
            const booksResponse = await fetch(`https://openlibrary.org/search.json?author=${encodeURIComponent(authorData.name)}`);
            if (!booksResponse.ok) throw new Error("Не вдалося отримати книги автора");
            const booksData = await booksResponse.json();

            // Формуємо список книг
            const books = booksData.docs.map(book => ({
                title: book.title || "Немає назви"
            }));

            // Формуємо деталі автора
            const authorDetails = {
                key: authorData.key,
                firstName: authorData.name.split(" ")[0] || "Невідомо",
                lastName: authorData.name.split(" ").slice(1).join(" ") || "Невідомо",
                middleName: authorData.middle_name || "Немає інформації",
                birthDate: authorData.birth_date || "Немає інформації",
                books
            };

            this.view.showAuthorDetails(authorDetails);
        } catch (error) {
            console.error("Помилка при отриманні деталей автора:", error);
        }
    }
}