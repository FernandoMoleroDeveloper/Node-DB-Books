const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del libro
const allowedCountries = ["COLOMBIA", "ENGLAND", "RUSSIA", "UNITED STATES", "ARGENTINA", "CZECHOSLOVAKIA", "NIGERIA", "SPAIN"];
const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "El nombre tiene que tener al menos 3 letras, sino no es nombre"],
      maxLength: [30, "El nombre no puede tener tantas letras, menudo coñazo"],
    },
    country: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Ese pais no puede existir"],
      maxLength: [20, "Ese pais no se puede pronunciar"],
      enum: allowedCountries,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("Author", authorSchema);

module.exports = { Author };
