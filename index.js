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
app.use(express.static('public'));

app.use(cookieParser());
app.use('/user', userRoute);
app.use('/',indexRoute);


const port = process.env.PORT

app.listen(port,()=>{
      console.log(`server is running on the port ${port}`)
})