//create schema                                                             
const mongoose=require("mongoose");
const likeSchema=mongoose.Schema({
  userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
  },
 shopProductId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"shop_product"
  },
  like_status:{
        type:Number,
        default:0
  },
});
module.exports=likeModel=mongoose.model("like",likeSchema);
