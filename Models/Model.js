export class Model {
    constructor() {
        this.authors = [];
    }

    addAuthor(authorData) {
        const author = {
            id: this.authors.length + 1,
            firstName: authorData.firstName,
            lastName: authorData.lastName,
            bookCount: authorData.bookCount,
            key: authorData.key
        };
        this.authors.push(author);
    }

    getAuthors() {
        return this.authors;
    }
}