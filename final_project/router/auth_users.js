const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const { jwt_secret } = require("../config/config.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.filter((user) => user.username === username).length === 0;
};

const authenticatedUser = (username, password) => {
  return (
    users.filter(
      (user) => user.username === username && user.password === password
    ).length > 0
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          data: password,
        },
        jwt_secret,
        { expiresIn: 60 * 60 }
      );
      req.session.authorization = {
        accessToken,
        username,
      };
      return res.status(200).json({
        message: `Customer ${username} successfully logged in`,
      });
    } else {
      throw new Error("username or password is not correct.");
    }
  } else {
    throw new Error("username or password not found.");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if (books[req.params.isbn]) {
    if (req.query.review) {
      const user = req.session.authorization["username"];
      books[req.params.isbn].reviews[user] = req.query.review;
      return res.status(200).json({
        message: `The review for the book with isbn ${req.params.isbn} has been added/updated.`,
      });
    } else {
      throw new Error("parameter review not found.");
    }
  } else throw new Error(`book with the isbn ${req.params.isbn} not found.`);
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (books[req.params.isbn]) {
    const user = req.session.authorization["username"];
    delete books[req.params.isbn].reviews[user];
    return res.status(200).json({
      message: `The review for the book with isbn ${req.params.isbn} posted by user ${user} deleted.`,
    });
  } else throw new Error(`book with the isbn ${req.params.isbn} not found.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
