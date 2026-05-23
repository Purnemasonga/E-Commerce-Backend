const express=require("express")
const router=express.Router();

const {
    addToCart,
    getCartProducts,
    removeCartProduct,
    removeAllProducts
}=require("../controller/cartController");

const isUser=require("../middleware/authUser")
router.post("/add-cart", addToCart);
router.get("/get-cartproducts/:userId", isUser, getCartProducts);
router.patch("/remove-product", isUser, removeCartProduct);
router.patch("/clear-cart", isUser, removeAllProducts);


module.exports=router;
