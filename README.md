# Library App

Library App is a web application that allows users to search for authors and books, view their details, edit or delete them, and add genres to books. It provides an intuitive and interactive interface to manage a collection of books and authors, making it easy to access and modify data.

## Features

- **Search for Authors**: Allows users to search authors by name and view their basic information (first name, last name, birth date, book count).
- **Search for Books**: Users can search for books and view their details, including title, pages, and genre.
- **View Author and Book Details**: Displays detailed information about an author or book, such as a list of books written by the author.
- **Edit Authors and Books**: Users can edit author and book information, including author names and book titles.
- **Delete Authors and Books**: Users can delete authors and books from the collection.
- **Add Genres to Books**: Allows users to add or modify the genre of a book.
- **Pagination for Book Lists**: When viewing an author's books, users can see a limited number of books initially with an option to view more.

## Tech Stack

- **JavaScript**: The core programming language for implementing functionality.
- **HTML5**: For structuring the app's layout.
- **CSS3**: For styling the user interface.
- **Bootstrap**: A popular front-end framework used for responsive design and pre-styled UI components.

## Architecture

The project follows the **MVC (Model-View-Controller)** architectural pattern:

- **Model**: Manages the data structure and business logic of the application.
- **View**: Handles the presentation layer and user interface rendering.
- **Controller**: Connects the Model and View, handling user interactions and updating the UI accordingly.

This architecture ensures better separation of concerns, making the application more scalable and maintainable.

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/vitalii-khrypko/Library-App.git
   ```
2. Open the index.html file in your browser to run the application.

## Usage

### Searching Authors:

- Enter the name of an author in the search field and click the "Search" button to find authors.
- The search results will display author names, their book count, and buttons for editing, deleting, or viewing details.

### Searching Books:

- Type the name of a book in the search field to find books in the system.
- The book list will show details like title, number of pages, and genre.

### Viewing Details:

- Click the "Details" button next to an author or book to see additional information, such as a list of books written by the author or more details about the book.

### Editing Authors and Books:

- Click the "Edit" button next to an author or book to change its details.
  - For authors, you can modify the first name and last name.
  - For books, you can edit the book title.

### Deleting Authors and Books:

- Click the "Delete" button next to an author or book to remove it from the list.

### Adding Genres to Books:

- Click the "Add Genre" button next to a book to input a new genre for that book.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes and commit them (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## Acknowledgments

- Open Library API for fetching author and book data.

## Author - Vitalii Khrypko
