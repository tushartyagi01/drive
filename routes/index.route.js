
const upload =require('../middleware/multer.middleware')
const express= require('express');
const  uploadOnCloudinary= require('../util/cloudinary');
const router = express.Router();
const authMiddleware= require('../middleware/auth');
const fileModel= require('../models/file.model');
const axios= require('axios');
const fs= require('fs');
const savedFilePath = require('path');
const { schema } = require('../models/user.model');



router.get('/home', authMiddleware,async(req,res)=>{
        const userFiles= await fileModel.find({ user: req.user.userId});
        console.log(userFiles);
        res.render('home',
                {files:userFiles}
        );
})

router.post('/upload', authMiddleware, upload.single('file'), async (req,res)=>{
        const tmpPath= await req.file?.path;

        console.log(tmpPath,"tmpPath");
        if(!tmpPath){
                return res.status(400).json({
                        message:"file is not uploaded",
                })
        }
       const img= await uploadOnCloudinary(tmpPath);
       if(!img){
        return  res.status(400).json({
                message:" file upload failed"
         })
       }
        const newFile= await fileModel.create({
                path:img.url,
                originalName:img.original_filename,
                user:req.user.userId,

        });
       console.log(img);
       console.log(req.body);
       console.log(req.file);
       res.redirect('/home');
   
      
})

router.get('/download/:path',authMiddleware, async(req,res)=>{
 
       const loggedInUserId= req.user.userId;
       const path= req.params.path;
       console.log(path);
       const file = await  fileModel.findOne({
            user: loggedInUserId,
            path:path
       })
       
       console.log(file);
       if(!file){
          return res.status(401).json({
                message:"unauthorized"
          })
       }
     
       const response = await axios.get(file.path, {
        headers: {
            'Authorization': `Bearer ${process.env.CLOUDINARY_API_KEY}`, // If API key is required
            'Accept': 'application/octet-stream', // Or a specific mime type
        },
        responseType: 'arraybuffer', // Important for reading the raw content of the file
    });
    console.log(response);
    const downloadDir = savedFilePath.join(__dirname, 'downloads');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
}
const fileName= savedFilePath.basename(file.path);
const extName=savedFilePath.extname(fileName);
const updatedFileName = file.originalName.replace(extName, '') + extName;
const filePath = savedFilePath.join(__dirname, 'downloads', updatedFileName);
    fs.writeFileSync(filePath, response.data);
//     // If the file is text or JSON, you can return it directly as text:
//     // For example, if the file is a text file
    const fileContent = response.data.toString('utf-8'); // Convert buffer to string if it's text
    res.send("file downloaded successfully");
}) 

router

module.exports= router;