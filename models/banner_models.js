// creat user model schema
const mongoose=require('mongoose');
const bannerSchema = new mongoose.Schema({
image: {
    type: String,
},
banner_link: {
    type: String,
}, 
b_status: {
    type: Number,
},
 
},{timestamps:true});
module.exports = BannerModel= mongoose.model("banner",bannerSchema);