const  cloud = require( 'cloudinary');
const cloudinary= cloud.v2;
const fs =require('fs');

                 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadOnCloudinary= async (localFilePath)=>{
    try{
           if(!localFilePath){
            return null;
           }
           //upload the file on cloudinary;
          const response =await cloudinary.uploader.upload(localFilePath, {
              resource_type:"auto"
           });

        //file has been uploaded successfully
        console.log("file is uploaded successfully", response.url);
        return response;


    }catch(err){
        console.log(err);
            fs.unlinkSync(localFilePath); //remove the locally saved temp file as the  upload operation got failed
            return null;
    }
}

module.exports= uploadOnCloudinary;