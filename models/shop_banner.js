const mongoose=require("mongoose");
const shopbannerSchema=mongoose.Schema({
    shopId:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"vender",
    },
    shopbanner:{
        type:Array,
        required:true,
    },
    shoppdf:{
        type:Array,
        required:false,
    },
    banner_status:{
        type:Array,
        //default:1,
        required:true,
    },
    
},{timestamps:true});
module.exports=shopbannerModel=mongoose.model("shopbanner",shopbannerSchema);

