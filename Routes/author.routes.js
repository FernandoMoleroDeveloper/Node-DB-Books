const express = require("express");

// Modelos
const { Author } = require("../models/Author.js");
const { Book } = require("../models/Book.js");

// Router propio de usuarios
const router = express.Router();

// EJEMPLO DE REQ: http://localhost:3000/user?page=1&limit=10

// #region GET para recuperar todos los authors de manera paginada
/*
Si funciona la lectura...// Recogemos las query params de esta manera req.query.parametro
Devolvemos los authors si funciona. Con modelo.find().
La función limit se ejecuta sobre el .find() y le dice que coga un número limitado de elementos,
coge desde el inicio a no ser que le añadamos...
La función skip() se ejecuta sobre el .find() y se salta un número determinado de elementos y
con este cálculo podemos paginar en función del limit. // Con populate le indicamos que si
recoge un id en la propiedad señalada rellene con los campos de datos que contenga ese id.
Creamos una respuesta más completa con info de la API y los datos solicitados por el author:
Esperamos aque realice el conteo del número total de elementos con modelo.countDocuments().
Para saber el número total de páginas que se generan en función del limit. Math.ceil() nos elimina los decimales.
*/
// #endregion

router.get("/", async (req, res) => {
  try {
    const page = req.query.page;
    const limit = parseInt(req.query.limit);
    const authors = await Author.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Author.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: authors,
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
    const author = await Author.findById(id);
    if (author) {
      const temporalAuthor = author.toObject();
      const includeBooks = req.query.includeBooks === "true";

      if (includeBooks) {
        const books = await Book.find({ author: id });
        temporalAuthor.books = books;
      }
      res.json(temporalAuthor);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/name/:name", async (req, res) => {
  res.set("Access-Contol-Allow-Origin", "http://localhost:3000");
  const name = req.params.name;

  try {
    const author = await Author.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (author?.length) {
      res.json(author);
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
    const author = new Author(req.body);
    const createdAuthor = await author.save();
    return res.status(201).json(createdAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Endpoint para eliminar

router.delete("/:id", async (req, res) => {
  res.set("Access-Contol-Allow-Origin", "http://localhost:3000");
  try {
    const id = req.params.id;
    const authorDeleted = await Author.findByIdAndDelete(id);
    if (authorDeleted) {
      res.json(authorDeleted);
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
    const authorUpdated = await Author.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (authorUpdated) {
      res.json(authorUpdated);
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

module.exports = { authorRouter: router };

// #region CREATE BOOK / UPDATE DATA
/*
const newAuthor = {
    title: "Trainspotting",
    author: "Irving Welsh",
    pages: 348,
};

fetch("http://localhost:3000/author", {
  "body": JSON.stringify(newAuthor),
  "method": "POST",
  "headers": {
     'Accept': 'application/json',
     'Content-Type': 'application/json'
  },
}).then((data) => console.log(data));

fetch("http://localhost:3000/author/64482163d77e7c8bb3e12523", {
  "body": JSON.stringify({pages:123}),
  "method": "PUT",
  "headers": {
     'Accept': 'application/json',
     'Content-Type': 'application/json'
  },
}).then((data) => console.log(data));

*/
// #endregion
