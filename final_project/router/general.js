const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (isValid(username)) {
      users.push({
        username: username,
        password: password,
      });

      return res.status(200).json({
        message: `Customer ${username} successfully registred. Now you can login`,
      });
    } else {
      throw new Error(`user ${username} already exist.`);
    }
  } else {
    throw new Error("username or password not found.");
  }
});

const get_all_books = async () => {
  return books;
};
const get_by_isbn = async (isbn) => {
  return books[isbn];
};
const get_by_author = async (author) => {
  let filteredBooks = [];
  for (const book in books) {
    if (books[book].author === author) {
      filteredBooks.push(books[book]);
    }
  }
  return filteredBooks;
};
const get_by_title = async (title) => {
  let filteredBooks = [];
  for (const book in books) {
    if (books[book].title === title) {
      filteredBooks.push(books[book]);
    }
  }
  return filteredBooks;
};

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  return res.status(200).json(await get_all_books());
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const book = await get_by_isbn(req.params.isbn);
  if (book) {
    return res.status(200).json(book);
  } else res.status(404).json({ message: `book with the isbn ${req.params.isbn} not found.` });
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  return res
    .status(200)
    .json({ bookbyauthor: await get_by_author(req.params.author) });
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  return res
    .status(200)
    .json({ bookbytitle: await get_by_title(req.params.title) });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  if (books[req.params.isbn]) {
    return res.status(200).json(books[req.params.isbn].reviews);
  } else res.status(404).json({ message: `book with the isbn ${req.params.isbn} not found.` });
});

module.exports.general = public_users;
