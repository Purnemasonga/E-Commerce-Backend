const mongoose=require("mongoose")

// THEN AND CATCH BLOCK
const connection=()=>{
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("Database Connected Successfully")
    }).catch((err)=>{
        console.log("failed to connect DB:", err)
    });
}


// const connection = async()=>{ TRY AND CATCH BLOCK
    // try{ 
    //     await mongoose.connect(process.env.MONGODB_URL);
    //     console.log("Database connected successfully");=

    // }catch (error) {
    //     console.log("failed to connect DataBase:", err);
    // }
// } 

module.exports=connection;