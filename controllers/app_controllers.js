//import all models of admin panel here
const User=require("../models/user_models");  
const Category=require("../models/category_models"); 
const Banner=require("../models/banner_models"); 
const MasterProduct=require("../models/master_product_models");
const ContactUs=require("../models/contactus_models");
const Term=require("../models/term_condiction_models"); 
const Privacy=require("../models/privacy_policy_models"); 
const Faq=require("../models/faq_models");  
const Address=require("../models/user_address_models");   
const Support=require("../models/support_models");   
const Vender=require("../models/vender_models");   
const ShopBanner=require("../models/shop_banner");  
const Shopcategory=require("../models/shopcategory"); 
const ShopProduct=require("../models/shopproduct_models");
const Qrcodes=require("../models/qrcode_models");
const Like=require("../models/like_models");  
const Cart=require("../models/add_cart"); 
const Order=require("../models/order_models");
const LikeShop=require("../models/like_shop_models");
const Asign_Diver=require("../models/asign_driver_models");
const Notification=require("../models/notification_models");
const Driver=require("../models/driver_models");
const loyaltyCartModel = require("../models/loyaltycart_models");
const UserLoyalty = require("../models/user_loyaltycart_models");
const faqListModel = require("../models/faq_list_models");
const geolib = require('geolib');
const admin = require('firebase-admin');
const axios = require('axios');
//const fetch = require('node-fetch');
const token = ['AAAA25bMJfA:APA91bHkMvcJG3ihwBBKf4TjHhWjyZXw0jdJS_KBuXxJbD6cRNmlj-eZx3CtbTho-RpihJzeuKRmkw7T4gU41W63udeh9gB2gIiQlKGnNkmmb6RGW9rBq3dC4nWnUGiJoq89YKyoWALP'];  
const serviceAccount = require("C:/Users/Sumit/Desktop/BeyeemanDwa/needooadminjsom.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});  


/*---------------import module----------------------------*/ 
const mongoose = require('mongoose');
    
  
/*................user register and login api...............*/
const User_login=async(req,res)=>{

  try{
    const {phone,fcm_id}=req.body; 
    const Otp = Math.floor(1000 + Math.random() * 9000);
    //const message = 'Your OTP is: {{Otp}}';
    //const route = 'Otp';
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=A3ndvI0uNgetJ7FWRyhpEQ4xYk2Go5ja6wXmBOHL8SZz91PcKrPgz3lScCdDNn59HW62ZLohum0iYx74&route=otp&variables_values=${encodeURIComponent(Otp)}&flash=0&numbers=${encodeURIComponent(phone)}`;
    const response = await axios.get(url);
    console.log(response)

    // exist user
    const register_user= await User.findOne({phone});
    if(register_user){
   
      const update_data = await User.findOneAndUpdate({phone},{$set:{otp:Otp,fcm_id:fcm_id}},{new:true});
      const data=await update_data.save();
      res.status(200).json({
        result:"true",
        message:"user login successfully",
        data:data
      });

    }else{
      if(phone && fcm_id ){
        const user = new User({phone,otp:Otp})
        const user_data=await user.save()
       
        res.status(200).json({
          result:"true",
          message:"user registered sucessfully..",data:user_data
        });
      }else{
        res.status(400).json({
          result:"false",
          message:"parameter required phone and fcm_id"
        });
      }
    }
  }catch(error){
    console.log(error.message)
    res.status(400).json({
      result:"false",
      message:"Internal server error.."
    })
  }
};

/*-------------------verify otp api---------------------*/
const Verifyotp = async (req, res) => {
  try{
    const {phone,otp} = req.body;
    if (otp && phone) {
      const data =await User.findOne({phone,otp});
      if (data) {
        res.status(200).json({
          "result": "true",
          "message": "user login secussfully",
          data
        })
      }else{
        return res.status(400).json({
          "result": "false",
          "message": "Invalid phone or otp, please enter valid phone or otp",
        });
      }
    }else{
      res.status(400).json({
        "result": "false",
        "message": "required parameters are phone and otp",
      });
    }
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};


/*--------------------resend otp api--------------------*/
const ResendOtp = async (req, res) => {
  const { phone, fcm_id } = req.body;
  if (!fcm_id || !phone) {
    res.status(400).json({
      "result": "false",
      "message": "required parameters are phone and fcm_id",
    });
  } else {
    const data =await User.findOne({phone});
    if(data){
      var otp = Math.floor(1000 + Math.random() * 9000);
      const url = `https://www.fast2sms.com/dev/bulkV2?authorization=A3ndvI0uNgetJ7FWRyhpEQ4xYk2Go5ja6wXmBOHL8SZz91PcKrPgz3lScCdDNn59HW62ZLohum0iYx74&route=otp&variables_values=${encodeURIComponent(otp)}&flash=0&numbers=${encodeURIComponent(phone)}`;
      const response = await axios.get(url);
      const update_data = await User.findOneAndUpdate({phone},{$set:{otp:otp,fcm_id:fcm_id}},{new:true});
      const data=await update_data.save();
      res.status(200).json({
          "result": "true",
          "message": "otp sent sucessfully",
          data:data
      });
    }else{
      res.status(400).json({
        "result": "false",
        "message": "invalid phone_no, please enter the valid phone_no",
      });
    }  
  }
};


/*................update user profile................*/
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({"result": "false", "message": "Required parameters userId,image" });
    }

    const profile = await User.findOneAndUpdate( 
      { _id: userId },
      { $set: { image: req.file.filename } },
      { new: true }
    );
 
    if (!profile) {
      return res.status(404).json({ "result": "false", "message": "User not found" });
    }

    res.status(200).json({ "result": "true", "message": "User profile updated successfully" });
  } catch (err) {
    res.status(400).json({ "result": "false", "message": err.message });
  }
};

/*...................get user profile.................*/
const getProfile=async(req,res)=>{
  try{
    const {userId}=req.body;
      if(!userId){
        res.status(400).json({"result":"false","message":"required parameter is userId"});
      }
    const profile=await User.findOne({_id: userId});
    if(profile){
      res.status(200).json({
        "result":"true",
        "message":"user profile updated sucessfully",
        "path":"http://103.104.74.215:3026/uploads/",
        data:profile
      });
    }else{
      res.status(400).json({
        "result": "false",
        "message": "Invalid userId",
      });
    }  
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }
};

/*...................update user data.................*/
const updateUser=async(req,res)=>{
  try{
    const {userId,user_name,email}=req.body;
    if(!userId){
      res.status(400).json({"result":"false","message":"required parameter is userId and user_name,email are optionals"});
    }
    const profile= await User.findOneAndUpdate({_id: userId},{$set:{user_name,email}},{new:true});
    res.status(200).json({"result":"true","message":"user profile updated sucessfully"});
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }
};


/*..........user logout api.......................*/
const userLogout=async(req,res)=>{
  try{
    const {userId,fcm_id}=req.body;
    if(!userId){
      res.status(400).json({"result":"false","message":"required parameter are userId and fcm_id but fcm_id send null"});
    }else{
      const data=await User.findOneAndUpdate({userId: userId},{fcm_id},{new:true});
      res.status(200).json({"result":"true","message":"data updated successfully"});
    }
  }catch(error){
    res.status(200).json({"result":"false","message":error.message});
  }
};


/*.............add address...........................*/
const addAddress=async(req,res)=>{ 
  try{
    const { userId,place_type, address,contact_no,other_place_type,geo_location , lat ,lon} = req.body;
    if(!userId || !place_type || !lat || !lon){
      res.status(400).json({"result":"false","message":"required parameters are userId ,place_type, address, lat ,lon, (optionals parameters) contact_no,other_place_type"})
    }else{
    const update_data=await Address.findOne({userId :userId,place_type:place_type});
    if(update_data && place_type !='Others'){
      const data=await Address.findOneAndUpdate({userId :userId, place_type:place_type},{$set:{place_type, address, contact_no, geo_location:{
        type:"Point",
        coordinates:[parseFloat(req.body.lon),parseFloat(req.body.lat)]
      }}},{new:true});
      res.status(200).json({"result":"true","message":"data updated successfully"});
    }else{
      const newAddress = new Address({userId,place_type,other_place_type,address,contact_no,geo_location:{
        type:"Point",
        coordinates:[parseFloat(req.body.lon),parseFloat(req.body.lat)]
      }});
      await newAddress.save(); 
      res.status(200).json({ "result": "true", "message": 'Address added successfully', data: newAddress });
      }
    }
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }
};


/*.............address list..........................*/
const Address_list=async(req,res)=>{
  try{
    const {userId}=req.body;
    if(!userId){
      res.status(400).json({"result":"false","message":"required parameter is userId"})
    }
    const address=await Address.find({userId:userId});
    if(address.length>0){
      const data=address.map(item=>({
        userId:item.userId,
        place_type:item.place_type,
        address:item.address,
        other_place_type:item.other_place_type,
        other_address:item.other_address,
        contact_no:item.contact_no,
        addressId:item._id
      }));
      res.status(200).json({"result":"true",'message':"address list are",data:data});
    }else{
      res.status(400).json({"result":"false","message":"data does not found"});
    }
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }
};

/*.............get_last_address ..........................*/
const Get_Last_Address = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ "result": "false", "message": "required parameter is userId" })
    }

    const addresses = await Address.find({ userId: userId })
      .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order
      .limit(1); // Limit to one result, i.e., the latest address

    if (addresses.length > 0) {
      const data = addresses.map(item => ({
        userId: item.userId,
        place_type: item.place_type,
        address: item.address,
        other_place_type: item.other_place_type,
        other_address: item.other_address,
        contact_no: item.contact_no,
        addressId: item._id,
        updatedAt: item.updatedAt
      }));

      res.status(200).json({ "result": "true", 'message': "Latest address found", data: data });
    } else {
      res.status(400).json({ "result": "false", "message": "Data does not found" });
    }
  } catch (err) {
    res.status(400).json({ "result": "false", "message": err.message });
  }
};


/*.............address update........................*/
const updateAddress=async(req,res)=>{
  try{
    const { userId,place_type, address, pincode, city, geo_location , lat ,lon} = req.body;
    if(!userId){
      res.status(400).json({"result":"false","message":"required parameter is userId,place_type, address, pincode, city, geo_location , lat ,lon"});
    }else{
      const update_data=await Address.findOneAndUpdate({userId :userId},{$set:{place_type, address, pincode, city, geo_location , lat ,lon}},{new:true});
      res.status(200).json({"result":"true","message":"data updated successfully"});
    }
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }
};


/*.............address delete........................*/
const deleteAddress=async(req,res)=>{
  try{
    const {userId,addressId}=req.body;
    if(!userId || !addressId){
      res.status(400).json({"result":"true","message":"required parameter is userId,addressId"})
    }else{
      const data=await Address.findOneAndDelete({userId :userId, _id : addressId});
      res.status(200).json({"result":"true","message":"data delete successfully"});
    }
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }
};


