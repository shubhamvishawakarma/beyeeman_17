// creat user model schema
const mongoose=require('mongoose');
const productSchema = new mongoose.Schema({

subcategory:{
  type:String,      
}, 

category:{
  type:String,        
},

shopId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"vender"
},

products_name:{ 
  type:String,
  required:false,
},

brand_name:{
  type:String,
  required:false,
},

barcodes:{
  type:Array,
  required:false,
},

variants:{
  type:String,
  required:false,
},

mrp_price:{
  type:Number,
  required:false,
},

sale_price:{
  type:Number,
  required:false,
},

discount:{
  type:Number,
  required:false,
},

gst:{
  type:Number,
  required:false,
},

images: {
  type:Array,
}, 

description:{
  type:String,
  required:false,
},
select_variants:{
  type:String,
  required:false,
},
select_mrp_price:{
  type:Number,
  required:false,
},
select_sale_price:{
  type:Number,
  required:false,
},

ap_status:{
  type:Number,
  default:0
},

act_status:{
  type:Number,
  default:0
},

like_status:{
  type:Number,
  default:0
},

stock_status:{
  type:Number,
  default:0
},

},{timestamps:true});
module.exports =ProductModel= mongoose.model("shop_product",productSchema);

