const path = require("path");
const fs = require("fs");
const sequelize = require("sequelize");
const db = require("../../database/models");
const res = require("express/lib/response");
const { validationResult, body } = require("express-validator");
const Op = db.Sequelize.Op;

const productosController = {
  list: function (req, res) {
    db.Products.findAll({
      include: [{ association: "category" }, { association: "cart" }],
    }).then(function (products) {
      res.render("products", {
        productos: products,
        list: true,
        resultado: true,
      });
    });
  },

  search: function (req, res) {
    let search = req.body.search;
    db.Products.findAll({
      include: [{ association: "category" }, { association: "cart" }],
      where: {
        name: { [Op.like]: "%" + search + "%" },
      },
    })
      .then((products) => {
        res.render("products", {
          list: true,
          resultado: true,
          productos: products,
        });
      })
      .catch((e) => {
        res.render("products", {
          list: true,
          productos: 0,
        });
      });
  },

  create: function (req, res) {
    db.Category.findAll({
      includes: [{ association: "products" }],
    }).then(function (categorias) {
      res.render("products", {
        categorias: categorias,
        list: false,
      });
    });
  },

  store: (req, res) => {
    let validation = validationResult(req);
    console.log(validation);

    if (!validation.isEmpty()) {
      db.Category.findAll().then((categorias) => {
        res.render("products", {
          errors: validation.mapped(),
          list: false,
          productos: req.body,
          categorias: categorias,
        });
      });
    } else {
      db.Products.create({
        name: req.body.name,
        discount: parseInt(req.body.discount, 10),
        detail: req.body.detail,
        stock: req.body.stock,
        id_category: parseInt(req.body.id_category, 10),
        color: req.body.color,
        price: parseInt(req.body.price, 10),
        size: req.body.size,
        img: req.file?.filename ? req.file.filename : "default-image.png",
      });
      res.redirect("/products");
    }
  },

  descriptionProduct: function (req, res) {
    res.render("descripcionProducto");
  },

  detail: (req, res) => {
    let idProducto = req.params.id;
    db.Products.findByPk(idProducto, {
      include: [{ association: "category" }],
    }).then(function (producto) {
      res.render("descripcionProducto", { productos: producto });
    });
  },

  edit: (req, res) => {
    let idProducto = req.params.id;
    let todosProductos = db.Products.findByPk(idProducto, {
      include: [{ association: "category" }],
    });
    console.log(todosProductos);
    let todasCategorias = db.Category.findAll();
    Promise.all([todosProductos, todasCategorias]).then(function ([
      productoMostrar,
      categoriaMostrar,
    ]) {
      res.render("product-edit-form", {
        productToEdit: productoMostrar,
        categoriaToEdit: categoriaMostrar,
      });
    });
  },

  update: (req, res) => {
    let validation = validationResult(req);
    console.log(validation);
    console.log("CATEGORIA " + req.body.id_category);

    if (!validation.isEmpty()) {
      res.render("product-edit-form", {
        errors: validation.mapped(),
        list: true,
        productToEdit: req.body,
      });
    } else {
      db.Products.update(
        {
          name: req.body.name,
          discount: parseInt(req.body.discount, 10),
          detail: req.body.detail,
          stock: req.body.stock,
          id_category: req.body.id_category,
          color: req.body.color,
          price: parseInt(req.body.price, 10),
          size: req.body.size,
          img: req.file?.filename
            ? req.file.filename
            : "default-image-afa.jpeg",
        },
        {
          where: { id_product: req.params.id },
        }
      );
      res.redirect("/products");
    }
  },

  PagDelete: (req, res) => {
    let idProducto = req.params.id;
    db.Products.findByPk(idProducto, {
      includes: [{ association: "category" }],
    }).then(function (productoMostrar) {
      res.render("delete", { productos: productoMostrar });
    });
  },

  delete: (req, res) => {
    const id = req.params.id;
    db.Products.destroy({
      where: {
        id_product: id,
      },
    });
    res.redirect("/products");
  },
};

module.exports = productosController;
