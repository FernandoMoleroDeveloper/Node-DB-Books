const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

// Creamos el schema del libro
const allowedCountries = ["COLOMBIA", "ENGLAND", "RUSSIA", "UNITED STATES", "ARGENTINA", "CZECHOSLOVAKIA", "NIGERIA", "SPAIN", "JAPAN"];
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
    authorImage: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Email incorrecto",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: [8, "La contraseña debe tener al menos 8 carácteres"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

authorSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
      this.password = passwordEncrypted;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Author = mongoose.model("Author", authorSchema);

module.exports = { Author };
