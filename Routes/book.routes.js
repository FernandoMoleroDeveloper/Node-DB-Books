const express = require("express");

// Modelos
const { Book } = require("../models/Book.js");

// Router propio de usuarios
const router = express.Router();

// CRUD: READ
router.get("/", (req, res, next) => {
  console.log("Estamos en el middleware /author que comprueba parametros");
  const page = req.querypage ? parseInt(req.querypage) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
    req.query.page = page;
    req.query.limit = limit;
    next();
  } else {
    console.log("Parametros no validos:");
    console.log(JSON.stringify(req.query));
    res.status(400).json({ error: "Params page or limit are not valid" });
  }
});
router.get("/", async (req, res, next) => {
  try {
    // Así leemos query params
    const { page, limit } = req.query;
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
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id).populate("author");
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

router.get("/title/:title", async (req, res, next) => {
  const title = req.params.title;

  try {
    const book = await Book.find({ title: new RegExp("^" + title.toLowerCase(), "i") }).populate("author");
    if (book?.length) {
      res.json(book);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    next(error);
  }
});

// Endpoint de creación

router.post("/", async (req, res, next) => {
  try {
    const book = new Book(req.body);
    const createdBook = await book.save();
    return res.status(201).json(createdBook);
  } catch (error) {
    next(error);
  }
});

// Endpoint para eliminar

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const bookDeleted = await Book.findByIdAndDelete(id);
    if (bookDeleted) {
      res.json(bookDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// Endpoint update

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const bookUpdated = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (bookUpdated) {
      res.json(bookUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
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
