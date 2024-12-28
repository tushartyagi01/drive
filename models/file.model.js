const mongoose = require('mongoose');

const fileSchema= mongoose.Schema({
    path:{
        type:String,
        required:[true,"path is required"]
    },
    originalName:{
        type:String,
        required:[true, "original name is required"],
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: [true,'user is required']
    }
});

const fileModel= mongoose.model('files',fileSchema);

module.exports= fileModel;