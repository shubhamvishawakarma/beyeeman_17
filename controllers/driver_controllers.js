//import all models of admin panel here
const Driver=require("../models/driver_models");
const Order=require("../models/order_models");  
const Asign_Diver=require("../models/asign_driver_models");
const Notification=require("../models/notification_models");
const admin = require('firebase-admin');
const axios = require('axios');

/*---------------import module----------------------------*/
const mongoose = require('mongoose'); 
 
/*................user register and login api...............*/
const driver_login_one=async(req,res)=>{
  const Otp = Math.floor(1000 + Math.random() * 9000); 
  try{
    const {phone,fcm_id}=req.body; 
    const driver= await Driver.findOne({mob:phone});
    if(driver){
      const update_data = await Driver.findOneAndUpdate({mob: phone},{$set:{mob_otp:Otp,fcm_id:fcm_id}},{new:true});  
      res.status(200).json({
        "result":"true",
        "message":"driver login successfully",
        data:update_data
      });
    }else{
      if(phone && fcm_id ){
        const newDriver = new Driver({mob:phone,mob_otp:Otp})
        const driver_data=await newDriver.save()
        res.status(200).json({
          "result":"true",
          "message":"driver registered sucessfully..",data:driver_data});
      }else{
        res.status(400).json({
          "result":"false",
          "message":"parameter required phone and fcm_id"
        });
      }
    }
  }catch(error){
    res.status(400).json({
      "result":"false",
      "message":error.message
    })
  }
};

/*................user register and login api...............*/
const driver_login=async(req,res)=>{
   const {phone,fcm_id}=req.body; 
   try{
    if(phone){
      const driver= await Driver.findOne({mob:phone});
      if(driver){
        const Otp = Math.floor(1000 + Math.random() * 9000);
        const url = `https://www.fast2sms.com/dev/bulkV2?authorization=A3ndvI0uNgetJ7FWRyhpEQ4xYk2Go5ja6wXmBOHL8SZz91PcKrPgz3lScCdDNn59HW62ZLohum0iYx74&route=otp&variables_values=${encodeURIComponent(Otp)}&flash=0&numbers=${encodeURIComponent(phone)}`;
        const response = await axios.get(url);
        const update_data = await Driver.findOneAndUpdate({mob: phone},{$set:{mob_otp:Otp,fcm_id:fcm_id}},{new:true});  
        res.status(200).json({
          "result":"true",
          "message":"driver login successfully",
          data:update_data
        });
      }else{
        res.status(400).json({
          "result": "false",
          "message": "Invalid phone no, please enter valid phone no",
        });
      }
    }else{
      res.status(400).json({
        "result":"false",
        "message":"parameter required phone and fcm_id"
      });
    }
  }catch(error){
    res.status(400).json({
      "result":"false",
      "message":error.message
    })
  }
};

