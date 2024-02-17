const mongoose=require("mongoose");
const addressSchema=new mongoose.Schema({
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
},
place_type:{
    type:String,
},
other_place_type:{
    type:String,
    required:false
},
address:{
    type:String,
    required:false
},
// pincode:{
//     type:Number
// },
// city:{
//     type:String
// },
contact_no:{
    type:String,
    required:false
},
geo_location:{
    type:{type:String},
    coordinates:[]
},
},{timestamps:true});
addressSchema.indexes({location:"2dsphere"});
module.exports =addressModel=mongoose.model("user_addresses",addressSchema);



