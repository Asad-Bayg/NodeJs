const express = require('express');

const mongoose = require('mongoose')
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-Auth')

const router = express.Router();

router.get('/' ,checkAuth , (req,res,next) =>{
    Order.find()
    .select("product Quentity _id")
    .populate('product'  , 'price')
    .exec()
    .then(order =>{
        res.status(200).json({
            count : order.length,
            orders : order.map( o =>{
                return {
                    _id : o._id,
                    product : o.product,
                    Quentity : o.Quentity,
                    request : {
                        type : "Get",
                        url : "localhost:3000/order/"+o._id
                    }

                }
            })
        })
        }).catch(err =>{
            res.status(500).json(err);
        })
})

router.get('/:orderId' , checkAuth , (req,res,next) =>{
    const id = req.params.orderId;
    Order.findById(id)
    .populate('product')
    .exec()
    .then(order =>{
        if(!order)
        {
            return res.status(404).json({
                message : "order not found"
            })
        }
        res.status(200).json({
            order:order,
            request : {
                type : "Get",
                url :"localhost:3000/orders"
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        })
    })
})

router.post('/' ,checkAuth , (req,res,next) =>{
    Product.findById(req.body.productId)
    .then(product =>{
        if(!product)
        {
            return res.status(404).json({
                message : "product not found"
            })
        }
        const order = new Order({
        _id : mongoose.Types.ObjectId(),
        Quentity : req.body.Quantity,
        product : req.body.productId
        })
        return order.save()
    })
    .then(result =>{
        console.log(result)
        res.status(201).json({
            message : "Order Stored",
            created_Order : {
                _id : result._id,
                product : result.product,
                Quantity : result.Quantity,
                request : {
                    type : "Get",
                    url : "localhost:3000"
                }
            } 
        });
    })
    .catch(err =>{
        console.log(err)
        res.status(200).json({
            error : err
        })
    })
})

router.delete('/:orderId' , checkAuth ,(req,res,next) =>{
    const id = req.params.orderId;
    Order.remove({_id : id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message : "order deleted",
            request : {
                type : "DELETE",
                url : "localhost:3000"
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        })
    })
})

module.exports = router;