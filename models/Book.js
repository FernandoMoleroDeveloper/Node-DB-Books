const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del libro

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "Dame más detalle que 3 es una mierda"],
      maxLength: [20, "eso es too much pa el body"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: false,
    },
    pages: {
      type: Number,
      required: true,
      minLength: [100, "Menos de 100 paginas es una mierda de libro"],
      maxLength: [10000, "Con tantas páginas eso es infumable"],
    },
    publisher: {
      type: {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        country: {
          type: String,
          required: true,
          trim: true,
          minLength: [3, "Ese pais no puede existir"],
          maxLength: [20, "Ese pais no se puede pronunciar"],
        },
      },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = { Book };