/*..................Banner list api----------------------*/
const Banner_list=async(req,res)=>{
  try{
    const data=await Banner.find({'b_status':1});
    res.status(200).json({"result":"true","message":"banenr list are",
    "path":"http://103.104.74.215:3026/uploads/",data:data});
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};


/*-----------------category-list api-------------------------*/
const category_list=async(req,res)=>{
  try{
    const data=await Category.find({c_status:0});
    res.status(200).json({
      "result":"true",
      "message":"category list are",
      "path":"http://103.104.74.215:3026/uploads/",
      data:data
    });
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};


/*---------------------faq_list api------------------------*/
const faqlist=async(req,res)=>{
  try{
    const data=await Faq.find({});
    res.status(200).json({"result":"true","message":"faq list are",data:data});
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};


/*----------------------term& condiction list api----------------*/
const termlist=async(req,res)=>{
  try{
    const data =await Term.find({});
    res.status(200).json({"result":"true","message":"true",data:data});
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};


/*---------------------privacyPolicy list  api--------------------*/
const Privacy_list=async(req,res)=>{
  try{
    const data=await Privacy.find({});
    res.status(200).json({"result":"true","message":"Privacy list are",data:data});
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};

/*--------------------contactUs list api--------------------*/
const contactus_list=async(req,res)=>{
  try{
    const data=await ContactUs.find({});
    res.status(200).json({"result":"true","message":"contact list are ",data:data});
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};

/*...............user support api....................*/
const support_api=async(req,res)=>{
  try{
    const {userId,title,description}=req.body;
    if(!userId || !title || !description){
      res.status(400).json({"result":"false","message":"required parameters are userId,title,description"});
    }else{
      const data =new Support({userId,title,description});
      await data.save(); 
      res.status(200).json({"result":"true","message":"data insert successfully",data:data})
    }
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
}; 



/*............................shop list..................*/
const shop_list_one = async (req, res) => {
  try {
    const { latitude, longitude, categoryId, userId } = req.body;
    if (!latitude || !longitude || !categoryId || !userId) {
      return res.status(400).json({ "result": "false", "message": "Required parameters: latitude, longitude, categoryId, userId" });
    }

    const pipeline = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          spherical: true,
          maxDistance: 500000, //5km Max distance in meters (adjust as needed)
        },
      },
      {
        $match: {
          categoryId: categoryId, // Match documents by categoryId
          approve_status:1,
        },
      },
      {
        $project: {
          shop_name: 1,
          shop_address: 1,
          shop_image: 1,
          categoryId:1,
          act_status:1,         
          max_distance:1,
          timing: { $multiply: [{ $round: [{ $divide: ['$distance', 1000] }, 1] }, 5] }, // Calculate timing based on distances
          distances: { $round: [{ $divide: ['$distance', 1000] }, 1] }, // Convert distance to kilometers
         // distances: { $round: [{ $ifNull: ['$distance', 0] }, 1] },
          rating: 1,
        },
      },
      {
        $sort: {
          rating: -1,
        },
      },
       {
    $match:{
       $expr: {$gte: [ '$max_distance', '$distances']}
    },
     },
    ];


    const result = await Vender.aggregate(pipeline);
    console.log(result)

    const distance_data = result[0].distances;
    console.log(distance_data)
    
    const qrcodeShop = await Qrcodes.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "venders",
          localField: "shopId",
          foreignField: "_id",
          as: "qrcodeShop",
        },
      },
    ]);

    //console.log(qrcodeShop)

    // Combine liked shops with all shops
    const mergedData = result.map(shop => {
      const qrcodeShopItem = qrcodeShop.find(item => item.qrcodeShop.length > 0 && item.qrcodeShop[0]._id.equals(shop._id));
      return {
        ...shop,
        likedShop: qrcodeShopItem ? {
          status: qrcodeShopItem.status,
        } : null,
      };
    });

 // Add the 'acc_status' field based on your logic
    for (let i = 0; i < mergedData.length; i++) {
      if (mergedData[i].likedShop == null || mergedData[i].likedShop.status === 0) {
        mergedData[i].acc_status = 0;
      } else {
        mergedData[i].acc_status = 1;
      }
    }
    const data=mergedData.map(item=>({
      shopId:item._id,
      categoryId:item.categoryId,
      shop_name:item.shop_name,
      shop_image:item.shop_image,
      shop_address:item.shop_address, 
      timing:item.timing,
      distances:item.distances,
      acc_status:item.acc_status,
      open_time:item.open_time,
      close_time:item.close_time,
      act_status:item.act_status,   
      max_distance:item.max_distance
    }));
   
    res.status(200).json({ "result": "true", data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ "result": "false", "message": error.message });
  }
};



/*............................shop list..................*/
const shop_list = async (req, res) => {
  try {
    const { latitude, longitude, categoryId, userId } = req.body;
    if (!latitude || !longitude || !categoryId || !userId) {
      return res.status(400).json({ "result": "false", "message": "Required parameters: latitude, longitude, categoryId, userId" });
    }
    const pipeline = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          spherical: true,
          //maxDistance: 20000, //5km Max distance in meters (adjust as needed)
        },
      },
      {
        $match: {
          categoryId: categoryId, // Match documents by categoryId
        },
      },
      {
        $project: {
          shop_name: 1,
          shop_address: 1,
          shop_image: 1,
          geo_location: 1,
          max_distance: 1,
          open_time: 1,
          close_time: 1,
          o_time:1,
          c_time:1,
          categoryId: 1,
          timing: { $multiply: [{ $round: [{ $divide: ['$distance', 1000] }, 1] }, 5] }, // Calculate timing based on distances
          distances: { $round: [{ $divide: ['$distance', 1000] }, 1] }, // Convert distance to kilometers
          rating: 1,
        },
      },
      {
        $sort: {
          rating: -1,
        },
      },
    ];


    const result = await Vender.aggregate(pipeline);
    const user_maxDistance = Math.round(result[0].distances);
    console.log(user_maxDistance)
    //console.log(result)

    function calculateDistance(lat1, lon1, lat2, lon2) {
      const earthRadius = 6371; // Radius of the Earth in kilometers

      // Convert latitude and longitude from degrees to radians
      const radLat1 = (Math.PI * lat1) / 180;
      const radLon1 = (Math.PI * lon1) / 180;
      const radLat2 = (Math.PI * lat2) / 180;
      const radLon2 = (Math.PI * lon2) / 180;

      // Calculate the differences between the coordinates
      const deltaLat = radLat2 - radLat1;
      const deltaLon = radLon2 - radLon1;

      // Haversine formula
      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) *  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // Distance in kilometers
      const distance = earthRadius * c;

      return distance;
    }

    const distanceArray = [];
    for (const shop of result) {
      const latitude_shop = shop.geo_location.coordinates[1];
      const longitude_shop = shop.geo_location.coordinates[0];
      const maxDistance = shop.max_distance;

      const distance = calculateDistance(latitude_shop, longitude_shop, latitude, longitude);
      console.log(distance);
      console.log(maxDistance)
      if (maxDistance >= distance) {
        distanceArray.push({
          shopId: shop._id,
          distance: distance,
          maxDistance: maxDistance
        });
      }
    }

    if (!distanceArray.length == 0) {

      const newData = [];
      distanceArray.forEach(obj1 => {
        const targetValue = obj1.shopId;
        const matchingObjectsForCurrentObj1 = result.filter(obj2 => obj2._id === targetValue);
        newData.push(...matchingObjectsForCurrentObj1);
      });
      const qrcodeShop = await Qrcodes.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: "venders",
            localField: "shopId",
            foreignField: "_id",
            as: "qrcodeShop",
          },
        },
      ]);

      // Combine liked shops with all shops
      const mergedData = newData.map(shop => {
        const qrcodeShopItem = qrcodeShop.find(item => item.qrcodeShop.length > 0 && item.qrcodeShop[0]._id.equals(shop._id));
        return {
          ...shop,
          likedShop: qrcodeShopItem ? {
            status: qrcodeShopItem.status,
          } : null,
        };
      });

      // Add the 'acc_status' field based on your logic
      for (let i = 0; i < mergedData.length; i++) {
        if (mergedData[i].likedShop == null || mergedData[i].likedShop.status === 0) {
          mergedData[i].acc_status = 0;
        } else {
          mergedData[i].acc_status = 1;
        }
      }
      // if(distanceArray[0].maxDistance > user_maxDistance){
      const data = mergedData.map(item => ({
        shopId: item._id,
        categoryId: item.categoryId,
        shop_name: item.shop_name,
        shop_image: item.shop_image,
        shop_address: item.shop_address,
        timing: item.timing,
        distances: item.distances,
        acc_status: item.acc_status,
        open_time: item.open_time,
        close_time: item.close_time,
        o_time: item.o_time,
        c_time: item.c_time,
        max_distance: item.max_distance
      }));

      return res.status(200).json({ "result": "true", data: data });

    } else {
      return res.status(400).json({ "result": "false", "message": "record not found" });
    }

    console.log(data)


  } catch (error) {
    console.error(error);
    res.status(500).json({ "result": "false", "message": error.message });
  }
};



/*....................create store search api.............*/
const store_search=async(req,res)=>{
  const {store_search,latitude,longitude,userId}=req.body;
  try{
    if(!store_search || !latitude || !longitude || !userId){
      res.status(400).json({"result":"false","message":"required parameter is store_search,latitude,longitude & userId"})
    }else{
      const pipeline = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          spherical: true,
          maxDistance: 100000, // Max distance in meters (adjust as needed)
        },
      },
      {
        $match: {
           "shop_name":{$regex:".*"+store_search+".*",$options:"i"} // Match documents by store_search
        },
      },
      {
        $project: {
          shop_name: 1,
          shop_address:1,
          shop_image:1,
          timing:1,
          rating:1,
          distances: { $round: [{ $divide: ['$distance', 1000] }, 1] }, // Convert distance to kilometers
          timing:{ $multiply: [{ $round: [{ $divide: ['$distance', 1000] }, 1] }, 5] }, // Calculate timing based on distances
        },
      },
      {
      $sort: {
        rating: -1  // Sort by rating in descending order
      }
      },
    ];
    const result=await Vender.aggregate(pipeline);
    const qrcodeShop = await Qrcodes.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "venders",
          localField: "shopId",
          foreignField: "_id",
          as: "qrcodeShop",
        },
      },
    ]);

    console.log(qrcodeShop)

    // Combine liked shops with all shops
    const mergedData = result.map(shop => {
      const qrcodeShopItem = qrcodeShop.find(item => item.qrcodeShop.length > 0 && item.qrcodeShop[0]._id.equals(shop._id));
      return {
        ...shop,
        likedShop: qrcodeShopItem ? {
          status: qrcodeShopItem.status,
        } : null,
      };
    });

 // Add the 'acc_status' field based on your logic
    for (let i = 0; i < mergedData.length; i++) {
      if (mergedData[i].likedShop == null || mergedData[i].likedShop.status === 0) {
        mergedData[i].acc_status = 0;
      } else {
        mergedData[i].acc_status = 1;
      }
    }
    const data=mergedData.map(item=>({
      shopId:item._id,
      categoryId:item.categoryId,
      shop_name:item.shop_name,
      shop_image:item.shop_image,
      shop_address:item.shop_address,
      timing:item.timing,
      distances:item.distances,
      acc_status:item.acc_status
    }));

    if(data.length>0){
      res.status(200).json({"result":"true","message":"search data are ",data:data});
    }else{
      res.status(400).json({"result":"false","message":"search data does not found "});
    }
   }
  }catch(error){
    console.log(error.message)
    res.status(400).json({"result":"false","message":error.message})
  }
};

/*.................search shop list.............*/
const spacific_shop_search = async (req, res) => {
  const { search, latitude, longitude } = req.body;
  try {
    if (!search || !latitude || !longitude) {
      return res.status(400).json({ "result": "false", "message": "Required parameters are search, latitude, longitude" });
    }
    const dinu=await Category.find({"category_name":{ $regex: `.*${search}.*`, $options: "i" }});
      if(dinu.length>0){
        const category_id=dinu[0]._id;
        const pipeline =[
          {
          $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: 'distance',
          spherical: true,
          maxDistance: 100000, // Max distance in meters (adjust as needed)
          },
          },
          {
          $match: {
            "categoryId": { $regex: `.*${category_id}.*`, $options: "i" }
          },
          },
          {
          $project: {
            shop_name: 1,
            shop_address: 1,
            shop_image: 1,
            timing: 1,
            rating: 1,
            distances: { $round: [{ $divide: ['$distance', 1000] }, 1] },
            timing: { $multiply: [{ $round: [{ $divide: ['$distance', 1000] }, 1] }, 5] }
          },
          },
          {
          $sort: {
            rating: -1
          }
          }
        ];
        const data = await Vender.aggregate(pipeline);
        if (data.length > 0) {
          res.status(200).json({ "result": "true", "message": "Search data found", data: data });
        }else{
          res.status(404).json({ "result": "false", "message": "Search data not found" });
        }
      }else{
        res.status(404).json({ "result": "false", "message": "Search data not found" });
      }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ "result": "false", "message": "Internal server error" });
  }
};



