const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcryt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user');

router.post('/signup' ,(req,res,next) =>{
    User.find({email : req.body.email})
    .then(exists =>{
        if(exists.length >= 1)
        {
            return res.status(409).json({
                error : "already exist this email"
            })
        }
        else{
            bcryt.hash(req.body.password , 10  , (err, hash) =>{
                if(err)
                {
                    return res.status(500).json(err)
                }
                else{
                    const user = new User({
                        _id : mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash
                    })
                    user.save()
                    .then(user =>{
                        console.log(user)
                        res.status(201).json({
                            message : 'user created',
                            user : user
                        })
                    })
                    .catch(err =>{
                        console.log(err)
                        res.status(500).json({
                            error:err
                        })
                    })
        
                }
            })

        }
    })
    
   
})
router.post('/login' , (req,res,next) =>{
    User.find({email : req.body.email})
    .exec()
    .then(user =>{
        if(user.length < 1)
        {
            return res.status(401).json({
                message :'Auth fail'
            })
        }
        bcryt.compare(req.body.password , user[0].password , (err , result) =>{
            if(err)
            { 
                return res.status(401).json({
                message : 'Auth fail'
                })
            }
            if(result)
            {
                const token = jwt.sign({
                    email : user[0].email,
                    userId : user[0]._id
                },
                'secret' ,
                {
                    expiresIn : '1h'
                } )
                return  res.status(201).json({
                    message : 'sucessfully login',
                    token : token
                })
            }
            
            res.status(401).json({
                message : 'Auth fail'
            })

        })
    }).catch(err =>{
        res.status(400).json({
            message : 'Auth fail',
            error : err
        })
    })
})

router.delete('/:userId' ,(req,res,next)=>{
    User.remove({_id : req.params.userId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message : 'deleted'
        })
    }).catch(err =>{
        res.status(500).json({
            error : err
        })
    })
})

module.exports = router;