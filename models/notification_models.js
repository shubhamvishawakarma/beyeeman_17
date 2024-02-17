// creat user model schema
const mongoose=require('mongoose');
const notificationSchema = new mongoose.Schema({

userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false
},
shopId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "vender",
    required: false
},
orderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: false
},
driverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "driver",
    required: false
},
order_no:{
    type:Number,
    required:false,
},
title:{
    type:String,
    required:false
},
shop_title:{
    type:String,
    required:false
},
driver_title:{
    type:String,
    required:false
},
notification:{
    type:String,
    required:false
},
shop_notification:{
    type:String,
    required:false
},
driver_notification:{
    type:String,
    required:false
},
date:{
    type:String,
    required:false
},
type:{
    type:String,
    required:false
},
image:{
    type:String,
    required:false
},
admin_status:{
    type:String,
    required:false
},

},{timestamps:true});
module.exports =notificationModel= mongoose.model("notification",notificationSchema);