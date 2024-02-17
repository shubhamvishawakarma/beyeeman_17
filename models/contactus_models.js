// create about us model schema
const mongoose=require('mongoose');
const contactSchema = new mongoose.Schema({

client_name:{
	type:String
	 
},
phone:{
	type:Number,
	required:false,
},
whatsapp:{
	type:Number,
	required:false,
},
email:{
	type:String,
	required:true,
},



},{timestamps:true});
module.exports =contactModel= mongoose.model("contact",contactSchema);