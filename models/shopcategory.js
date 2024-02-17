//create schema                                                             
const mongoose=require("mongoose");
const shopcategorySchema=mongoose.Schema({
  categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
  },
  category_image:{
        type:String
  },
  subcategory:{
        type:String
  },
});
module.exports=shopcategoryModel=mongoose.model("shopcategory",shopcategorySchema);


