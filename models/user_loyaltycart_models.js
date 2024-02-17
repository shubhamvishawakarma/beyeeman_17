const mongoose = require('mongoose')
const userloyaltyCartSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vender',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    points: {
        type: Number,
        required: true
    }, 
    loyalty_status: {
        type: String,
        required: false
    },
},{timestamps:true})

module.exports =userloyaltyCartModel= mongoose.model("user_loyalty_cart",userloyaltyCartSchema)