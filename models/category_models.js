// creat user model schema
const mongoose=require('mongoose');
const categorySchema = new mongoose.Schema({
category_name:{
	type:String,
	required:false,
},
image: {
    type: String, 
 },
c_status:{
    type:Number,
    default:0
},
 
},{timestamps:true});
module.exports = CategoryModel= mongoose.model("category",categorySchema);