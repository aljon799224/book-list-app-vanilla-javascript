//book class: represent a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector(".booklist-list");

    const row = document.createElement("tr");

    row.innerHTML = `<td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td><a href="#" class="delete">X</a></td>`;

    list.appendChild(row);
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.classList.add(`${className}`);
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".booklist-container");
    const form = document.querySelector(".booklist-form");
    container.insertBefore(div, form);

    //remove div message
    setTimeout(() => {
      div.remove();
    }, 2000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
}

// store class: handles storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, i) => {
      if (book.isbn === isbn) {
        books.splice(i, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// event display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// event add a book
document.querySelector(".booklist-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill up all the forms!", "warning");
  } else {
    //instantiate book
    const book = new Book(title, author, isbn);

    //add book to UI
    UI.addBookToList(book);

    //add book to store
    Store.addBook(book);

    //show success message
    UI.showAlert("Book Added!", "success");

    //clear fields
    UI.clearFields();
  }
});

//event remove a book
document.querySelector(".booklist-list").addEventListener("click", (e) => {
  UI.deleteBook(e.target);

  //remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show success message
  UI.showAlert("Book Removed", "success");
});
