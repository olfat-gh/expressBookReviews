const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const { jwt_secret } = require("../config/config.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.findIndex((user) => user.username === username) === -1;
};

const authenticatedUser = (username, password) => {
  return (
    users.findIndex(
      (user) => user.username === username && user.password === password
    ) !== -1
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
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