/*....................shop banner list...............*/
const shopBanner_list=async(req,res)=>{
  // try{
  //   const {shopId}=req.body;
  //   if(!shopId){
  //     res.status(400).json({'result':"false","message":"required parameter is  shopId"});
  //   }else{
  //         const shopData = ShopBanner.findOne({'shopId':shopId})
  //         if(shopData)
  //      // Filter out null values from arrays
  //               const filteredShopbanner = shopData.shopbanner.filter(item => item !== null);
  //               const filteredShoppdf = shopData.shoppdf.filter(item => item !== null);
  //               const filteredBannerStatus = shopData.banner_status.filter(item => item !== null);

  //               res.status(200).json({
  //                   result: 'true',
  //                   msg: 'shop banner data get successfully..',
  //                   data: {
  //                       ...shopData.toObject(),
  //                       shopbanner: filteredShopbanner,
  //                       shoppdf: filteredShoppdf,
  //                       banner_status: filteredBannerStatus
  //                   }
  //               });
  //           } else {
  //               res.status(400).json({
  //                   result: 'false',
  //                   msg: 'record not found..',
  //                   data: []
  //               });
  //           }

  // }catch(error){
  //   res.status(400).json({'result':"false","message":error.message});
  // }
};


/*.................shop catergory List..................*/
const shopcategory_list=async(req,res)=>{
  try{
    const {shopId}=req.body;
    if(!shopId){
      res.status(400).json({'result':"false","message":"required parameter is  shopId"});
    }else{
      const data = await Shopcategory.find({shop_id : shopId});
      const dinu= data.map(item=>({
        shopcategory_name:item.shopcategory_name,
        category_image:item.category_image,
        shop_id:item.shop_id,
        shopcategoryId:item._id
      }));
      res.status(200).json({
        "result":"false",
        "message":"shop category list are",
        "path":"http://103.104.74.215:3026/uploads/",
        data:dinu
      });
    }
  }catch(error){
    res.status(400).json({'result':"false","message":error.message});
  }
};



/*......................shop product list.................*/
const ShopProduct_list = async (req, res) => {
  try {
    const { shopId, userId } = req.body;
    if (!shopId || !userId) {
      return res.status(400).json({ 'result': "false", "message": "required parameters are shopId and userId" });
    }

    // Fetch unique product names for the shop
    const uniqueProductNames = await ShopProduct.distinct('products_name', { shopId: shopId });

    // Fetch all products for the shop
    const productData = await ShopProduct.find({ shopId:shopId,stock_status: 0 });

    // Filter to get only unique products
    const uniqueProducts = productData.filter((item, index, self) =>
      self.findIndex((t) => t.products_name === item.products_name) === index
    );

    // Fetch user's cart
    const userCart = await Cart.find({
      userId: new mongoose.Types.ObjectId(userId),
      booking_status: 0
    });

    // Create a map of product IDs in the user's cart
    const userCartProductIds = new Set();
    userCart.forEach(cartItem => {
      cartItem.products.forEach(product => {
        userCartProductIds.add(product.productId.toString());
      });
    });

    // Set cart_status (booking_status) for each product based on the user's cart
      const mergedData = uniqueProducts.map(product => {
      const cartStatus = userCartProductIds.has(product._id.toString()) ? 1 : 0;
      const cartItem = userCart.find(cartItem => cartItem.products.some(productInCart => productInCart.productId.toString() === product._id.toString()));
      const qty = cartItem ? cartItem.products.find(productInCart => productInCart.productId.toString() === product._id.toString()).qty : 0;

      return {
        ...product.toObject(),
        cart_status: cartStatus,
        qty:qty, 
      };
    });                                                         

    // Fetch variant data for each product
    const variantPromises = mergedData.map(async (item) => {
      const variants = await ShopProduct.find({ shopId: shopId, products_name: item.products_name,stock_status: 0 });
      return variants.map((variant) => ({ variants: variant.variants,mrp_price:variant.mrp_price,sale_price:variant.sale_price,discount:variant.discount }));
    });

    const variantData = await Promise.all(variantPromises);

    // Prepare the response data
    const dinu = mergedData.map((item, index) => {
      return {
        shop_productId: item._id,
        shop_name: item.shop_name,
        product_name: item.products_name,
        brand_name: item.brand_name,
        description: item.description,
        cart_status: item.cart_status, 
        images: item.images,
        qty:item.qty,
        mrp_price: item.mrp_price,
        sale_price: item.sale_price,
        discount: item.discount,
        select_variants:item.variants,
        select_mrp_price:item.mrp_price,
        select_sale_price:item.sale_price,
        variants: variantData[index],
      };
    });

    res.status(200).json({
      "result": "true",
      "message": "Unique shop product list",
      "path": "http://103.104.74.215:3026/uploads/",
      data: dinu
    });
  } catch (error) {
    res.status(500).json({ 'result': "false", "message": error.message });
  }
};

const ShopProduct_list_data = async (req, res) => {
  try {
    const { shopId, userId } = req.body;
    if (!shopId || !userId) {
      return res.status(400).json({ 'result': "false", "message": "required parameters are shopId and userId" });
    }

    // Fetch all products for the shop with specified shopId and products_name
    const productData = await ShopProduct.find({ shopId: shopId });

    // Filter to get only unique products based on products_name
    const uniqueProducts = productData.filter((item, index, self) =>
      self.findIndex((t) => t.products_name === item.products_name) === index
    );

    // Fetch user's cart for the specified shopId
    const userCart = await Cart.find({
      userId: new mongoose.Types.ObjectId(userId),
      booking_status: 0
    });

    // Create a map of variant IDs in the user's cart
    const userCartProductIds = new Set();
    if (userCart) {
      userCart.forEach(cartItem => {
      cartItem.products.forEach(product => {
        userCartProductIds.add(product.productId.toString());
      });
    });
    }

    // Set cart_status (booking_status) for each product based on the user's cart
      const mergedData = uniqueProducts.map(product => {
      const cartStatus = userCartProductIds.has(product._id.toString()) ? 1 : 0;
      const cartItem = userCart.find(cartItem => cartItem.products.some(productInCart => productInCart.productId.toString() === product._id.toString()));
      const qty = cartItem ? cartItem.products.find(productInCart => productInCart.productId.toString() === product._id.toString()).qty : 0;

      return {
        ...product.toObject(),
        cart_status: cartStatus,
        qty:qty, 
      };
    });  

    // Fetch variant data for each product based on shopId and products_name
    const variantPromises = mergedData.map(async (item) => {
      const variants = await ShopProduct.find({ shopId: shopId, products_name: item.products_name });
      return variants.map((variant) => ({
        variantId: variant._id,
        variants: variant.variants,
        mrp_price: variant.mrp_price,
        sale_price: variant.sale_price,
        discount: variant.discount,
      }));
    });

    const variantData = await Promise.all(variantPromises);

    // Prepare the response data
    const resultData = mergedData.map((item, index) => {
      const selectedVariants = variantData[index].filter(variant => userCartProductIds.has(variant.variantId.toString()));
      return {
        shop_productId: item._id,
        shop_name: item.shop_name,
        product_name: item.products_name,
        brand_name: item.brand_name,
        description: item.description,
        cart_status: item.cart_status,
        images: item.images,
        qty: item.qty,
        mrp_price: item.mrp_price,
        sale_price: item.sale_price,
        discount: item.discount,
        variants: variantData[index],
        select_variants: selectedVariants.map(variant => variant.variants),
        select_mrp_price: selectedVariants.map(variant => variant.mrp_price),
        select_sale_price: selectedVariants.map(variant => variant.sale_price),
      };
    });


    res.status(200).json({
      "result": "true",
      "message": "Unique shop product list",
      "path": "http://103.104.74.215:3026/uploads/",
      data: resultData
    });
  } catch (error) {
    res.status(500).json({ 'result': "false", "message": error.message });
  }
};


