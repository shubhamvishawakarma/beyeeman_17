// creat vender model schema
const mongoose=require('mongoose');
const AsianDriverSchema = new mongoose.Schema({	 
shopId:{
	type:mongoose.Schema.Types.ObjectId,
	ref: 'vender',
	required:true, 
},
userId:{
	type: mongoose.Schema.Types.ObjectId,
	ref: 'user',
	required:true,
},
orderId:{
	type:mongoose.Schema.Types.ObjectId,
	ref: 'order',
	required:true,
},
driverId:{
	type:mongoose.Schema.Types.ObjectId,
	ref: 'driver',
	required:true,
},
driver_status:{
    type:String,
    required:false,
},
 
},{timestamps:true});
module.exports = AsianDriverModel= mongoose.model("asian_driver",AsianDriverSchema)