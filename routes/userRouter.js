const express = require("express");
const {register,getUsers, login, forgetPassword, updateProfile, getUserBasedonId} = require("../controller/userController");

const router=express.Router();


router.post("/register",register) //http://localhost:5000/user/register
router.get("/get-users",getUsers)
router.post("/login",login);
router.get("/get-user/:id", getUserBasedonId);
router.patch("/update-profile/:id", updateProfile);
router.patch("/forget-password",forgetPassword)

module.exports=router;