/*.............create qr code match apu................*/
const matchQrcode = async (req, res) => {
  try {
    const { shopId, qrcode, userId } = req.body;
    
    if(!shopId || !qrcode || !userId) {
      res.status(400).json({ "result": "false", "message": "Required parameters are shopId, qrcode, and userId" });
    }else{
      // Check if the QR code has already been scanned
      const existingQrcode = await Qrcodes.findOne({shopId, userId, status: 1 });

      if (existingQrcode) {
        res.status(400).json({ "result": "false", "message": "You have already scanned this QR code",data:existingQrcode });
      } else {
        // Find the matching shop QR code
        const matchedShop = await Vender.findOne({ "_id": shopId, "qr_code": qrcode });
 
        if (matchedShop) {
          const shopId = matchedShop._id;
          const qrcode = matchedShop.qr_code;

          res.status(200).json({ "result": "true", "message": "Shop QR code matched", data: { shopId, qrcode } });

          // Insert a new QR code entry with status 1
          const newQrcode = new Qrcodes({ userId, shopId, status: 1 });
          await newQrcode.save();
        } else {
          res.status(200).json({ "result": "false", "message": "Shop QR code does not match" });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ "result": "false", "message": error.message });
  }
};


/*..................shop information list..............*/
const shopInformation = async (req, res) => {
  try {
    const { shopId } = req.body;
    if (!shopId) {
      return res.status(400).json({ "result": "false", "message": "Required parameter is shopId" });
    }
    const counts=await ShopProduct.countDocuments({shopId :shopId});
    const data = await Vender.findOne({ _id: shopId });
    if (!data) {
      return res.status(404).json({ "result": "false", "message": "Shop not found" });
    }
    const shopInfo = {
      shop_name: data.shop_name,
      mobile: data.mobile,
      address: data.shop_address,
      min_order: data.min_order,
      distance: data.distance,
      delivery_charge: data.delivery_charge,
      total_products:counts,
      fssai_no:data.fssai_no,
      open_time:data.open_time,
      close_time:data.close_time
    };

    res.status(200).json({ "result": "true", "message": "Shop information list", data: shopInfo });
  } catch (err) {
    res.status(500).json({ "result": "false", "message": err.message });
  }
};

/*....................shop details...........*/
const shopDetails = async (req, res) => {
  try {
    const { shopId, userId, productId, product_name } = req.body;

    if (!shopId || !userId || !productId || !product_name ) {
      return res.status(400).json({ result: 'false', message: 'Required parameters are shopId, userId, product_name, productId' });
    }

    // Find the product by shopId and productId
    const productData = await ShopProduct.findOne({ shopId: shopId, _id: productId,stock_status: 0 });

    if (!productData) {
      return res.status(404).json({ result: 'false', message: 'Product not found' });
    }

    // Fetch user's cart
    const userCart = await Cart.find({
      userId: new mongoose.Types.ObjectId(userId),
      booking_status: 0
    });

    // Create a map of product IDs in the user's cart
    const userCartProductIds = new Set();
    userCart.forEach(cartItem => {
      cartItem.products.forEach(product => {
        userCartProductIds.add(product.productId.toString());
      });
    });

    // Determine the cart_status (booking_status) for the current product
    const cartStatus = userCartProductIds.has(productId.toString()) ? 1 : 0;

    // Map the variants data
    const variantsData = await ShopProduct.find({ shopId: shopId, products_name: product_name,stock_status: 0 });

    // Extract the "variants" field from each variant object
    const variants = variantsData.map(variant => ({ variants: variant.variants }));

    // Find the quantity for the current product in the user's cart
    const cartItem = userCart.find(item => item.products.some(product => product.productId.toString() === productId.toString()));
    const quantity = cartItem ? cartItem.products.find(product => product.productId.toString() === productId.toString()).qty : 0;

    const productInfo = {
      shop_productId: productData._id,
      shop_name: productData.shop_name,
      product_name: productData.products_name,
      brand_name: productData.brand_name,
      description: productData.description,
      images: productData.images,
      mrp_price: productData.mrp_price,
      sale_price: productData.sale_price,
      discount: productData.discount,
      cart_status: cartStatus,
      qty: quantity,
      variants: variants
    };

    return res.status(200).json({
      result: 'true',
      message: 'Product details retrieved successfully',
      path: 'http://103.104.74.215:3026/uploads/',
      data: productInfo
    });
  } catch (error) {
    return res.status(500).json({ result: 'false', message: error.message });
  }
};


/*................shop variant................*/
const shopVariant = async (req, res) => {
  try {
    const { shopId,userId, productId,variant_name,product_name } = req.body;
    if (!shopId || !userId || !productId || !variant_name ||  !product_name) {
      return res.status(400).json({ result: 'false', message: 'Required parameters are shopId, userId,productId,product_name, and variant_name' });
    }
    const productData = await ShopProduct.findOne({ shopId: shopId, variants: variant_name,products_name: product_name,stock_status: 0  });
    const likedProducts = await Like.findOne({ userId, shopProductId: shopId});
    const variant = await ShopProduct.find({ shopId: shopId, products_name: product_name});
    const vdata=variant.map(item=>({
        variants:item.variants
    }));
     //const productData1 = await ShopProduct.findOne({ shopId: shopId, _id: productId });
    // Fetch user's cart
    const userCart = await Cart.find({
      userId: new mongoose.Types.ObjectId(userId),
      booking_status: 0
    });

    // Create a map of product IDs in the user's cart
    const userCartProductIds = new Set();
    userCart.forEach(cartItem => {
      cartItem.products.forEach(product => {
        userCartProductIds.add(product.productId.toString());
      });
    });
    console.log(userCartProductIds)
    // Determine the cart_status (booking_status) for the current product
    //const cartStatus = userCartProductIds.has(productId.toString()) ? 1 : 0;



    // Map the variants data
    const variantsData = await ShopProduct.find({ shopId: shopId, products_name: product_name });

    // Extract the "variants" field from each variant object
    const variants = variantsData.map(variant => ({ variants: variant.variants }));
   
   
    // Find the quantity for the current product in the user's cart
    const cartItem = await Cart.findOne({
      'products.shopId': shopId.toString(),
      'products.products_name': product_name,
      'products.variant': variant_name
    }).exec();
     
    
    // Determine the cart_status (booking_status) for the current product and variant
    // const cartStatus = userCartProductIds.has(productId.toString()) && cartItem && cartItem.products.some(product =>
    //  product.variant === variant_name ) ? 1 : 0;
    // console.log(cartStatus)

    const cartStatus = cartItem ? cartItem.products.find(product => product.shopId.toString() === shopId.toString() &&
    product.products_name === product_name && product.variant === variant_name).cart_status : 0;
    console.log(cartStatus)
    const quantity = cartItem ? cartItem.products.find(product => product.shopId.toString() === shopId.toString() &&
    product.products_name === product_name && product.variant === variant_name).qty : 0;
    console.log(quantity)
    
   
    if(!productData) {
      return res.status(404).json({ result: 'false', message: 'Product not found' });
    }else{
      if(likedProducts){
        const productInfo = {
          shop_productId: productData._id,
          shop_name: productData.shop_name,
          product_name: productData.products_name,
          brand_name: productData.brand_name,
          description: productData.description,
          like_status: likedProducts.like_status, 
          images: productData.images,
          mrp_price: productData.mrp_price,
          sale_price: productData.sale_price,
          discount: productData.discount,
          cart_status: cartStatus,
           qty: quantity,
          variants: vdata, 
        };
        return res.status(200).json({
          result: 'true',
          message: 'Product details retrieved successfully',
          path: 'http://103.104.74.215:3026/uploads/',
          data: productInfo,
        });
      }else{
        const productInfos = {
          shop_productId: productData._id,
          shop_name: productData.shop_name,
          product_name: productData.products_name,
          brand_name: productData.brand_name,
          description: productData.description,
          like_status: productData.like_status, 
          images: productData.images,
          mrp_price: productData.mrp_price,
          sale_price: productData.sale_price,
          discount: productData.discount,
          cart_status: cartStatus,
          qty: quantity,
          variants: vdata,
        };
        return res.status(200).json({
          result: 'true',
          message: 'Product details retrieved successfully...',
          path: 'http://103.104.74.215:3026/uploads/',
          data: productInfos,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ result: 'false', message: error.message });
  }
};


/*..................variants list..............*/
const variants_list=async(req,res)=>{
  try{
    const {products_name,shopId}=req.body; 
    if(!products_name || ! shopId){
      res.status(400).json({"result":"false","message":"required parameter are shopId and products_name"});
    }else{
      const data=await ShopProduct.find({products_name,shopId});
      const variants=data.map(item=>({
        variants:item.variants
      }));
      res.status(200).json({"result":"true","message":"required list are",data:variants});
    }
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }
};

/*...............like api............*/
const likedProducts=async(req,res)=>{
  try{
    const {userId,shopProductId,like_status}=req.body;
    if(!userId || !shopProductId || !like_status){
      res.status(400).json({"result":"false","message":"required parameters are userId,shopProductId,like_status"});
    }else{
      // apply validation
      const validation=await Like.findOne({userId:userId, shopProductId:shopProductId});
      if(validation){
        const like=await Like.findOne({shopProductId : shopProductId, userId:userId,like_status:0});
        if(like){
          const likedata=await Like.findOneAndUpdate({shopProductId: shopProductId,userId :userId},{like_status:1},{new:true});
          res.status(200).json({"result":"true","message":"product liked successfully"});
        } else {
          const likedata=await Like.findOneAndUpdate({shopProductId : shopProductId,userId :userId},{like_status:0},{new:true});
          res.status(200).json({"result":"true","message":"product disliked successfully"});
        }
      }else{
        const insertData=new Like({userId,shopProductId:shopProductId,like_status:1});
        const data=await insertData.save();
        res.status(200).json({"result":"true","message":"product liked successfully"})
      }
    }
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }
};


/*...............subcategory list...........*/
const subcategory_list = async (req, res) => {
  try {
    const { shopId } = req.body;
    if (!shopId) {
      return res.status(400).json({ "result": "false", "message": "Required parameter is shopId" });
    }

    const vendor = await Vender.findOne({ _id: shopId });
   if (!vendor) {
     return res.status(404).json({ "result": "false", "message": "Shop not found" });
    }

    const categories = await Category.find({ _id: vendor.categoryId });
   // const categoryId = categories.categoryId;
    // const                  categoryId.category_name

     // const subcategories = await ShopProduct.find({ shopId: shopId });
     // console.log(subcategories)


    
    // Use Promise.all to fetch subcategories for each category
    const subcategoriesPromises = categories.map(async (item) => {
      const subcategories = await Shopcategory.find({ categoryId: item._id});
      return subcategories.map((subcategory) => ({
        subcategory: subcategory.subcategory,
        image: subcategory.category_image,
        subcategoryId: subcategory._id
      }));
    });

    // Wait for all subcategories to be fetched and flatten the structure
    const data = (await Promise.all(subcategoriesPromises)).reduce((acc, subcategoryData) => {
      return acc.concat(subcategoryData);
    }, []);

    res.status(200).json({ "result": "true", "message": "Category list with products", data });
  
  } catch (err) {
    res.status(500).json({ "result": "false", "message": err.message });
  }
};


/*...............subcategory list by shopId...........*/
const get_subcategory_list = async (req, res) => {
  try {
    const { shopId } = req.body;
    if (!shopId) {
      return res.status(400).json({ "result": "false", "message": "Required parameter is shopId" });
    }

    // Find products associated with the shopId
    const shopProducts = await ShopProduct.find({ shopId: shopId });

    // Create a Set to store unique subcategory values
    const uniqueSubcategories = new Set();

    // Iterate through the shopProducts and add unique subcategories to the Set
    shopProducts.forEach((item) => {
      uniqueSubcategories.add(item.subcategory);
    });

    // Use Promise.all to fetch subcategories for each unique subcategory
    const subcategoriesPromises = Array.from(uniqueSubcategories).map(async (subcategory) => {
      const subcategoryData = await Shopcategory.findOne({ subcategory });
      if (subcategoryData) {
        return {
          subcategory: subcategoryData.subcategory,
          image: subcategoryData.category_image,
          subcategoryId: subcategoryData._id
        };
      }
      return null; // Return null if subcategory not found
    });

    // Wait for all subcategories to be fetched and remove null values
    const data = (await Promise.all(subcategoriesPromises)).filter((subcategoryData) => subcategoryData !== null);

    res.status(200).json({ "result": "true", "message": "Category list with products", data });

  } catch (err) {
    res.status(500).json({ "result": "false", "message": err.message });
  }
};





/*................add to card................*/
const addcart = async (req, res) => {
  const { userId, shopId, productId, products_name, variant, qty, price } = req.body;
  try {
    if (userId && shopId && productId && products_name && variant  && price) {
      let cart = await Cart.findOne({ userId: userId, booking_status: 0 });
      if(!cart){
        const cart_data = new Cart({
          userId: userId,
          products: [{ shopId, productId, products_name, variant, qty, price,cart_status:1 }],
        });
        const result = await cart_data.save();
        res.status(200).json({
          result: 'true', 
          msg: 'Cart added successfully.',
          data: result,
        });
      }else{
        const shop_id = cart.products.shopId;
        console.log(shop_id)
       
        // Check if the product already exists in the cart
        const validation = cart.products.find(
          (product) =>
            product.productId == productId && product.variant == variant
        );

        if (validation) {
          res.status(400).json({
            result: 'false',
            message: 'Product already exists in the cart.',
          });
        } else {
          // Add the product to the cart
          cart.products.push({
            shopId: shopId,
            productId: productId,
            products_name:products_name,
            variant: variant,
            qty: qty,
            price: price,
            cart_status:1
          });

          const result = await cart.save();
          res.status(200).json({
            result: 'true',
            message: 'Cart added successfully.',
            data: result,
          });
        }
      }
    } else {
      res.status(400).json({
        result: 'false',
        message: 'Required parameters: userId, shopId, productId, products_name, variant, priceand qty is optionals',
      });
    }
  } catch (error) {
    res.status(400).json({ result: 'false', message: error.message });
  }
};



/*................replace to card................*/
const replacecart = async (req, res) => {
  const { userId, shopId, productId, products_name, variant, qty, price } = req.body;
  try {
    if (userId && shopId && productId && products_name && variant && price) {
      let cart = await Cart.findOne({ userId: userId, booking_status: 0 });
      if (
        cart.products.length > 0 &&
        cart.products.every(product => product.shopId != shopId)
      ) {
      // Replace all index data in products Array
      cart.products = [{
        shopId: shopId,
        productId: productId,
        products_name: products_name,
        variant: variant,
        qty: qty,
        price: price,
        cart_status: 1,
      }];

      const result = await cart.save();
        res.status(200).json({
          result: 'true',
          message: 'Cart updated successfully.',
          data: result,
        });
    } else {
    // Check if the product already exists in the cart
     const validation = cart.products.find(
        (product) => product.productId == productId && product.variant == variant
    );

    if (validation) {
      res.status(400).json({
        result: 'false',
        message: 'Product already exists in the cart.',
      });
    } else {
    // Add the product to the cart
      cart.products.push({
        shopId: shopId,
        productId: productId,
        products_name: products_name,
        variant: variant,
        qty: qty,
        price: price,
        cart_status: 1,
      });
    const result = await cart.save();
    res.status(200).json({
      result: 'true',
      message: 'Cart added successfully.',
      data: result,
    });
  }
}

    } else {
      res.status(400).json({
        result: 'false',
        message: 'Required parameters: userId, shopId, productId, products_name, variant, price, and qty is optional',
      });
    }
  } catch (error) {
    res.status(400).json({ result: 'false', message: error.message });
  }
};




/*...............cartlist api...................*/
const cart_list_one = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ "result": "false", "message": "required parameter is userId" });
    }

    const cart_data = await Cart.find({ userId: userId, booking_status: 0 }).populate('products.productId');
    
    if (!cart_data || cart_data.length === 0 || !cart_data[0].products || cart_data[0].products.length === 0) {
      return res.status(400).json({
       "result": "false", 
       "message": "cart_data not found or is empty",
       "data": []
        });
    }else{

      const data = cart_data.map(item => ({
          userId:item.userId,
          cartId:item._id,
          products: item.products.map(product => ({
            shopId:product.shopId,
            product_id: product.productId._id,
            products_name: product.productId.products_name,
            product_image: product.productId.images[0],
            variants:product.productId.variants,
            mrp_price:product.productId.mrp_price,
            sale_price:product.productId.sale_price,
            discount:product.productId.discount,
            qty:product.qty,
            price:product.price,
          }))
      }));
      res.status(200).json({
        "result": "true",
        "message": "cart_list data get successfully",
         data: data,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ "result": "false", "message": error.message });
  }
};

