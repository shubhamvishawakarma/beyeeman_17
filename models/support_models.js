// creat user model schema
const mongoose=require('mongoose');
const supportSchema = new mongoose.Schema({

userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
},

title:{
           type:String,
},
description:{
           type:String,
},
status:{
           type:Number,
           default:0,
},

},{timestamps:true});
module.exports =supportModel= mongoose.model("support",supportSchema);


