const port = 3000;
const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const publicPath = path.resolve(__dirname, "../public");
const viewsPath = path.resolve(__dirname, "./views/pages");
const mainRouter = require("./routes/main");
const productosRouter = require("./routes/productos");
const usersRouter = require("./routes/users");
const apiRouter = require("./routes/apis");
const carritoRouter = require("./routes/carrito");
const methodOVerride = require("method-override");
const cookieParser = require("cookie-parser");
const rememberMiddleware = require("./middlewares/rememberMiddlewares");

//swagger doc
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Scaloneta",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [`${path.join(__dirname, "./apis/*.js")}`],
};

//session
app.use(
  session({
    secret: "shh",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(methodOVerride("_method"));
app.use(express.static(publicPath));
app.set("view engine", "ejs");
app.use(cookieParser());
app.set("views", viewsPath);
app.use(express.urlencoded({ extended: false }));
app.use(rememberMiddleware);

app.listen(port, () =>
  console.log("Servidor corriendo en el puerto" + " " + port)
);

app.use("/", mainRouter);

app.use("/products", productosRouter);

app.use("/carrito", carritoRouter);

app.use("/api", apiRouter);

app.use("/users", usersRouter);

//Swagger route
app.use(
  "/api-doc",
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc(swaggerSpec))
);

app.use(function (req, res, next) {
  res.status(404);

  if (req.accepts("html")) {
    res.render("not-found", { url: req.url });
    return;
  }

  next();
});