const cart_list = async (req, res) => {
  try {
    const { userId,latitude,longitude} = req.body;

    // Check if required parameters are provided
    if (!userId && !latitude && !longitude) {
      return res.status(400).json({ "result": "false", "message": "required parameters are userId,latitude,longitude" });
    }

    // Get cart details
    const cartData = await Cart.findOne({userId: userId,booking_status: 0 }).populate('products.productId');

    // Check if cart data is not found or empty
    if (!cartData || !cartData.products || cartData.products.length === 0) {
      return res.status(400).json({
        "result": "false",
        "message": "cart_data not found or is empty",
        "data": []
      });
    }

    // Extract user and shop details from cart data
    const user_id = cartData.userId;
    const shop_id = cartData.products[0].shopId;

    // Get user's home address
    //const addressData = await Address.findOne({ userId: user_id, place_type: 'Home' });

    // Get shop/vendor details
    const vendorData = await Vender.findById(shop_id);

    // Calculate distance between user's home and shop
    //const latitude = addressData.geo_location.coordinates[1];
    //const longitude = addressData.geo_location.coordinates[0];
    const latitudeShop = vendorData.geo_location.coordinates[1];
    const longitudeShop = vendorData.geo_location.coordinates[0];

    function calculateDistance(lat1, lon1, lat2, lon2) {
      const earthRadius = 6371; // Radius of the Earth in kilometers
 
      // Convert latitude and longitude from degrees to radians
      const radLat1 = (Math.PI * lat1) / 180;
      const radLon1 = (Math.PI * lon1) / 180;
      const radLat2 = (Math.PI * lat2) / 180;
      const radLon2 = (Math.PI * lon2) / 180;

      // Calculate the differences between the coordinates
      const deltaLat = radLat2 - radLat1;
      const deltaLon = radLon2 - radLon1;

      // Haversine formula
      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) *  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // Distance in kilometers
      const distance = earthRadius * c;

      return distance
    }

    var distance = calculateDistance(latitudeShop, longitudeShop, latitude, longitude);
    distance =  distance.toFixed(2)
    console.log(distance,typeof 'distance')

    // Calculate total price of products in the cart
    const productsArray = cartData.products || [];
    let total_price = 0;

    for (let i = 0; i < productsArray.length; i++) {
      const price = productsArray[i].price;
      total_price += price;
    }

    // Calculate delivery charges and other costs
    const delivery_charge = vendorData.delivery_charge * distance;
    const flat_delivery_charge = vendorData.flat_delivery_charge;
    const service_charge = vendorData.service_charge;
    const grand_total = total_price + parseInt(delivery_charge) + flat_delivery_charge + service_charge;
    
    // const api1Url = 'http://localhost:3026/needoo/api/readim_loyaltypoint';
    
    // const fetchData = async (url) => {
    // const response = await fetch(url);
    // const data = await response.json();
    // return data;
    // };
   
    // const fetchAllData = async () => {
    // try {
    //     const [api1Data] = await Promise.all([
    //         fetchData(api1Url),
          
    //     ]);
    //     console.log('Data from API 1:', api1Data);  
    // } catch (error) {
    //     console.error('Error fetching data:', error);
    // }
    // };

    // fetchAllData();
    // console.log(fetchAllData())
    
    // Prepare the response data
    const responseData = {
      "result": "true",
      "message": "Cart details and calculation data retrieved successfully",
      "data": [{
        userId: user_id,
        cartId: cartData._id,
        products: productsArray.map(product => ({
          shopId: product.shopId,
          productId: product.productId._id,
          products_name: product.productId.products_name,
          product_image: product.productId.images[0],
          variants: product.productId.variants,
          mrp_price: product.productId.mrp_price,
          sale_price: product.productId.sale_price,
          discount: product.productId.discount,
          qty: product.qty,
          price: product.price,
        })),
        total_price: total_price,
        delivery_charge: parseInt(delivery_charge),
        flat_delivery_charge: flat_delivery_charge,
        service_charge: service_charge,
        grand_total: grand_total,
        //point_ammount: fetchData.point_ammount,
      }]
    };
    // Convert response data to array

    // Send the response
    res.status(200).json(responseData);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ "result": "false", "message": error.message });
  }
};



