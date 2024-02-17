// creat user model schema
const mongoose=require('mongoose');
const masterSchema = new mongoose.Schema({

product_name:{
	type:String,
	required:false,
},
category_name:{         
	    type: String,
        required:true,
}, 
subcategory:{         
	   type: String,
       required:true,
},
brand_name:{
	type:String,
	required:false,
},
barcode:{
	type:Array, 
	required:false,
},
variants:{
	type:String,
	required:false,
},
// qty:{
// 	type:Number,
// 	required:false,
// },
gst:{
	type:Number,
	required:false,
},
// mrp:{
// 	type:Number,
// 	required:false,
// },
images: {
       type:Array,
},
description:{
	type:String,
	required:false,
},
act_status:{
        type:Number,
        default:0
},
 
},{timestamps:true});
module.exports =MasterProductModel= mongoose.model("master_product",masterSchema);