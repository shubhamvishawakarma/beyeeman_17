// creat vender model schema
const mongoose=require('mongoose');
const TransactionSchema = new mongoose.Schema({	
userId:{
	type: mongoose.Schema.Types.ObjectId,
	ref: 'user',
	required:true,
}, 
shopId:{
	type:mongoose.Schema.Types.ObjectId,
	ref: 'vender',
	required:true,
},
orderId:{
	type:mongoose.Schema.Types.ObjectId,
	ref: 'order',
	required:true,
},
transaction_no:{
	type:String,
	required:false,
},
transaction_date:{
	type:String,
	required:false,
},
payment_mode:{
	type:String,
	required:false,
},

 
},{timestamps:true});
module.exports = TransactionModel= mongoose.model("transaction_report",TransactionSchema)