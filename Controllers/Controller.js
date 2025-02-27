export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.addButton.addEventListener("click", () => this.searchAuthor());
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
            }
        } catch (error) {
            console.error("Error fetching author:", error);
        }
    }

    async fetchAuthorDetails(author) {
        try {
            const response = await fetch(`https://openlibrary.org/authors/${author.key}.json`);
            if (!response.ok) throw new Error("Failed to fetch author details");

            const data = await response.json();
            this.view.showDetails(author, data);
        } catch (error) {
            console.error("Error fetching author details:", error);
        }
    }
}