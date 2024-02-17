const mongoose = require('mongoose')
const loyaltyCartSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vender',
        required: true
    },
    title: {
        type: String, 
        required: true 
    },
    point_per_rupees: { 
        type: Number,
        required: true
    },
    value_of_one_point: {
        type: Number,
        required: true
    },
    mini_redeemable_points: {
        type: Number,
        required: false
    },
},{timestamps:true})

const loyaltyCartModel = mongoose.model('loyalty_cart', loyaltyCartSchema)
module.exports = loyaltyCartModel