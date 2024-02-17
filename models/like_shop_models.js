//create schema                                                             
const mongoose=require("mongoose");
const likeShopSchema=mongoose.Schema({
  userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
  },
 shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender"
  },
  like_shop_status:{
        type:String,
        default:0
  },
});
module.exports=likeShopModel=mongoose.model("like_shop",likeShopSchema);
