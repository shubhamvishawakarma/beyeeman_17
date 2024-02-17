// creat user model schema
const mongoose=require('mongoose');
const userSchema = new mongoose.Schema({
phone:{
	type:String,
	required:false,
},
email:{
	type:String,
	required:false, 
},
password:{
	type:String,
	required:false,
},
otp:{
	type:Number,
	required:false,
},
image: {
       type: String,
},
user_name:{
	type:String,
	required:false,
},
wallet_ammount:{
	type:Number,
	required:false,
	default:0
},
fcm_id:{
	type:String,
	required:false,
},
is_user:{
    type:Number,
    default:0
},
 
},{timestamps:true});
module.exports = UserModel= mongoose.model("user",userSchema);