export class AuthorsController {
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

    // Searches for an author based on the input query
    async searchAuthor() {
        const query = this.view.searchInput.value.trim();
        if (!query || query.length < 2) {
            alert("Будь ласка, введіть ім'я або прізвище автора (не менше 2 символів).");
            return;
        }

        const url = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            if (!data.docs || data.docs.length === 0) {
                alert("Автор не знайдений");
                this.view.clearInput();
                return;
            }

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

    // Edits an author's details based on their index
    async editAuthor(index) {
        const authors = this.model.getAuthors();
        const author = authors[index];

        const newFirstName = prompt("Введіть нове ім'я:", author.firstName);
        const newLastName = prompt("Введіть нове прізвище:", author.lastName);

        if (newFirstName && newLastName) {
            authors[index].firstName = newFirstName;
            authors[index].lastName = newLastName;

            this.view.renderAuthors(authors);
        }
    }

    // Deletes an author from the model and updates the view
    deleteAuthor(index) {
        this.model.authors.splice(index, 1);
        this.view.renderAuthors(this.model.getAuthors());

        // Calls method to clear author details
        this.view.deleteAuthor(index);
    }

    // Fetches detailed information about a specific author
    async fetchAuthorDetails(authorKey) {
        try {
            // Request to get basic author data
            const authorResponse = await fetch(`https://openlibrary.org/authors/${authorKey}.json`);
            if (!authorResponse.ok) throw new Error("Не вдалося отримати деталі автора");
            const authorData = await authorResponse.json();

            // Request to get books by the author
            const booksResponse = await fetch(`https://openlibrary.org/search.json?author=${encodeURIComponent(authorData.name)}`);
            if (!booksResponse.ok) throw new Error("Не вдалося отримати книги автора");
            const booksData = await booksResponse.json();

            // Builds the list of books
            const books = booksData.docs.map(book => ({
                title: book.title || "Немає назви"
            }));

            // Builds the author details object
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