/*...............cart_calculation api...................*/
const cart_calculation = async (req, res) => {
  try {
    const { cartId, userId } = req.body;

    if (!cartId || !userId) {
      res.status(400).json({ "result": "false", "message": "required parameter is cartId & userId" });
    } else {
      const cart_data = await Cart.findOne({ _id: cartId, userId: userId }).populate('products.productId');
      const user_id = cart_data.userId;
      const shop_id = cart_data.products[0].shopId;

      const address_data = await Address.findOne({userId: user_id, place_type:'Home' });
      const vender_data = await Vender.findById({_id: shop_id });
      
      const latitude = address_data.geo_location.coordinates[1]
      const longitude = address_data.geo_location.coordinates[0]
      
      const latitude_shop = vender_data.geo_location.coordinates[1]
      const longitude_shop = vender_data.geo_location.coordinates[0]

      function calculateDistance(lat1, lon1, lat2, lon2) {
      const earthRadius = 6371; // Radius of the Earth in kilometers
 
      // Convert latitude and longitude from degrees to radians
      const radLat1 = (Math.PI * lat1) / 180;
      const radLon1 = (Math.PI * lon1) / 180;
      const radLat2 = (Math.PI * lat2) / 180;
      const radLon2 = (Math.PI * lon2) / 180;

      // Calculate the differences between the coordinates
      const deltaLat = radLat2 - radLat1;
      const deltaLon = radLon2 - radLon1;

      // Haversine formula
      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) *  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // Distance in kilometers
      const distance = earthRadius * c;

      return distance;
    }

    var distance = calculateDistance(latitude_shop, longitude_shop, latitude, longitude);
    distance =  distance.toFixed(2)
    console.log(distance,typeof 'distance')

      if (!cart_data) {
        res.status(400).json({
          "result": "false",
          "message": "data not found",
        });
      } else {
        const productsArray = cart_data.products || []; // Use an empty array if products is null
        let total_price = 0;

        for (let i = 0; i < productsArray.length; i++) {
          const price = productsArray[i].price;
          total_price += price;
        }

        //console.log('Total Price:', total_price);

        async function fetchShopData() {
          if (productsArray.length > 0) {
            const shopIdAtIndex0 = productsArray[0].shopId;
            const result = await Vender.findById(shopIdAtIndex0);

            if (result) {
              const delivery_charge = result.delivery_charge * distance;
              const flat_delivery_charge = result.flat_delivery_charge;
              const service_charge = result.service_charge;
              const grand_total = total_price + parseInt(delivery_charge) + flat_delivery_charge + service_charge;
              return {
                delivery_charge: delivery_charge,
                flat_delivery_charge: flat_delivery_charge,
                service_charge:service_charge,
                grand_total: grand_total
              };
            } else {
              console.log('No shop found with the given ID');
            }
          } else {
            console.log('No products in the array');
          }
        }

        const shopData = await fetchShopData();

        res.status(200).json({
          "result": "true",
          "message": "cart calculation data get successfully",
          total_price: total_price,
          delivery_charge: parseInt(shopData.delivery_charge),
          flat_delivery_charge: shopData.flat_delivery_charge,
          service_charge:shopData.service_charge,
          grand_total: shopData.grand_total,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ "result": "false", "message": error.message });
  }
};



/*...............cart update api.............,*/
const update_cart = async (req, res) => {
  try {
    const { userId, productId, qty, price } = req.body;
    if (userId && productId && qty && price) {
      const cart = await Cart.findOne({ userId: userId,booking_status:0 });
      if (!cart) {
        res.status(400).json({
          result: 'false',
          message: 'Cart not found.',
        });
      }else{
        // Check if the product already exists in the cart
        const productIndex = cart.products.findIndex(
          (product) => product.productId.toString() === productId
        );

        if (productIndex !== -1) {
          // Update the product's quantity and price in the cart         
          cart.products[productIndex].qty = qty;
          cart.products[productIndex].price  = price * qty;

          // Save the updated cart
          await cart.save();

          res.status(200).json({
            result: 'true',
            message: 'Cart updated successfully',
          });
        } else {
          res.status(400).json({
            result: 'false',
            message: 'Product not found in the cart',
          });
        }
      }
    } else {
      res.status(400).json({
        result: 'false',
        message: 'Required parameters: userId, productId, qty, price',
      });
    }
  } catch (error) {
    res.status(500).json({
      result: 'false',
      message: error.message,
    });
  }
};

/*................delete cart api..........*/
const delete_cart_one=async(req,res)=>{
  try{
    const { cartId,productId}=req.body;
    if(cartId && productId){
      const result = await Cart.updateOne(
        { "_id": cartId,},
        { $pull: { "products": { "productId": productId} } }
      );
      res.status(200).json({
        "result":'true',
        "message":'cart product deleted successfully..'
      });    
    }else{
      res.status(400).json({
        "result":'false',
        "message":'parameter required cartId, productId'
      })
    }
  }catch(error){
    console.log(error.message);
  }
};

/*................delete cart api..........*/
const delete_cart = async (req, res) => {
  try {
    const { cartId, productId } = req.body;
    if (cartId && productId) {
      const result = await Cart.updateOne(
        { "_id": cartId, "products.productId": productId },
        { $pull: { "products": { "productId": productId } }
      });

      // Check if the product array is empty after deletion
      const cart = await Cart.findOne({ "_id": cartId });

      if (cart.products.length === 0) {
        // If the product array is empty, delete the entire cart
        await Cart.deleteOne({ "_id": cartId });
      }

      res.status(200).json({
        "result": 'true',
        "message": 'cart product deleted successfully.'
      });
    } else {
      res.status(400).json({
        "result": 'false',
        "message": 'parameters required: cartId, productId'
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
 

/*................add order api..........*/
const Add_Order = async (req, res) => {
  const {userId,cartId,shopId,addressId,discount_price,total_ammount,grand_total,payment_mode} = req.body;
  try {
      if(userId && cartId && shopId && addressId && discount_price && total_ammount && grand_total && payment_mode) {
        const date = new Date();
        const option = { timeZone: 'Asia/Kolkata' };
        const day = date.getDate(); // Day of the month
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = monthNames[date.getMonth()]; // Month name
        const year = date.getFullYear(); // Year
        const hours = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Kolkata' }); // Time
        const formattedDate = `${day} ${month} ${year}, ${hours}`;

        function generateOrderNumber() {
          const now = new Date();
          const year = now.getFullYear().toString().slice(-4);
          const month = ('0' + (now.getMonth() + 1)).slice(-2);
          const day = ('0' + now.getDate()).slice(-2); 
          const orderCount = Math.floor(1000 + Math.random() * 9000); 
          //const orderCountStr = ('0000' + orderCount.count).slice(-4);
          const orderNumber = year + month + day + orderCount;
          return orderNumber;
        }

        const orderNumber = generateOrderNumber();

        const single_shop_data = await Vender.findById({_id:shopId});
        const get_minimum_order = single_shop_data.min_order;
        if(get_minimum_order<=total_ammount){
       
          const order = new Order({ userId,cartId,shopId,addressId,order_no:orderNumber,discount_price,grand_total,payment_mode,order_date:formattedDate,in_progress_date:" ",asign_date:" ",delivery_date:" ",completed_date:" ",vender_status:" ",order_status:'Pending',driver_assign_status:'0'})
          const result = await order.save();
          const status = await Cart.findOneAndUpdate({_id:cartId,userId: userId},{$set:{'booking_status':'1'}},{new:true});
          res.status(200).json({
            result: 'true',
            msg: 'user product order add successfully..',
            data:result
          })

          const user_loyalty = await UserLoyalty.findOne({ "shopId": shopId, "userId": userId});
          const point_data = await loyaltyCartModel.findOne({"shopId":shopId});
          const mini = point_data.minimum_order; 

          if(user_loyalty && (mini <= total_ammount)){
          
              const shop_points = point_data.points;
              const points = user_loyalty.points;
              const total_point = points + shop_points
              
              const data=await UserLoyalty.findOneAndUpdate({"shopId": shopId,"userId":userId},{"points":total_point},{new:true});
              res.status(400).json({  
                result:'false',
                msg: 'loyalty point updated by user account.' 
              });
         
          }else{

             if(mini <= total_ammount){
                const get_point = point_data.points;
                const userloyaltyCartData = new UserLoyalty({ shopId, userId, points:get_point, loyalty_status: "1" });
                const data = await userloyaltyCartData.save(); // Fixed: Corrected variable name
                 res.status(200).json({ result: "true", msg: "loyalty cart create successfully", data: data });
              }else{
                res.status(400).json({ 
                   result:'false',
                   msg: 'no any offer in this shop..' 
                });
              }    
          }
        
          const data = await User.findById({ _id: userId });
          const shop_data = await Vender.findById({ _id: shopId });
          console.log(data)
          var token = [data.fcm_id]
          var payload ={
              notification:{
              title: "Needoo User App",
              body: `Your Order ${result.order_no} is placed successfully to ${shop_data.shop_name}.`
              }
           };
          var options ={
              priority: "high",
              timeToLive: 60 * 60 *24
          };
       
          admin.messaging().sendToDevice(token, payload, options)
          .then (function(response) {
          console.log ("Successfully sent message:", response);
          }).catch(function(error) {
          console.log( "Error sending message:", error);
          }); 
          var token1 = [shop_data.fcm_id]
          var payload1 ={
              notification:{
              title: "Needoo Vender App",
              body: `Your Order booked by ${data.user_name}.`
              }
           };
          var options1 ={
              priority: "high",
              timeToLive: 60 * 60 *24
          };
       
          admin.messaging().sendToDevice(token1, payload1, options1)
          .then (function(response) {
          console.log ("Successfully sent message:", response);
          }).catch(function(error) {
          console.log( "Error sending message:", error);
          }); 
          const notification = new Notification({ userId,shopId,orderId:result._id,order_no:result.order_no,title:payload.notification.title,shop_title:payload1.notification.title,notification:payload.notification.body,shop_notification:payload1.notification.body,date:formattedDate})
          await notification.save();
        }else{
          res.status(400).json({ 
            result:'false',
            msg: `Your order value is less than the minimum order value ${get_minimum_order} of this store..` 
          }); 
        }    
      }else{
        res.status(400).json({ 
          result:'false',
          msg: 'parameter required userId,cartId,shopId,addressId,discount_price,total_ammount, grand_total & payment_mode(online,offline)..' 
        }); 
      }
  } catch (error) {
    console.log(error.message)
  }
};



//create my order list api 
 const My_Order_List = async(req,res)=>{
    try{
        const { userId }=req.body;
        if(userId){
            var createdAt = {'createdAt': -1}
            const result = await Order.find({"userId":userId}).populate({
                path:'cartId',
                populate: {
                    path: 'products.productId', 
                },
            }).sort(createdAt);
            
            if(!result || result.length==0){
                res.status(400).json({
                    result:'false',
                    msg:'record not found..'
                });
            }else{
                const data = result.map(item => ({
                    orderId:item._id,
                    userId:item.userId,
                    cartId:item.cartId._id,
                    order_no:item.order_no,
                    address:item.address,
                    city:item.city,
                    pin_code:item.pin_code,
                    grand_total:item.grand_total,
                    order_status:item.order_status,
                    product_count:item.cartId.products.length,
                    order_date:item.order_date,
                    products: item.cartId.products.map(product => ({
                        productId: product.productId._id,
                        product_name: product.productId.products_name,
                        product_image: product.productId.images[0],
                        variants: product.productId.variants,
                    }))
                }));
                res.status(200).json({
                    result:'true', 
                    msg: 'order list get successfully..',
                    data:data
                })
            }       
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required userId..'
            })
        }
    }catch(error){
        console.log(error.message);
    }
}

const My_Order_Data = async (req, res) => {
    try {
        const { userId } = req.body;
        if (userId) {
            var createdAt = { 'createdAt': -1 }
            const result = await Order.find({
                "userId": userId,
                "order_status": { $in: ["Pending", "In Progress", "Ready", "Packed"] }
            }).populate({
                path: 'cartId',
                populate: {
                    path: 'products.productId',
                },
            }).sort(createdAt);

            if (!result || result.length == 0) {
                res.status(400).json({
                    result: 'false',
                    msg: 'Record not found.'
                });
            } else {
                const data = result.map(item => ({
                    orderId: item._id,
                    userId: item.userId,
                    cartId: item.cartId._id,
                    order_no: item.order_no,
                    address: item.address,
                    city: item.city,
                    pin_code: item.pin_code,
                    grand_total: item.grand_total,
                    order_status: item.order_status,
                    product_count: item.cartId.products.length,
                    order_date: item.order_date,
                    products: item.cartId.products.map(product => ({
                        productId: product.productId._id,
                        product_name: product.productId.products_name,
                        product_image: product.productId.images[0],
                        variants: product.productId.variants,
                    }))
                }));
                res.status(200).json({
                    result: 'true',
                    msg: 'Order list retrieved successfully.',
                    data: data
                })
            }
        } else {
            res.status(400).json({
                result: 'false',
                msg: 'Parameter required: userId.'
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            result: 'false',
            msg: 'Internal server error.'
        });
    }
}


//create my order status api 
 const My_Order_Status = async(req,res)=>{
    try{
        const { userId,order_status }=req.body;
        if(userId && order_status ){
            const result = await Order.find({"userId":userId,"order_status":order_status}).populate({
                path:'cartId',
                populate: {
                    path: 'products.productId', 
                },
            });
            
            if(!result || result.length==0){
                res.status(400).json({
                    result:'false',
                    msg:'record not found..'
                });
            }else{
                const data = result.map(item => ({
                    orderId:item._id,
                    userId:item.userId,
                    cartId:item.cartId._id,
                    order_no:item.order_no,
                    address:item.address,
                    city:item.city,
                    pin_code:item.pin_code,
                    grand_total:item.grand_total,
                    order_status:item.order_status,
                    product_count:item.cartId.products.length,
                    order_date:item.order_date,
                    products: item.cartId.products.map(product => ({
                        productId: product.productId._id,
                        product_name: product.productId.products_name,
                        product_image: product.productId.images[0]
                    }))
                }));
                res.status(200).json({
                    result:'true', 
                    msg: 'order status data get successfully..',
                    data:data
                })
            }
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required userId & order_status(In Progress,Completed,Cancel)..'
            })
        }
    }catch(error){
        console.log(error.message);
    }
}

//create shop order list api 
 const Reject_Order_List = async(req,res)=>{
    try{
        const { userId }=req.body;

        if(userId){
            var createdAt = {'createdAt': -1}
            const result = await Order.find({"userId":userId,
                'vender_status': "reject"  
                }).populate('addressId').populate({
                path:'cartId',
                populate: {
                    path: 'products.productId', 
                },
            }).sort(createdAt);
            
            if(!result || result.length==0){
                res.status(400).json({
                    result:'false',
                    msg:'record not found..'
                });
            }else{
                const data = result.map(item => ({
                      orderId: item._id,
                      userId: item.userId,
                      shopId: item.shopId,
                      cartId: item.cartId._id,
                      address: item.addressId ? item.addressId.address : '',
                      city: item.addressId ? item.addressId.city : '',
                      pin_code: item.addressId ? item.addressId.pin_code : '',
                      order_no: item.order_no,
                      grand_total: item.grand_total,
                      order_status: item.order_status,
                      vender_status: item.vender_status,
                      product_count: item.cartId ? item.cartId.products.length : 0,
                      order_date: item.order_date,
                      driver_assign_status: item.driver_assign_status,
                      products: item.cartId ? item.cartId.products.map(product => ({
                        productId: product.productId ? product.productId._id : null,
                        product_name: product.productId ? product.productId.products_name : '',
                        product_image: product.productId && product.productId.images.length > 0 ? product.productId.images[0] : null,
                        variants: product.productId ? product.productId.variants : []
                      })) : []
                }));
                res.status(200).json({
                    result:'true', 
                    msg: 'order list get successfully..',
                    data:data
                })
            }       
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required userId..'
            })
        }
    }catch(error){
        console.log(error.message);
    }
}


/*......................Product_list_by_Product_Category list.................*/
const Product_list_by_Product_Category = async (req, res) => {
  try {
    const { shopId, userId,subcategory } = req.body;
    if (!shopId || !userId || !subcategory) {
      return res.status(400).json({ 'result': "false", "message": "required parameters are shopId, userId and subcategory" });
    }

    // Fetch unique product names for the shop
    const uniqueProductNames = await ShopProduct.distinct('products_name', { shopId: shopId });

    // Fetch all products for the shop
    const productData = await ShopProduct.find({ shopId:shopId,subcategory:subcategory });

    // Filter to get only unique products
    const uniqueProducts = productData.filter((item, index, self) =>
      self.findIndex((t) => t.products_name === item.products_name) === index
    );

    // Fetch user's cart
    const userCart = await Cart.find({
      userId: new mongoose.Types.ObjectId(userId),
      booking_status: 0
    });

    // Create a map of product IDs in the user's cart
    const userCartProductIds = new Set();
    userCart.forEach(cartItem => {
      cartItem.products.forEach(product => {
        userCartProductIds.add(product.productId.toString());
      });
    });

    // Set cart_status (booking_status) for each product based on the user's cart
      const mergedData = uniqueProducts.map(product => {
      const cartStatus = userCartProductIds.has(product._id.toString()) ? 1 : 0;
      const cartItem = userCart.find(cartItem => cartItem.products.some(productInCart => productInCart.productId.toString() === product._id.toString()));
      const qty = cartItem ? cartItem.products.find(productInCart => productInCart.productId.toString() === product._id.toString()).qty : 0;

      return {
        ...product.toObject(),
        cart_status: cartStatus,
        qty:qty,
      };
    });                                                         

    // Fetch variant data for each product
    const variantPromises = mergedData.map(async (item) => {
      const variants = await ShopProduct.find({ shopId: shopId, products_name: item.products_name });
      return variants.map((variant) => ({ variants: variant.variants }));
    });

    const variantData = await Promise.all(variantPromises);

    // Prepare the response data
    const dinu = mergedData.map((item, index) => {
      return {
        shop_productId: item._id,
        shop_name: item.shop_name,
        product_name: item.products_name,
        brand_name: item.brand_name,
        description: item.description,
        cart_status: item.cart_status,
        images: item.images,
        qty:item.qty,
        mrp_price: item.mrp_price,
        sale_price: item.sale_price,
        discount: item.discount,
        variants: variantData[index],
      };
    });

    res.status(200).json({
      "result": "true",
      "message": "Unique shop product list",
      "path": "http://103.104.74.215:3026/uploads/",
      data: dinu
    });
  } catch (error) {
    res.status(500).json({ 'result': "false", "message": error.message });
  }
};

/*......................search shop product list.................*/
const SearchProduct_list = async (req, res) => {
  try {
    const { shopId,products_name,userId} = req.body;
    if (!shopId || !products_name || !userId) {
      return res.status(400).json({ 'result': "false", "message": "required parameters are shopId, products_name & userId" });
    }

    // Fetch all products for the shop
    const productData = await ShopProduct.find({"shopId":shopId,"products_name":{ $regex: products_name, $options: 'i' } });
    // Fetch unique product names for the shop
    console.log(productData)
    if(productData && productData.length > 0){
    const uniqueProductNames = await ShopProduct.distinct('products_name', { shopId: shopId });

    // Fetch all products for the shop
    //const productData = await ShopProduct.find({ shopId:shopId });

    // Filter to get only unique products
    const uniqueProducts = productData.filter((item, index, self) =>
      self.findIndex((t) => t.products_name === item.products_name) === index
    );

    // Fetch user's cart
    const userCart = await Cart.find({
      userId: new mongoose.Types.ObjectId(userId),
      booking_status: 0
    });

    // Create a map of product IDs in the user's cart
    const userCartProductIds = new Set();
    userCart.forEach(cartItem => {
      cartItem.products.forEach(product => {
        userCartProductIds.add(product.productId.toString());
      });
    });

    // Set cart_status (booking_status) for each product based on the user's cart
      const mergedData = uniqueProducts.map(product => {
      const cartStatus = userCartProductIds.has(product._id.toString()) ? 1 : 0;
      const cartItem = userCart.find(cartItem => cartItem.products.some(productInCart => productInCart.productId.toString() === product._id.toString()));
      const qty = cartItem ? cartItem.products.find(productInCart => productInCart.productId.toString() === product._id.toString()).qty : 0;

      return {
        ...product.toObject(),
        cart_status: cartStatus,
        qty:qty,
      };
    });                                                         

    // Fetch variant data for each product
    const variantPromises = mergedData.map(async (item) => {
      const variants = await ShopProduct.find({ shopId: shopId, products_name: item.products_name });
      return variants.map((variant) => ({ variants: variant.variants }));
    });

    const variantData = await Promise.all(variantPromises);
    

    // Prepare the response data
    const dinu = mergedData.map((item, index) => {
      return {
        shop_productId: item._id,
        shop_name: item.shop_name,
        product_name: item.products_name,
        brand_name: item.brand_name,
        description: item.description,
        cart_status: item.cart_status,
        images: item.images,
        qty:item.qty,
        mrp_price: item.mrp_price,
        sale_price: item.sale_price,
        discount: item.discount,
        variants: variantData[index],
      };
    });
    
      res.status(200).json({
        "result": "true",
        "message": "Unique shop product data list",
        "path": "http://103.104.74.215:3026/uploads/",
         data: dinu
      });

    }else{
      res.status(400).json({
        "result": "false",
        "message": "record not found",
      });  
    }
  } catch (error) {
    res.status(500).json({ 'result': "false", "message": error.message });
  }
};



/*................report status................*/
const reportStatus = async (req, res) => {
  try {
    const { userId, shopId } = req.body;
    if (!userId || !shopId) {
      return res.status(400).json({ result: 'false', message: 'Required parameters are userId & shopId' });
    }
    const userData = await Cart.findOne({ userId: userId, booking_status:0 });
    const productData = await Cart.findOne({ userId: userId, booking_status:0,'products.shopId': shopId });
    

    if (!userData) {
      return res.status(200).json({
        result: 'true',
        message: 'Product not found for this shop',
        //shop_name: shopDetails.shop_name,
        report_status: 0,
      });
    } else if (productData) {
      return res.status(200).json({
        result: 'true',
        message: 'Product found for this shop',
        //shop_name: shopDetails.shop_name,
        report_status: 0,
      });
    } else if(!productData || (productData.products && productData.products.every(product => product.shopId != shopId))) {
      const firstProduct = userData.products[0];  // Assuming there is at least one product
      const shop_id = firstProduct.shopId;
      const shopDetails = await Vender.findById({ _id: shop_id });
      return res.status(404).json({
        result: 'false',
        message: 'Product not found for this shop',
        shop_name: shopDetails.shop_name,
        report_status: 1,
      });
    }
  } catch (error) {
    return res.status(500).json({ result: 'false', message: error.message });
  }
};


/*................shop data................*/
const shopData = async (req, res) => {
  try {
    const { shopId,products_name } = req.body;
    if (!shopId ||  !products_name) {
      return res.status(400).json({ result: 'false', message: 'Required parameters are shopId & products_name,' });
    }
    const productData = await ShopProduct.find({ "shopId": shopId,"products_name": products_name });
    
   
    if(!productData) {
      return res.status(404).json({ result: 'false', message: 'Product not found' });
    }else{

      const data = productData.map(item => ({
                   shop_productId: item._id,
                   shop_name: item.shop_name,
                   product_name: item.products_name,
                   brand_name: item.brand_name,
                   description: item.description,
                   cart_status: item.cart_status,
                   images: item.images,
                   qty:item.qty,
                   mrp_price: item.mrp_price,
                   sale_price: item.sale_price,
                   discount: item.discount,
                   variants: item.variants,
        }));
       
        return res.status(200).json({
          result: 'true',
          message: 'Product details retrieved successfully...',
          path: 'http://103.104.74.215:3026/uploads/',
          data: data,
        });
      }
    
  } catch (error) {
    return res.status(500).json({ result: 'false', message: error.message });
  }
};



/*......................Product_Varients_list list.................*/
const Product_Variants_List = async (req, res) => {
  try {
    const { shopId,products_name,variants} = req.body;
    if (!shopId || !products_name || !variants) {
      return res.status(400).json({ 'result': "false", "message": "required parameters are shopId, products_name & variants" });
    }

    // Fetch all products for the shop
    const productData = await ShopProduct.find({"shopId":shopId,"products_name": products_name,"variants":variants});
          // Fetch variant data for each product
    const variantPromises = mergedData.map(async (item) => {
      const variants = await ShopProduct.find({ shopId: shopId, products_name: item.products_name });
      return variants.map((variant) => ({ variants: variant.variants }));
    });

    const variantData = await Promise.all(variantPromises);
    
    if(productData){
    // Prepare the response data
    const dinu = productData.map((item, index) => {
      return {
        shop_productId: item._id,
        shop_name: item.shop_name,
        product_name: item.products_name,
        brand_name: item.brand_name,
        description: item.description,
        cart_status: item.cart_status,
        images: item.images,
        qty:item.qty,
        mrp_price: item.mrp_price,
        sale_price: item.sale_price,
        discount: item.discount,
        variants: variantData[index],
      };
    });
    
      res.status(200).json({
        "result": "true",
        "message": "Unique shop product data list",
        "path": "http://103.104.74.215:3026/uploads/",
        data:dinu
       });

    }else{
      res.status(400).json({
        "result": "false",
        "message": "record not found",
      });  
    }
  } catch (error) {
    res.status(500).json({ 'result': "false", "message": error.message });
  }
};

/*...............user like shop api....................*/
const like_shop=async(req,res)=>{
  try{
    const {userId,shopId,like_shop_status}=req.body;
    if(!userId || !shopId || !like_shop_status){
      res.status(400).json({"result":"false","message":"required parameters are userId,shopId & like_shop_status(like=1,dislike=0)"});
    }else{
      const data = await LikeShop.findOne({userId:userId,shopId:shopId});
      if(!data && like_shop_status=='1'){
         const data =new LikeShop({userId,shopId,like_shop_status});
         await data.save(); 
         res.status(200).json({"result":"true","message":"shop like successfully",data:data})
      }else if(data && like_shop_status=='0'){
         const data = await LikeShop.findOneAndUpdate({userId:userId,shopId:shopId},{$set:{like_shop_status:like_shop_status}},{new:true});
         res.status(200).json({"result":"true","message":"shop dislike successfully",data:data})
      }else{
         const data = await LikeShop.findOneAndUpdate({userId:userId,shopId:shopId},{$set:{like_shop_status:like_shop_status}},{new:true});
         res.status(200).json({"result":"true","message":"shop like successfully",data:data})
      }       
    }
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};

/*................like shop data................*/
const Like_Shop_Data = async (req, res) => {
  try {
    const {userId} = req.body;
    if (!userId ) {
      return res.status(400).json({ result: 'false', message: 'Required parameters are userId,' });
    }
    const shopData = await LikeShop.find({ 'userId': userId, 'like_shop_status':'1' }).populate('shopId');
    
   
    if(!shopData) {
      return res.status(404).json({ result: 'false', message: 'record not found' });
    }else{

      const data = shopData.map(item => ({
          userId:item.userId,
          shopId: item.shopId._id,
          shop_name: item.shopId.shop_name,
          shop_image: item.shopId.shop_image,
          shop_address:item.shopId.shop_address,
          like_shop_status:item.like_shop_status
        }));
       
        return res.status(200).json({
          result: 'true',
          message: 'like shop data get successfully...',
          path: 'http://103.104.74.215:3026/uploads/',
          data: data,
        });
      }
    
  } catch (error) {
    return res.status(500).json({ result: 'false', message: error.message });
  }
};

/*................get_like_shop data................*/
const get_like_shop = async (req, res) => {
  try {
    const {userId,shopId} = req.body;
    if (!userId && !shopId ) {
      return res.status(400).json({ result: 'false', message: 'Required parameters are userId & shopId,' });
    }
    const shopData = await LikeShop.findOne({ 'userId': userId, 'shopId': shopId });
    
   
    if(!shopData) {
      return res.status(404).json({ result: 'false', message: 'record not found',like_shop_status:'0' });
    }else{

        return res.status(200).json({
          result: 'true',
          message: 'like shop data get successfully...',
          data: shopData,
        });
      }
    
  } catch (error) {
    return res.status(500).json({ result: 'false', message: error.message });
  }
};

//create track my order list api 
const Track_My_Order = async(req,res)=>{
    try{
        const { orderId }=req.body;
        if(orderId ){
            const result = await Order.find({"_id":orderId}).populate('userId').populate('addressId').populate('shopId').populate({
                path:'cartId',
                populate: {
                    path: 'products.productId', 
                },
            });
        
            if(!result || result.length==0){
                res.status(400).json({
                    result:'false',
                    msg:'record not found..'
                });
            }else{
                //const delivery_charge = await Delivery_Charge.findOne({});
                const data = result.map(item => ({
                    order_id:item._id,
                    userId:item.userId._id,
                    cartId:item.cartId._id,
                    address:item.addressId ? item.addressId.address : '',
                    city:item.addressId.city,
                    pin_code:item.addressId.pin_code,
                    discount_price:item.discount_price,
                    grand_total:item.grand_total,
                    order_status:item.order_status,
                    product_count:item.cartId.products.length,
                    payment_mode:'cash on delivery',
                    delivery_charge:item.shopId.delivery_charge,
                    order_date:item.order_date,
                    in_progress_date:item.in_progress_date,
                    asign_date:item.asign_date,
                    delivery_date:item.delivery_date,
                    completed_date:item.completed_date,
                    cancel_date:item.cancel_date,
                    products: item.cartId.products.map(product => ({
                        productId: product.productId._id,
                        product_name: product.productId.products_name,
                        variant:product.productId.variant,
                        mrp_price:product.productId.mrp_price,
                        sale_price:product.productId.sale_price,
                        qty:product.qty,
                        price:product.price,
                        product_image: product.productId.images[0],
                        description: product.productId.description
                    }))
                }));
                res.status(200).json({
                    result:'true', 
                    msg: 'order list get successfully..',
                    data:data
                })
            }       
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required orderId..'
            })
        }
    }catch(error){
        console.log(error.message);
    }
}

