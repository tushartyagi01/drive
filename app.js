const express= require('express');
const dotenv= require('dotenv');
const cookieParser=require('cookie-parser');
dotenv.config();
const app=  express();


const connectToDB= require('./config/db');
connectToDB();



const userRoute = require('./routes/user-route')
const indexRoute= require('./routes/index.route')

app.set("view engine", 'ejs');

app.use(cookieParser());
app.use('/user', userRoute);
app.use('/',indexRoute);

app.listen(3000,()=>{
      console.log("server is running on port 3000")
})