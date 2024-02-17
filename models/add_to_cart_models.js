// creat vender model schema
const mongoose=require('mongoose');
const UserCartSchema = new mongoose.Schema({
user_id:{
	type: mongoose.Schema.Types.ObjectId, 
  ref: 'user',
  required:true,
},
addressId:{
  type:mongoose.Schema.Types.ObjectId,
  ref: 'user_addresses',
  required:true,
},
products: [
    {
      shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shop_product',
        required: true,
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
      },
      product_name: {
        type: String,
        required: false,
      },
      brand: {
        type: String,
        required: false,
      },
      barcode: {
        type: String,
        required: true, 
      },
      weight: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true, 
      },
      mrp: {
        type: Number,
        required: true,
      },
      booking_status:{
         type:String,
         required: false,
         //default:1
      },
    },
  ],
},{timestamps:true});
module.exports = UserCartModel= mongoose.model("user_cart",UserCartSchema)