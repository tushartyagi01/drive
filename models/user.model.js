const mongoose =require('mongoose');

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        minLength:[3,"Minimum length is required"],
        lowercase:true,

    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        minLength:[13,"email Minimum length is required"],
        lowercase:true,

    },
    password:{
        type:String,        
        required:true,
        trim:true,
        minLength:[5,"password Minimum length is required"],
   

    },
   
});

const userModel= mongoose.model('user',userSchema);

module.exports= userModel;