/*................get_like_shop data................*/
const get_driver_latlog = async (req, res) => {
  try {
    const {userId,orderId} = req.body;
    if (!userId && !orderId ) {
      return res.status(400).json({ result: 'false', message: 'Required parameters are userId & orderId,' });
    }
    const data = await Asign_Diver.findOne({ 'userId': userId, 'orderId': orderId });
    const driver_id = data.driverId;
    const result = await Driver.findById({_id: driver_id});
    if(!result) {
      return res.status(404).json({ 
        result: 'false',
         message: 'record not found' 
       });
    }else{
        return res.status(200).json({
          result: 'true',
          message: 'data get successfully...',
          data:{
            driverId:result._id,     
            driver_name:result.driver_name,
            location:result.location
          } 
        });
      }
    
  } catch (error) {
    return res.status(500).json({ result: 'false', message: error.message });
  }
};


/*...................get_driver_details.................*/
const get_driver_details = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ "result": "false", "message": "required parameter is orderId" });
    }

    const result = await Asign_Diver.find({ orderId: orderId }).populate('driverId')
    if(result){
      const data = result.map(item => ({
        driverId: item.driverId._id,
        driver_name: item.driverId.driver_name,
        driver_mobile_no: item.driverId.mob,
        driver_image: item.driverId.image
      }));

      res.status(200).json({
        "result": "true",
        "message": "driver details get successfully",
        data: data
      });
    }else{
      res.status(400).json({
        "result": "false",
        "message": "record not found",
      });
    }  
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      "result": "false",
      "message": err.message
    });
  }
};

