const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-Auth')
const multer = require('multer');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null , './uploads/')
    },
    filename:function(req,file,cb)
    {
        cb( null , file.originalname)
    }
})

const fileFilter = (req , file , cb) =>{
    if(file.mimetype === 'image/jpeg' ||file.mimetype === 'image/jpg' || file.mimetype === 'image/png')
    {
        cb(null , true);
    }
    else{
        cb(null , false);
    }
}

const upload = multer({
    storage:storage , 
    limits:{
    fileSize : 1024 * 1024 *5
    },
    fileFilter : fileFilter
})




router.get('/' , (req,res,next) =>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(doc =>{
        console.log(doc);
        const response = {
            count : doc.length,
            product : doc.map(d =>{
                return {
                    name : d.name,
                    price : d.price,
                    _id : d._id,
                    productImage : d.productImage,
                    reuest : {
                        type : "Get",
                        url : "localhost:3000/product/"+d._id
                    }
                }
            })
        }
        // if(doc.length>=0)
        // {
            res.status(200).json(response)
        // }
        // else{
        //     res.status(404).json({
        //         message : "no entries found"
        //     })
        // }
    }).catch(err =>{
        console.log(err)
        res.status(500).json({
            error : err
        })
    })
})


router.get('/:productId'  , (req,res,next) =>{
    const prodId = req.params.productId
    Product.findById(prodId)
    .select('name price _id productImage')
    .exec()
    .then(doc =>{
        console.log(doc)
        if(doc)
        {
            res.status(200).json({
                name : doc.name,
                price : doc.price,
                _id : doc._id,
                request : {
                    type: "Get",
                    url : "localhost:3000/product/"+doc._id
                }
            })
        }
        else{
            res.status(404).json({
                message : 'no valid entry'
            })
        }
    }).catch(err =>{
        res.status(500).json({
            error : err
        })
    })
});

router.post('/' , checkAuth , upload.single('productImage') ,  (req,res,next) =>{
    console.log(req.file)
    const product  = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage : req.file.path
    });
    product
       .save()
       .then(result =>{
           console.log(result)
           res.status(201).json({
            messgae: "handling post request",
            product : result
        })
       }).catch(err =>{
           console.log(err);
           res.status(500).json({
               error : err
           })
       })
    
});

router.patch('/:productId',checkAuth , (req,res,next) =>{
    const prodId = req.params.productId;
    Product.findByIdAndUpdate(prodId , req.body , {
        new : true
    })
    .select("name price _id")
    .then(prod =>{
        console.log(prod)
        res.status(200).json({
            name : prod.name,
            price : prod.price,
            _id : prod._id,
            request : {
                type  :"Get",
                url : "localhost:3000/product/"+prod._id
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        })
    })
})

router.delete('/:productId', checkAuth , (req,res,next) =>{
    const prodId = req.params.productId;
    Product.remove({_id : prodId})
    .exec()
    .then(result =>{
        res.status(200).json(result)
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        })
    })
})

module.exports = router;