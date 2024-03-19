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

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  if (books[req.params.isbn]) {
    return res.status(200).json(books[req.params.isbn]);
  } else throw new Error(`book with the isbn ${req.params.isbn} not found.`);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let filteredBooks = [];
  for (const book in books) {
    if (books[book].author === req.params.author) {
      filteredBooks.push(books[book]);
    }
  }

  return res.status(200).json({ bookbyauthor: filteredBooks });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let filteredBooks = [];
  for (const book in books) {
    if (books[book].title === req.params.title) {
      filteredBooks.push(books[book]);
    }
  }

  return res.status(200).json({ bookbytitle: filteredBooks });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  if (books[req.params.isbn]) {
    return res.status(200).json(books[req.params.isbn].reviews);
  } else throw new Error(`book with the isbn ${req.params.isbn} not found.`);
});

module.exports.general = public_users;
