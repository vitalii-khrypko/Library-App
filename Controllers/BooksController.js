export class BooksController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Add event listener to the "Add Book" button
        this.view.addButton.addEventListener("click", () => this.searchBook());

        // Allow searching by pressing "Enter"
        this.view.searchInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                this.searchBook();
            }
        });

        // Handle click events on the book list (edit, delete, add genre)
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
            // Search for a book by title
            const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;
            const searchResponse = await fetch(searchUrl);
            if (!searchResponse.ok) throw new Error("Error fetching data");
            const searchData = await searchResponse.json();
            if (!searchData.docs || searchData.docs.length === 0) {
                alert("Книга не знайдена");
                this.view.clearInput();
                return;
            }
            const bookData = searchData.docs[0];
            if (!bookData.key) {
                console.warn("Book does not have a unique key");
                return;
            }

            // Default value for pages
            let pages = "No information available";

            if (bookData.number_of_pages_median) {
                pages = bookData.number_of_pages_median;
            } else {
                // Fetch editions to find the number of pages
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

            // Fetch detailed book information
            const detailsUrl = `https://openlibrary.org${bookData.key}.json`;
            const detailsResponse = await fetch(detailsUrl);
            let detailsData = {};

            if (detailsResponse.ok) {
                detailsData = await detailsResponse.json();
            }

            // List of stop words (prepositions and conjunctions)
            const stopWords = new Set(["of", "in", "on", "at", "by", "with", "about", "against",
                "between", "into", "through", "during", "before", "after", "above", "below",
                "to", "from", "up", "down", "out", "over", "under", "again", "further", "then",
                "once", "because", "so", "although", "while", "for", "nor", "but", "or", "yet", "and"]);

            // Extract genre from subjects
            const extractGenre = (subjects) => {
                if (!Array.isArray(subjects) || subjects.length === 0) {
                    return "No information available";
                }

                let words = subjects[0].split(" ").slice(0, 3); // Take the first three words
                if (words.length === 3 && stopWords.has(words[2].toLowerCase())) {
                    words.pop(); // Remove the third word if it's a preposition/conjunction
                }

                return words.join(" ");
            };

            // Create a book object
            const book = {
                title: bookData.title || "No title available",
                pages: pages,
                genre: extractGenre(detailsData.subjects)
            };

            this.model.addBook(book);
            this.view.renderBooks(this.model.getBooks());
            this.view.clearInput();

        } catch (error) {
            console.error("Error fetching book:", error);
        }
    }

    editBook(index) {
        const books = this.model.getBooks();
        if (index < 0 || index >= books.length) {
            console.warn("Invalid book index for editing.");
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
            console.warn("Invalid book index for deletion.");
            return;
        }
        this.model.deleteBook(index);
        this.view.renderBooks(this.model.getBooks());
    }

    addGenre(index) {
        const books = this.model.getBooks();
        if (index < 0 || index >= books.length) {
            console.warn("Invalid book index for adding a genre.");
            return;
        }

        const newGenre = this.view.promptForGenre();
        if (newGenre) {
            // Check if the genre already exists
            if (!books[index].genre) {
                books[index].genre = newGenre; // If no genre exists, add it
            } else {
                books[index].genre += `, ${newGenre}`; // Otherwise, append the new genre
            }
            this.view.renderBooks(books); // Update book list rendering
        }
    }
}