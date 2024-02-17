// create pollicy us model schema
const mongoose = require('mongoose');

const qrcodeSchema = new mongoose.Schema({
  userId: {
    type:mongoose.Types.ObjectId,
    ref: "user"
  },
  shopId: {
    type:mongoose.Types.ObjectId,
    ref: "vender"
  },
   status: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("qrcode", qrcodeSchema);
