//all the products related routes should be in this file
// to import router need to import express and then need to import router

const {
  addProducts,
  editProducts,
  deleteProduct,
  getProductBasedOnId,
  filterProductsBasedOnPrice,
  sortProductsBasedOnPrices,
  getAllProducts,
} = require("../controller/productController");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/authAdmin");
const express = require("express");
const router = express.Router();

router.post("/add-products", isAdmin, addProducts);
router.get("/get-allproducts",getAllProducts);
router.get("/get-product/:id",getProductBasedOnId);
router.delete("/delete-product/:id", verifyToken, isAdmin, deleteProduct)
router.put("/edit-product/:id",  verifyToken, isAdmin ,editProducts);
router.get("/filter-products",filterProductsBasedOnPrice); //** http://localhost:6000/products/filter-products? max=50000 && min=10000
router.get("/sort-products",sortProductsBasedOnPrices)

module.exports = router;



// addProducts, 
//     getProducts , 
//     sortProductsBasedOnPrices,
//     filterProductsBasedOnPrice, 
//     getProductBasedonId,
//     deleteProduct




module.exports=router;