/*-------------------verify otp api---------------------*/
const Verifyotp = async (req, res) => {
  try{
    const {phone,otp} = req.body;
    if(phone && otp) {
      const data =await Driver.findOne({mob:phone,mob_otp:otp});
      if (data) {
        res.status(200).json({
          "result": "true",
          "message": "driver verify successfully",
           data:data
        })
      }else{
        res.status(400).json({
          "result": "false",
          "message": "Invalid phone or otp",
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
const ResendOtp_One = async (req, res) => {
  const { phone, fcm_id } = req.body;
  if (!fcm_id || !phone) {
    res.status(400).json({
      "result": "false",
      "message": "required parameters are phone and fcm_id",
    });
  } else {
    var otp = Math.floor(1000 + Math.random() * 9000);
    const update_data = await Driver.findOneAndUpdate({mob: phone},{$set:{mob_otp:otp,fcm_id:fcm_id}},{new:true});
      res.status(200).json({
        "result": "true",
        "message": "otp sent sucessfully",
        data:update_data
      });
    }
};


/*--------------------resend otp api--------------------*/
const ResendOtp = async (req, res) => {
  const { phone, fcm_id } = req.body;
  try{
    if(phone && fcm_id){
      const data =await Driver.findOne({mob:phone}); 
      if(data){
        var otp = Math.floor(1000 + Math.random() * 9000);
        const url = `https://www.fast2sms.com/dev/bulkV2?authorization=A3ndvI0uNgetJ7FWRyhpEQ4xYk2Go5ja6wXmBOHL8SZz91PcKrPgz3lScCdDNn59HW62ZLohum0iYx74&route=otp&variables_values=${encodeURIComponent(otp)}&flash=0&numbers=${encodeURIComponent(phone)}`;
        const response = await axios.get(url);
        const update_data = await Driver.findOneAndUpdate({mob: phone},{$set:{mob_otp:otp,fcm_id:fcm_id}},{new:true});
        res.status(200).json({
          "result": "true",
          "message": "otp sent sucessfully",
          data:update_data
        });
      }else{
        res.status(400).json({
          "result": "false",
          "message": "Invalid phone no,please enter vaid phone no",
        });
      } 
    }else{
      res.status(400).json({
        "result": "false",
        "message": "required parameters are phone and fcm_id",
      });
    }
  }catch(error){
    console.log(error.message)
    res.status(400).json({
      "result":"false",
      "message":error.message
    });
  }
}

/*................update user profile................*/
const updateProfile = async (req, res) => {
  try {
    const { driverId } = req.body;
    if (!driverId || !req.file) {
      res.status(400).json({"result": "false", "message": "Required parameters driverId,image" });
    }
    const profile = await Driver.findOneAndUpdate(
      { _id: driverId },
      { $set: { image: req.file.filename } },
      { new: true }
    );
    if (!profile) {
      res.status(404).json({ "result": "false", "message": "driver not found" });
    }
    res.status(200).json({ "result": "true", "message": " Driver profile updated successfully" });
  } catch (err) {
    res.status(400).json({ "result": "false", "message": err.message });
  }
};


/*...................get user profile.................*/
const getProfile=async(req,res)=>{
  try{
    const {driverId}=req.body;
    if(!driverId){
      res.status(400).json({"result":"false","message":"required parameter is driverId"});
    }
    const profile=await Driver.findOne({_id: driverId});
     if(profile){
      res.status(200).json({
        "result":"true",
        "message":"driver profile list sucessfully",
        "path":"http://103.104.74.215:3026/uploads/",
        data:profile
      });
    }else{
       res.status(400).json({
        "result":"false",
        "message":"record not found",
      });
    }
    }catch(err){
      res.status(400).json({"result":"false","message":err.message});
    }
};

/*...................update driver data.................*/
const updateDriver=async(req,res)=>{
  try{
    const {driverId,mob,driver_name,email}=req.body;
    const image = req.file;
    if(!driverId){
      res.status(400).json({
        "result":"false",
        "message":"required parameter is driverId and driver_name,email,image are optionals"
      });
    }
    const profile= await Driver.findOneAndUpdate({_id: driverId},{$set:{mob,driver_name,email,image:image.filename}},{new:true});
      res.status(200).json({
        "result":"true",
        "message":"driver profile updated sucessfully"
      });
  }catch(err){
    res.status(400).json({"result":"false","message":err.message});
  }
};

/*...................update updatelatlong data.................*/
const updatelatlong=async(req,res)=>{
  try{
    const {driverId,latitude,longitude}=req.body;

    if(!driverId && !latitude && !longitude){
      res.status(400).json({
        "result":"false",
        "message":"required parameter is driverId, latitude, & longitude"
      });
    }
    const profile= await Driver.findOneAndUpdate({_id: driverId},{$set:{'location.coordinates':[latitude,longitude]}},{new:true});
      res.status(200).json({
        "result":"true",
        "message":"driver location  updated sucessfully"
      });   
  }catch(err){
      res.status(400).json({"result":"false","message":err.message});
  }
};


/*..........user logout api.......................*/
const driverLogout=async(req,res)=>{
  try{
    const {driverId,fcm_id}=req.body;
    if(!driverId){
      res.status(400).json({
        "result":"false",
        "message":"required parameter are driverId and fcm_id but fcm_id send null"
      });
    }else{
      const data=await Driver.findOneAndUpdate({_id: driverId},{fcm_id},{new:true});
      res.status(200).json({
        "result":"true",
        "message":"data updated successfully"
      });
    }
  }catch(error){
    console.log(error.message)
    res.status(200).json({
      "result":"false",
      "message":error.message
    });
  }
};

/*...................get_order_list.................*/
const get_order_list = async (req, res) => {
  try {  
    const { driverId } = req.body;
    if (!driverId) {
      return res.status(400).json({ "result": "false", "message": "required parameter is driverId" });
    }
    const result = await Asign_Diver.find({ 'driverId': driverId })
      .populate('userId')
      //.populate('orderId')
      .populate('driverId') 
      .populate({path:'orderId',
        populate: [
           { path: 'addressId' },
           { path: 'cartId', populate: { path: 'products.productId' } }
        ]
      });
      if (!result || result.length === 0) {
      // No records found
        return res.status(400).json({
          "result": "false",
          "message": "No orders found for the given driverId"
        });
      }else{
        const filteredOrders = result.filter(item => item.orderId.order_status != 'Completed');
        //console.log(filteredOrders)
        if(filteredOrders && filteredOrders.length > 0){
          const data = filteredOrders.map(item => ({
            driverId: item.driverId._id,
            driver_name: item.driverId.driver_name,
            driver_mobile_no: item.driverId.mob,
            driver_image: item.driverId.image,
            userId: item.userId._id,
            user_name: item.userId.user_name,
            user_phone: item.userId.phone,
            orderId:item.orderId._id,
            order_no:item.orderId.order_no,
            grand_total:item.orderId.grand_total,
            order_date:item.orderId.order_date,
            order_status:item.orderId ? item.orderId.order_status:'',  
            grand_total:item.orderId.grand_total,
            //address: item.orderId.addressId.address,
            address: item.orderId.addressId ? item.orderId.addressId.address : " ",
            products: item.orderId.cartId.products.map(product => ({
              product_id: product.productId._id,
              product_name: product.productId.products_name,
              variant:product.variant,
              qty:product.qty,
              price: product.price,
              brand_name: product.productId.brand_name,
              product_image: product.productId.images[0]
            })),
          }));
          res.status(200).json({
            "result": "true",
            "message": "order list get successfully",
            data: data
          });
        }else{
          res.status(400).json({
            "result": "false",
            "message": "record not found",
          });
        }
      }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      "result": "false",
      "message": err.message
    });
  }
};

/*...................get_order_list.................*/
const get_order_status = async (req, res) => {
  try {
    const { driverId, order_status, driver_status } = req.body;
    if (!driverId || !order_status || !driver_status ) {
      return res.status(400).json({ "result": "false", "message": "required parameter is driverId, order_status & driver_status(Ready = 1, Completed = 2)" });
    }
    const result = await Asign_Diver.find({ driverId: driverId,driver_status:driver_status })
     .populate({
      path: 'orderId',
      match: { order_status: order_status }, // Use the variable order_status
      populate: [
        { path: 'addressId' },
        { path: 'cartId', populate: { path: 'products.productId' } }
      ]
    })
    .populate('userId')
    .populate('driverId');

    if (!result || result.length === 0) {
      // No records found
      return res.status(400).json({
        "result": "false",
        "message": "No orders found for the given driverId"
      });
    } else {
      const data = result.map(item => ({
       // driverId: item.driverId._id,
        driverId: item.driverId ? item.driverId._id : null,
        driver_name: item.driverId.driver_name,
        driver_mobile_no: item.driverId.mob,
        driver_image: item.driverId.image,
        //userId: item.userId._id,
        userId: item.userId ? item.userId._id : null,
        user_name: item.userId.user_name,
        user_phone: item.userId.phone,
        //orderId: item.orderId._id,
        orderId: item.orderId ? item.orderId._id : null,
        order_no: item.orderId.order_no,
        order_status:item.orderId.order_status,
        grand_total: item.orderId.grand_total,
        order_date: item.orderId.order_date,
        address: item.orderId.addressId.address,
        products: item.orderId.cartId.products.map(product => ({
         // product_id: product.productId._id,
          productId: product.productId ? product.productId._id : null,
          product_name: product.productId.products_name,
          variant: product.variant,
          qty: product.qty,
          price: product.price,
          brand_name: product.productId.brand_name,
          product_image: product.productId.images[0]
        })),
      }));

      res.status(200).json({
        "result": "true",
        "message": "order list get successfully",
        data: data
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


/*...................get_order_details.................*/
const get_order_details = async (req, res) => {
  try {
    const { driverId, orderId } = req.body;
    if (!driverId || !orderId) {
      return res.status(400).json({ "result": "false", "message": "required parameter is driverId & orderId" });
    }

    const result = await Asign_Diver.find({ driverId: driverId,orderId:orderId })
     .populate({
      path: 'orderId',
      match: { _id: orderId }, // Use the variable order_status
      populate: [
        { path: 'addressId' },
        { path: 'cartId', populate: { path: 'products.productId' } }
      ]
    })
    .populate('userId')
    .populate('driverId');

    if (!result || result.length === 0) {
      // No records found
      return res.status(400).json({
        "result": "false",
        "message": "No orders found for the given driverId"
      });
    } else {
      const data = result.map(item => ({
        driverId: item.driverId._id,
        driver_name: item.driverId.driver_name,
        driver_mobile_no: item.driverId.mob,
        driver_image: item.driverId.image,
        userId: item.userId._id,
        user_name: item.userId.user_name,
        user_phone: item.userId.phone,
        orderId: item.orderId._id,
        order_no: item.orderId.order_no,
        order_status: item.orderId.order_status,
        grand_total: item.orderId.grand_total,
        order_date: item.orderId.order_date,
        address: item.orderId.addressId.address,
        products: item.orderId.cartId.products.map(product => ({
          product_id: product.productId._id,
          product_name: product.productId.products_name,
          variant: product.variant,
          qty: product.qty,
          price: product.price,
          brand_name: product.productId.brand_name,
          product_image: product.productId.images[0]
        })),
      }));

      res.status(200).json({
        "result": "true",
        "message": "order list get successfully",
        data: data
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


/*................Update_Order_Status api.............*/
const Update_Order_Status=async(req,res)=>{
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
      
      if(order_status == 'Ready'){
        const data = await Order.findOneAndUpdate({_id: orderId,userId:userId},{order_status:order_status,delivery_date:formattedDate,driver_assign_status:'2'},{new:true});
        await Asign_Diver.findOneAndUpdate({orderId: orderId,userId:userId},{driver_status:'1'},{new:true});
        res.status(200).json({
          "result":"true",
          "message":"user order ready by driver"
        });
      }else{
        const data = await Order.findOneAndUpdate({_id: orderId,userId:userId},{order_status:order_status,completed_date:formattedDate,driver_assign_status:'3'},{new:true});
        await Asign_Diver.findOneAndUpdate({orderId: orderId,userId:userId},{driver_status:'2'},{new:true});
        res.status(200).json({
          "result":"true",
          "message":"user order completed by driver"
        }); 
      }
    }
  }catch(error){
    console.log(error.message);
    res.status(400).json({
      "result":"false",
      "message":error.message
    });
  }
};

/*...................get_notification_list.................*/
const get_notification_list = async (req, res) => {
  try {
    const { driverId } = req.body;
    if (!driverId) {
      return res.status(400).json({ "result": "false", "message": "required parameter is driverId" });
    }
    const result = await Notification.find({ "driverId": driverId });
    if(result){
      const data = result.map(item => ({
        driverId: item.driverId,
        title: item.driver_title,
        notification: item.driver_notification,
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



//export module
module.exports={
  driver_login,
  Verifyotp,
  ResendOtp,
  updateProfile,
  getProfile,
  updateDriver,
  driverLogout,
  updatelatlong,
  get_order_list,
  Update_Order_Status,
  get_order_status,
  get_order_details,
  get_notification_list

};



