const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del libro

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "Dame detalle que 3 es una mierda"],
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
          minLength: 3,
          maxLength: 20,
          uppercase: false,
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
