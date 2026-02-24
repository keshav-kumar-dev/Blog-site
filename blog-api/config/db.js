const mongoose = require("mongoose");


const db = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
    }
    catch(err){
        console.log("Database not connected")
        throw new Error(err.message);
    }

}

module.exports = db;