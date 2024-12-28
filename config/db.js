const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGO_URL).then(()=>{
         console.log("db connected successfully");
    });
}

module.exports= connectDB;