import { AuthorsModel } from "./Models/AuthorsModel.js";
import { AuthorsView } from "./Views/AuthorsView.js";
import { AuthorsController } from "./Controllers/AuthorsController.js";

import { BooksModel } from "./Models/BooksModel.js";
import { BooksView } from "./Views/BooksView.js";
import { BooksController } from "./Controllers/BooksController.js";

const authorsModel = new AuthorsModel();
const authorsView = new AuthorsView();
const authorsController = new AuthorsController(authorsModel, authorsView);

const booksModel = new BooksModel();
const booksView = new BooksView();
const booksController = new BooksController(booksModel, booksView);