// create faq us model schema
const mongoose=require('mongoose');
const faqSchema = new mongoose.Schema({

title:{
	type:String, 
},
text:{
	type:String,
	required:true,
},
type:{
	type:String,
},



},{timestamps:true});
module.exports =faqModel= mongoose.model("faq",faqSchema);