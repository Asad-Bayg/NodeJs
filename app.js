const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const morgan = require('morgan');

const productRouter = require('./api/routes/product');
const orderRouter = require('./api/routes/order');
const userRouter = require('./api/routes/user')
mongoose.connect('mongodb+srv://asad-baig:asadbaig123@cluster0.xmfi0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
() =>{
    console.log('connected')
})




app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use((req,res,next) =>{
    //can use by different server
    res.header('Access-Control-Allow-Origin' , '*')
    //header sent along with request
    //All this headers are appended to incoming request
    res.header('Access-Control-Allow-Headers' ,
     'Origin ,X-Requested-With , Content-Type , Accpet , Authorization')
     if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods' , 'PUT , POST , GET , PATCH , DELETE')
        return res.status(200).json({});
    }
    next()
}) 


app.use('/product' , productRouter);
app.use('/order' , orderRouter);
app.use('/user' ,userRouter)

app.use((req,res,next) =>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next) =>{
    res.status(error.status || 500)
    .json({
        message : error.message
    })
})

// app.use((req,res,next) =>{
//     res.status(200).json({
//         message : "it works"
//     })
// })

module.exports = app;