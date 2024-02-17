// creat vender model schema
const mongoose=require('mongoose');
const OrderSchema = new mongoose.Schema({	
userId:{
	type: mongoose.Schema.Types.ObjectId,
	ref: 'user',
	required:true,
},
cartId:{
	type:mongoose.Schema.Types.ObjectId,
	ref: 'cart',
	required:true,
}, 
shopId:{
	type:mongoose.Schema.Types.ObjectId,
	ref: 'vender',
	required:true,
},
addressId:{
	type:mongoose.Schema.Types.ObjectId,
	ref: 'user_addresses',
	required:true,
},
order_no:{
	type:Number,
	required:true,
},
discount_price:{
	type:Number,
	required:false,
},
grand_total:{
	type:Number,
	required:true,
},
payment_mode:{
	type:String,
	required:false,
},
order_date:{
	type:String,
	required:true,
},
in_progress_date:{
	type:String,
	required:true,
},
asign_date:{
	type:String,
	required:true,
},
delivery_date:{
	type:String,
	required:true,
},
completed_date:{
	type:String,
	required:true,
},
cancel_date:{
	type:String,
	required:false,
},
status:{
	type:String,
	required:false,
},
order_status:{
	type:String,
	required:true,
},
vender_status:{
	type:String,
	required:false,
},
driver_assign_status:{
	type:String,
	required:false,
},
region:{
	type:String,
	required:false,
},

 
},{timestamps:true});
module.exports = OrderModel= mongoose.model("order",OrderSchema)