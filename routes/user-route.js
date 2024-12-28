const express= require('express');
const bcrypt= require('bcrypt');
const router= express.Router();
const { body,ValidatioResult, validationResult}= require('express-validator');
const userModel= require('../models/user.model')
const jwt= require('jsonwebtoken');
// router.get('/test',(req,res)=>{
//      res.send("user test route");
// });
router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.get('/register', (req,res)=>{
     res.render('register');
})

router.post('/register',
    body('email').trim().isEmail(),
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({min:5}),
    
    
 async   (req,res)=>{
     console.log(req.body);
      const err= validationResult(req);
      if(!err.isEmpty()){
          res.status(400).json({
               error: err.array(),
               messsage:"invalid data"
          })
          
      }
      else{
          const {username,email,password}= req.body;
          const hashPassword= await bcrypt.hash(password,10);
           const newUser= await userModel.create({
               username:username,
               email:email,
               password:hashPassword
           });
           res.json(newUser);
      }
    ;
})

router.get('/login', (req,res)=>{
     res.render('login')
})

router.post('/login', 
     body('username').trim().isLength({min:5}),
     body('password').trim().isLength({min:5}),
     

     
   async  (req,res)=>{
      const err= validationResult(req);

      if(!err.isEmpty){
         return  res.status(400).json({
           error:err,
           message:"invalid data",
         })
      }
      else{
         const {username,password} = req.body;
         const user= await userModel.findOne({
          username:username
         });
         if(!user){
           return res.status(400).json({
               message:"username  is incorrect ",
           })
         }
          const isMatch = await  bcrypt.compare(password,user.password);
          if(!isMatch){
               console.log(user);
               return res.status(400).json({
                    message:"username or password is incorrect",
               })
          }
         //jsonwebtoken

         const token= jwt.sign({
          userId:user._id,
          email:user.email,
          username:user.username
         }, process.env.JWT_SECRET);

        res.cookie('token',token);
        res.send("logged in");
           }


})

module.exports= router;