/*...................get_notification_list.................*/
const get_notification_list = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ "result": "false", "message": "required parameter is userId" });
    }
  var createdAt = {'createdAt': -1} 
  const result = await Notification.find({ "userId": userId }).sort(createdAt);
  
    if(result){
      const data = result.map(item => ({
        userId:item.userId,
        title: item.title,
        notification: item.notification,
        date: item.date,
        orderId: item.orderId,
        order_no: item.order_no
        }));
      res.status(200).json({
        "result": "true",
        "message": "notification list get successfully",
        data: data
      });
    }else{
      res.status(400).json({
        "result": "false",
        "message": "record not found",
      });
    }  
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      "result": "false",
      "message": err.message
    });
  }
};

/*...................get_shop_status.................*/
const get_shop_status = async (req, res) => {
  try {
    const { shopId,open_time,close_time } = req.body;
    if (!shopId && !open_time && !close_time) {
      return res.status(400).json({ "result": "false", "message": "required parameter is shopId, open_time & close_time " });
    }

    const result = await Vender.findById({ _id: shopId });
  
    if(result){
      const currentHour = new Date().getHours();
      console.log(currentHour)
      const openTime = parseInt(open_time);
      console.log(openTime)
      const closeTime = parseInt(close_time);
      console.log(closeTime)
      const isOpen = currentHour >= openTime && currentHour < closeTime;
      console.log(isOpen)
      res.status(200).json({
        "result": isOpen,
        //isOpen: isOpen,
        "message": isOpen ? 'The shop is open.' : 'The shop is closed.'
      });
    }else{
      res.status(400).json({
        "result": "false",
        "message": "shopId does not exist",
      });
    }  
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      "result": "false",
      "message": err.message
    });
  }
};

/*................Cancel_Order api.............*/
const Cancel_Order=async(req,res)=>{
  try{
    const {orderId,userId,order_status}=req.body;
    if(!orderId || !userId || !order_status){
      res.status(400).json({
        "result":"false",
        "message":"required parameter are orderId, userId & order_status"
      });
    }else{
      const date = new Date();
      const option = { timeZone: 'Asia/Kolkata' };
      const day = date.getDate(); // Day of the month
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const month = monthNames[date.getMonth()]; // Month name
      const year = date.getFullYear(); // Year
      const hours = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Kolkata' }); // Time
      const formattedDate = `${day} ${month} ${year}, ${hours}`;
        const data = await Order.findOneAndUpdate({_id: orderId,userId:userId},{order_status:order_status,cancel_date:formattedDate},{new:true});
        res.status(200).json({
          "result":"true",
          "message":"user order cencel successfully"
        });
     
    }
  }catch(error){
    console.log(error.message);
    res.status(400).json({
      "result":"false",
      "message":error.message
    });
  }
};

//create delete user account api 
const delete_user_account = async(req,res)=>{
  try{
    const { userId }=req.body;
      if(userId){  
        const user_data = await User.findById({_id:userId});

        if(user_data){
          // await User.deleteOne({_id:userId});
          // await Cart.deleteMany({userId:userId});
          // await Order.deleteMany({userId:userId});
          // await Asign_Diver.deleteMany({userId:userId});
          // await Address.deleteMany({userId:userId});
          // await Notification.deleteMany({userId:userId});
          // await Qrcodes.deleteMany({userId:userId});
          await Promise.all([
          User.deleteOne({ _id: userId }),
          Cart.deleteMany({ userId }),
          Order.deleteMany({ userId }),
          Asign_Diver.deleteMany({ userId }),
          Address.deleteMany({ userId }),
          Notification.deleteMany({ userId }),
          Qrcodes.deleteMany({ userId }),
        ]);
          res.status(200).json({
            result:'true',
            msg:'user account deleted successfully..'
          });
        }else{
          res.status(400).json({
            result:'false', 
            msg: 'userId does not exist..',
          })
        }
      }else{
        res.status(400).json({
          result:'false',
          msg:'parameter required userId..'
        })
      }
  }catch(error){
    console.log(error.message);
  }
};

/// get loyalty cart  ///
const getLoyaltyCart = async (req, res) => {
  try {
    const { shopId,userId } = req.body
    if (shopId && userId) {
      const loyaltyCart = await UserLoyalty.findOne({"shopId":shopId,"userId":userId}).populate('shopId');
      const loyalty_data = await loyaltyCartModel.findOne({"shopId":shopId});
      if (!loyaltyCart || loyaltyCart.length == 0) {
        res.status(400).json({ 
          result: "false", 
          msg: "record not found" 
        })
      } else {
        res.status(200).json({ 
          result: "true",
           msg: "user loyalty point data get successfully", 
           data:{
            userId: loyaltyCart.userId,
            user_points:loyaltyCart.points,
            shop_name:loyaltyCart.shopId.shop_name,
            shop_image:loyaltyCart.shopId.shop_image[0],
            minimum_redeem_point:loyalty_data.minimum_redeem_point,
            per_point_value:loyalty_data.per_point_value,
           } 
         })
      }
    } else {
      res.status(400).send({ result: "false", msg: "parameter require shopId & userId" })
    }

  } catch (error) {
    console.log(error.message)
  }
}


/// get loyalty cart  ///
const getMyLoyaltyCart = async (req, res) => {
  try {
    const { userId } = req.body
    if (userId) {
      const loyaltyCart = await UserLoyalty.find({userId:userId}).populate('shopId');
      if (!loyaltyCart || loyaltyCart.length == 0) {
        res.status(400).json({ result: "false", msg: "record not found" })
      } else {
        const data = loyaltyCart.map(item => ({
        userId:item.userId,
        shopId: item.shopId._id,
        shop_name:item.shopId.shop_name,
        shop_image:item.shopId.shop_image[0],
        points:item.points,
        loyalty_status:item.loyalty_status
        }));
        res.status(200).json({ result: "true", msg: "loyalty cart data get success", data: data })
      }
    } else {
      res.status(400).send({ result: "false", msg: "parameter require userId" })
    }

  } catch (error) {
    console.log(error.message)
  }
}

/// readim_loyaltypoint  ///
const readim_loyaltypoint = async (req, res) => {
  try {
    const { shopId, userId, total_ammount, points } = req.body
    if (shopId && userId && total_ammount && points) {
      
      const user_data = await UserLoyalty.findOne({"shopId":shopId,"userId":userId})
      
      if (!user_data || user_data.length == 0) {
        res.status(400).json({ result: "false", msg: "record not found" })
      } else {
        const loyalty_data = await loyaltyCartModel.findOne({"shopId":shopId});
        const get_value_of_one_point = loyalty_data.value_of_one_point;
        const point_ammount = get_value_of_one_point * points;
        const total_reaming_ammount = total_ammount - point_ammount;
        const user_points = user_data.points;
        const remaining_point = user_points-points;
        const data=await UserLoyalty.findOneAndUpdate({"shopId": shopId,"userId":userId},{"points":remaining_point},{new:true});
        res.status(200).json({ 
          result: "true",
          msg: "loyalty cart data get success", 
          total_ammount: total_reaming_ammount,
          point_ammount: point_ammount,
        });  
      }
    } else {
      res.status(400).send({
        result: "false",
        msg: "parameter required shopId, userId, total_ammount, points"
      })
    }

  } catch (error) {
    console.log(error.message)
  }
}

/*---------------------faq_data api------------------------*/
const faq_data=async(req,res)=>{
  try{
    const data=await faqListModel.find({});
    res.status(200).json({"result":"true","message":"faq list are",data:data});
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};


//export module
module.exports={
  User_login,
  Verifyotp,
  ResendOtp,
  updateProfile,
  getProfile,
  updateUser,
  userLogout,
  addAddress,
  Address_list,
  updateAddress,
  deleteAddress,
  Banner_list,
  category_list,
  faqlist,
  termlist,
  Privacy_list,
  contactus_list, 
  support_api,
  shop_list,
  store_search,
  spacific_shop_search,
  shopBanner_list, 
  shopcategory_list,
  ShopProduct_list,
  matchQrcode,
  shopInformation,
  shopDetails,
  variants_list,
  likedProducts,
  shopVariant,
  subcategory_list,
  get_subcategory_list,
  addcart,
  replacecart,
  cart_list,
  update_cart,
  delete_cart,
  Add_Order,
  My_Order_List,
  My_Order_Status,
  Product_list_by_Product_Category,
  SearchProduct_list,
  shopData,
  reportStatus,
  Product_Variants_List,
  like_shop,
  Like_Shop_Data,
  ShopProduct_list_data,
  get_like_shop,
  Track_My_Order,
  get_driver_latlog,
  get_driver_details,
  get_notification_list,
  get_shop_status,
  cart_calculation,
  Cancel_Order,
  delete_user_account,
  getLoyaltyCart,
  getMyLoyaltyCart,
  faq_data,
  readim_loyaltypoint,
  My_Order_Data,
  Get_Last_Address,
  Reject_Order_List

};



