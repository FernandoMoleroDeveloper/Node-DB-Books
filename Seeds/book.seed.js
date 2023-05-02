const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Book } = require("../models/Book.js");
const { faker } = require("@faker-js/faker");

const bookList = [
  {
    title: "Harry Potter",
    author: "J.K. Rowling",
    pages: 543,
    publisher: {
      name: "Alfaguara",
      country: "Spain",
    },
  },
  {
    title: "1984",
    author: "George Orwell",
    pages: 328,
    publisher: {
      name: "Anaya",
      country: "Spain",
    },
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    pages: 281,
    publisher: {
      name: "Alma Books",
      country: "England",
    },
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    pages: 180,
    publisher: {
      name: "Oberon",
      country: "England",
    },
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    pages: 279,
    publisher: {
      name: "Koehler",
      country: "USA",
    },
  },
];

for (let i = 0; i < 50; i++) {
  const newBook = {
    title: faker.music.songName(),
    author: faker.name.fullName(),
    pages: faker.random.numeric(3),
  };
  bookList.push(newBook);
}

const bookSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borrar datos
    await Book.collection.drop();
    console.log("Books borrados");

    // Añadimos libros
    const documents = bookList.map((book) => new Book(book));
    await Book.insertMany(documents);

    console.log("Datos guardados correctamente!");
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LA BBDD");
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

bookSeed();
