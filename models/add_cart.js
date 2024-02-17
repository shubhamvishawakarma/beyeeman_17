// creat vender model schema
const mongoose=require('mongoose');
const cartSchema = new mongoose.Schema({
userId:{
	type: mongoose.Schema.Types.ObjectId, 
  ref: 'user',
  required:true,
},
products: [
    {
      shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vender',
        required: true,
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shop_product',
        required: true,
      },
      products_name: {
        type: String,
        required: false,
      },
     
      variant: { 
        type: String,
        required: false,
      },
      qty: {
        type: Number,
        default:1, 
      },
      price: {
        type: Number,
        required: false,
      },
      cart_status:{
         type:Number,
         default:0,
      },
       
    },
  ],
booking_status:{
  type:Number,
  default:0,
},
      
},{timestamps:true});
module.exports =cartModel= mongoose.model("cart",cartSchema)