const path = require("path");
const fs = require("fs");
const sequelize = require("sequelize");
const db = require("../../database/models");
const res = require("express/lib/response");

/**
 *
 * @swagger
 * components:
 *    schemas:
 *      product:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            description: Product Name
 *          discount:
 *            type: integer
 *            description: Discount product
 *          detail:
 *            type: string
 *            description: Detail product
 *          stock:
 *            type: string
 *            description: stock product
 *          category:
 *            type: string
 *            description: category product
 *          color:
 *            type: string
 *            description: color product
 *          price:
 *            type: string
 *            description: price product
 *          size:
 *            type: string
 *            description: size product
 *          status:
 *            type: string
 *            description: status product
 *      error:
 *        type: object
 *        properties:
 *          error:
 *             type: string
 *             description: El ID no existe en nuestra base de datos
 */

const productApiController = {
  /**
   *
   * @swagger
   * /api/products:
   *  get:
   *      summary: get all products
   *      tags: [Products]
   *      responses:
   *        200:
   *          description: Get all products
   *          content:
   *            application/json:
   *               schema:
   *                type: array
   *                items:
   *                $ref: '#/components/schemas/product'
   *        404:
   *          description: Not found products in db
   *          content:
   *            application/json:
   *               schema:
   *                type: object
   *                $ref: '#/components/schemas/error'
   *
   */
  products: function (req, res) {
    let todosProductos = db.Products.findAll({
      include: [{ association: "category" }],
    });
    let todasCategorias = db.Category.findAll({
      include: [{ association: "products" }],
    });
    Promise.all([todosProductos, todasCategorias])
      .then(function ([products, category]) {
        res.json({
          count: products.length,

          countByCategory: category.map((cate) => {
            return {
              id_category: cate.id_category,
              name: cate.name,
              count_products: cate.products.length,
            };
          }),
          products: products.map((produ) => {
            return {
              id: produ.id_product,
              name: produ.name,
              discount: produ.discount,
              detail: produ.detail,
              stock: produ.stock,
              category: produ.category.name,
              price: produ.price,
              size: produ.size,
              img: ("http://localhost:3000/images/products/" + produ.img),
            };
          }),
        });
      })
      .catch((error) => {
        error = "No existe ningun producto en la base de datos";
        return res.status(404).json({
          error,
        });
      });
  },

  /**
   *
   * @swagger
   * /api/products/{id}:
   *  get:
   *      summary: get product by id
   *      tags: [Products]
   *      parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *          required: true
   *      responses:
   *        200:
   *          description: Get product by id
   *          content:
   *            application/json:
   *               schema:
   *                type: object
   *                $ref: '#/components/schemas/product'
   *        404:
   *          description: Not found in db
   *          content:
   *            application/json:
   *               schema:
   *                type: object
   *                $ref: '#/components/schemas/error'
   *
   */
  productById: function (req, res) {
    db.Products.findByPk(req.params.id, {
      include: [
        {
          association: "category",
        },
      ],
    })
      .then((product) => {
        return res.status(200).json({
          id: product.id,
          name: product.name,
          discount: product.discount,
          detail: product.detail,
          stock: product.stock,
          category: product.category.name,
          color: product.color,
          price: product.price,
          size: product.size,
          img: product.img,
          status: 200,
        });
      })
      .catch((error) => {
        error =
          "El ID " + req.params.id + " no existe en nuestra base de datos";
        return res.status(404).json({
          error,
        });
      });
  },
};

module.exports = productApiController;
