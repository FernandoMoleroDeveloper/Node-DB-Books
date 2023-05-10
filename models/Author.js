const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del libro

const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("Author", authorSchema);

module.exports = { Author };
