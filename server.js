// importing the express and then storing it in an variable
const express = require("express")
//the packages which we are calling must be saved in an variable
const app = express();
//to start the server - 2 parameters: port, 

const env = require("dotenv");
env.config();

const connection = require("./config/database");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const UserRouter = require("./routes/userRouter");
const prompt = require("./routes/promptRouter");
const productRouter = require("./routes/productRouter");

app.use("/products", productRouter);
app.use("/user", UserRouter);
app.use("/ai", prompt);

const cartRouter=require("./routes/cartRouter");
app.use("/cart",cartRouter);




const PORT = process.env.PORT;

connection();

app.listen(PORT, ()=>{
    console.log("server is running on: ", PORT);
});
