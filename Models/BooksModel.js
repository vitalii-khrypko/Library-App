export class BooksModel {
    constructor() {
        this.books = [];
    }

    addBook(book) {
        this.books.push(book);
    }

    getBooks() {
        return this.books;
    }

    updateBook(index, newTitle) {
        this.books[index].title = newTitle;
    }

    deleteBook(index) {
        this.books.splice(index, 1);
    }
}
