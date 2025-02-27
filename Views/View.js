export class View {
    constructor() {
        this.authorList = document.getElementById("author-list");
        this.addButton = document.getElementById("add-author");
        this.searchInput = document.getElementById("author-search");
    }

    renderAuthors(authors) {
        this.authorList.innerHTML = "";
        authors.forEach(author => {
            const row = document.createElement("div");
            row.innerHTML = `
                <span>${author.firstName} ${author.lastName} (${author.bookCount} books)</span>
            `;
            this.authorList.appendChild(row);
        });
    }
}