export class Model {
    constructor() {
        this.authors = [];
    }

    addAuthor(authorData) {
        const author = {
            firstName: authorData.firstName,
            lastName: authorData.lastName,
            bookCount: authorData.bookCount
        };
        this.authors.push(author);
    }

    getAuthors() {
        return this.authors;
    }
}