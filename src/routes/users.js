const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");

const { body, check } = require("express-validator");
const upload = require("../middlewares/multer");
const validateLogin = require("../middlewares/validateLogin");
const validateRegister = require("../middlewares/validateRegisterMiddelware");

const userLogged = require("../middlewares/userLoggedMiddleware");
const guestLoggedMiddleware = require("../middlewares/guestLoggedMiddleware");


//REGISTER

router.get("/register", guestLoggedMiddleware, usersController.register);
router.post("/createUser", upload.single("img"), validateRegister, usersController.createUser);

//LOGIN

router.get("/login", guestLoggedMiddleware, usersController.login);
router.get("/logout", userLogged, usersController.logOut);

router.post("/login", validateLogin, usersController.processLogin);

//perfil
router.get("/perfil", usersController.perfil)


module.exports = router;
