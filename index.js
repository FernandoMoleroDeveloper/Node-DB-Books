const express = require("express");
const cors = require("cors");
const { bookRouter } = require("./Routes/book.routes.js");
const { authorRouter } = require("./Routes/author.routes.js");
const { fileUploadRouter } = require("./Routes/file-upload.routes.js");

const main = async () => {
  // Conexión a BBDD
  const { connect } = require("./db.js");
  const database = await connect();

  // Configuración del server

  const PORT = 3000;
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Rutas
  const router = express.Router();
  router.get("/", (req, res) => {
    res.send(`Esta es la home de nuestra API. Estamos utilizando la BBDD de ${database.connection.name}`);
  });
  router.get("*", (req, res) => {
    res.status(404).send("Vaya!! no hemos encontrado la ruta, busca en GoogleMaps");
  });

  // Middleware de logs en consola
  app.use((req, res, next) => {
    const date = new Date();
    console.log(`Peticion de tipo ${req.method} a la url ${req.originalUrl} el ${date}`);
    next();
  });

  // Usamos las rutas
  app.use("/book", bookRouter);
  app.use("/author", authorRouter);
  app.use("public", express.static("public"));
  app.use("/file-upload", fileUploadRouter);
  app.use("/", router);

  // Middleware de errores
  app.use((err, req, res, next) => {
    console.log("*** INICIO ERROR ***");
    console.log(`PETICION FALLIDA: ${req.method} a la url ${req.originalUrl}`);
    console.log(err);
    console.log("*** FIN ERROR ***");

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else {
      res.status(500).json(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`);
  });
};
main();
