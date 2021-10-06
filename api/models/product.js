const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productModel = new schema({
    _id : { type : schema.Types.ObjectId},
    name :{ type: String ,required : true},
    price :{type : Number , required : true},
    productImage :{type : String , required : true}
})

module.exports = mongoose.model('Product' , productModel);