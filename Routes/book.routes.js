const express = require("express");

// Modelos
const { Book } = require("../models/Book.js");

// Router propio de usuarios
const router = express.Router();

// EJEMPLO DE REQ: http://localhost:3000/user?page=1&limit=10
router.get("/", async (req, res) => {
  try {
    // Así leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const books = await Book.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("author");

    // Num total de elementos
    const totalElements = await Book.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: books,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  res.set("Access-Contol-Allow-Origin", "http://localhost:3000");
  try {
    const id = req.params.id;
    const book = await Book.findById(id).populate("author");
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/title/:title", async (req, res) => {
  res.set("Access-Contol-Allow-Origin", "http://localhost:3000");
  const title = req.params.title;

  try {
    const book = await Book.find({ title: new RegExp("^" + title.toLowerCase(), "i") }).populate("author");
    if (book?.length) {
      res.json(book);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Endpoint de creación

router.post("/", async (req, res) => {
  res.set("Access-Contol-Allow-Origin", "http://localhost:3000");
  try {
    const book = new Book(req.body);
    const createdBook = await book.save();
    return res.status(201).json(createdBook);
  } catch (error) {
    console.error(error);
    if (error?.name === "ValidationError") {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

// Endpoint para eliminar

router.delete("/:id", async (req, res) => {
  res.set("Access-Contol-Allow-Origin", "http://localhost:3000");
  try {
    const id = req.params.id;
    const bookDeleted = await Book.findByIdAndDelete(id);
    if (bookDeleted) {
      res.json(bookDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Endpoint update

router.put("/:id", async (req, res) => {
  res.set("Access-Contol-Allow-Origin", "http://localhost:3000");
  try {
    const id = req.params.id;
    const bookUpdated = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (bookUpdated) {
      res.json(bookUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    if (error?.name === "ValidationError") {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

module.exports = { bookRouter: router };

// #region CREATE BOOK / UPDATE DATA
/*
const newBook = {
    title: "Trainspotting",
    author: "Irving Welsh",
    pages: 348,
};

fetch("http://localhost:3000/book", {
  "body": JSON.stringify(newBook),
  "method": "POST",
  "headers": {
     'Accept': 'application/json',
     'Content-Type': 'application/json'
  },
}).then((data) => console.log(data));

fetch("http://localhost:3000/book/64482163d77e7c8bb3e12523", {
  "body": JSON.stringify({pages:123}),
  "method": "PUT",
  "headers": {
     'Accept': 'application/json',
     'Content-Type': 'application/json'
  },
}).then((data) => console.log(data));

*/
// #endregion
