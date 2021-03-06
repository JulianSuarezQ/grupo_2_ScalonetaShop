const Cart = require("./Cart");

module.exports = (sequelize, dataTypes) => {
  const alias = "CartProducts";
  const cols = {
    id: {
      type: dataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cart: {
      //fg
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    id_product: {
      //fg
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  };
  const config = {
    tableName: "cart_product",
    timestamps: false,
  };

  const CartProduct = sequelize.define(alias, cols, config);

  CartProduct.associate = function(modelos){
    CartProduct.belongsTo(modelos.Carts, {
      as: "cart",
      foreignKey: "id_cart"
    });
    CartProduct.belongsTo(modelos.Products, {
      as: "Products",
      foreignKey: "id_product"
    });
  }

  return CartProduct;
};
