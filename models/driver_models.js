// creat user model schema
const mongoose=require('mongoose');
const driverSchema = new mongoose.Schema({
shopId:{
	type:mongoose.Schema.Types.ObjectId,
	ref:"driver",
},

mob:{
	type:Number,
	required:false,
},

fcm_id:{
	type:String,
	required:false,
},

email:{
	type:String,
	required:false,
},

driver_name:{
	type:String,
	required:false,
},

address:{
	type:String,
	required:false,
},

mob_otp:{
	type:Number,
	required:false,
},

licience:{
	type:Number,
	required:false,
},

vehical:{
	type:Number,
	required:false,
},

rating:{
	type:Number,
	default:0,
},

av_rating:{
	type:Number,
	default:0, 
},

image: {
    type:String,
},

is_driver:{ 
    type:Number,
    default:0
},

driver_status:{
    type:Number,
    default:0
},

active_status:{
    type:Number,
},

location:{
    type:{type:String},
    coordinates:[]
},

 
},{timestamps:true});
driverSchema.indexes({location:"2dsphere"});
module.exports = DriverModel= mongoose.model("driver",driverSchema);