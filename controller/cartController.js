const CartProducts = require("../model/CartModel");
const Products = require("../model/ProductModel");
const mongoose = require("mongoose");

//addToCart
const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "missing required fields" });
    }

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await CartProducts.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!cart) {
      await CartProducts.create({
        userId: userId,
        productIds: [productId],
        totalPrice: product.price,
      });
    } else {
      cart.productIds.push(productId);
      
      // Calculate new total price
      let total = 0;
      for (let pId of cart.productIds) {
        const p = await Products.findById(pId);
        if (p) {
          total += p.price;
        }
      }
      cart.totalPrice = total;
      await cart.save();
    }
    res.status(200).json({ message: "add to cart successfull" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add Cart", error: error.message });
  }
};

//get Cart Products
const getCartProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    const AllProducts = await CartProducts.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$productIds" },
      {
        $lookup: {
          from: "products",
          foreignField: "_id",
          localField: "productIds",
          as: "Products_in_cart",
        },
      },
      {
        $project: { Products_in_cart: 1, _id: 0 },
      },
    ]);
    res.status(200).json({ AllProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//remove Cart products based on ID
const removeCartProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let cart = await CartProducts.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    
    if (cart) {
      const index = cart.productIds.indexOf(productId);
      if (index > -1) {
        cart.productIds.splice(index, 1);
      }
      
      // Recalculate price
      let total = 0;
      for (let pId of cart.productIds) {
        const p = await Products.findById(pId);
        if (p) {
          total += p.price;
        }
      }
      cart.totalPrice = total;
      await cart.save();
    }

    res.status(200).json({ message: "Product removed", removedProducts: cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//remove All Cart Products

//set: initialize empty array all the fields
//un-set:
const removeAllProducts = async (req, res) => {
  try {
    const { userId } = req.query;
    const removeAll = await CartProducts.updateOne(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: { productIds: [] } },
    );

    res.status(200).json({ removeAll });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove all products", error });
  }
};

module.exports = {
  addToCart,
  getCartProducts,
  removeCartProduct,
  removeAllProducts,
};
