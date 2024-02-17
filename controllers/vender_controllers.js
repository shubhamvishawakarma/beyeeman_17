//import all models of admin panel here
const Vender=require("../models/vender_models"); 
const Category=require("../models/category_models"); 
const ShopBanner=require("../models/shop_banner");  
const Shopcategory=require("../models/shopcategory");  
const ShopProduct=require("../models/shopproduct_models");
const Driver=require("../models/driver_models");
const Order=require("../models/order_models"); 
const MasterProduct=require("../models/master_product_models");
const Cart=require("../models/add_cart");
const Asign_Diver=require("../models/asign_driver_models");
const loyaltyCartModel = require("../models/loyaltycart_models");
const Notification=require("../models/notification_models");
const User=require("../models/user_models");
const ContactUs=require("../models/contactus_models");
const Term=require("../models/term_condiction_models"); 
const Privacy=require("../models/privacy_policy_models"); 
const Address=require("../models/user_address_models"); 
const Faq=require("../models/faq_models"); 
const faqListModel = require("../models/faq_list_models");
const admin = require('firebase-admin'); 
const axios = require('axios');
  
    
// import modules here    
const mongoose=require("mongoose"); 
//const csv=require("csvtojson");   
const path=require("path"); 
const fs = require('fs'); 
const csv = require('csv-parser'); 

  
/*-------------------signup vender api------------------*/
const signupVender = async (req, res) => {
  try {
    const {mobile,shop_name,open_time,close_time,shop_address,latitude,longitude,o_time,c_time,addr,shop_no,area,legal_name,email}=req.body;
    if(!mobile || !shop_name || !open_time || !close_time || !shop_address || !latitude || !longitude){
      res.status(400).json({"result":"false","message":"require parameter are mobile,shop_name,open_time,close_time,shop_address,latitude,longitude, shop_image, o_time,c_time,addr, (optionals)shop_no,area,legal_name,email"});
    }else{
      //declear function
      function generateRandomText(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
        return result; 
      }
      const qrcode=generateRandomText(10)
      // Apply validation
      const validation = await Vender.findOne({mobile});
      const Images = req.files.map((file) => file.filename);
      if(!validation){
        const insertData = new Vender({
          mobile,
          shop_name,
          open_time,
          qr_code:qrcode,
          close_time,
          shop_address,
          shop_image: Images,
          o_time,
          c_time, 
          addr,
          shop_no,
          area,
          legal_name,
          email,
          geo_location: {
          type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        }); 
        await insertData.save();
        return res.status(200).json({
          "result": "true",
          "message": "Insert data successfully",
          "path": "http://103.104.74.215:3026/uploads/",
          data: insertData,
        });
      }else{
        res.status(400).json({"result":"false","message":"Vendor already registered. Please go to the login page."});
      }
    }
  }catch (error) {
    return res.status(400).json({
      "result": "false", 
      "message": error.message,
    });
  }   
}; 

/*.........................signup vender api2.............*/
const signupVender2 = async (req, res) => {
  try {
    const {mobile,min_order,delivery_charge,categoryId,fssai_no,max_distance,flat_delivery_charge}=req.body;
    if(!mobile || !min_order || !delivery_charge || !categoryId || !fssai_no || !max_distance || !flat_delivery_charge){
      res.status(400).json({"result":"false","message":"require parameter are mobile, delivery_charge,shop_image,min_order,categoryId,shop_image,fssai_no, max_distance & flat_delivery_charge"});
    }else{
      // Apply validation
      const validation = await Vender.findOne({mobile});
      const Images = req.files.map((file) => file.filename);
      const categoryID = categoryId.split(',').map(item => item.trim());
      if (validation.shop_status === 0) {
        validation.shop_image.push(...Images);
        await validation.save();
        const first = await Vender.findOneAndUpdate(
          { mobile },
          {delivery_charge,min_order,shop_status: 1,categoryId:categoryID,fssai_no,max_distance,flat_delivery_charge},
          { new: true }
        );
        return res.status(200).json({
          "result": "true",
          "message": "Data insert successfully",
          "path": "http://103.104.74.215:3026/uploads/",
          data: first,
        });
      }else{
        res.status(400).json({"result":"false","message":"mobile number does not exist"});
      }
    }
  }catch (error) {
    console.log(error.message) 
    return res.status(400).json({
      "result": "false",
      "message": error.message,
    });
  } 
};

/*.........................signup vender api3.............*/
const signupVender3 = async (req, res) => {
 try {
    const {mobile,manager_name,acc_no,ifsc_code,bank_name}=req.body;
    if(!mobile || !manager_name || !acc_no || !ifsc_code || !bank_name){
      res.status(400).json({"result":"false","message":"require parameter are mobile,manager_name,acc_no,ifsc_code, bank_name & shop_image"});
    }else{
      // Apply validation
      const validation = await Vender.findOne({mobile});
      const Images = req.files.map((file) => file.filename);
      if(validation.shop_status === 1) {
        validation.shop_image.push(...Images);
        await validation.save();
        const second = await Vender.findOneAndUpdate(
          { mobile },
          { manager_name,acc_no,ifsc_code,bank_name,shop_status: 2 },
          { new: true }
        );
        return res.status(200).json({
          "result": "true",
          "message": "Data insert successfully",
          "path": "http://103.104.74.215:3026/uploads/",
          data: second,
        });
      }else{
        res.status(400).json({"result":"false","message":"mobile number is not exist"});
      }
    }
  }catch (error) {
    return res.status(400).json({
      "result": "false",
      "message": error.message,
    });
  } 
};


/*.........................signup vender api4.............*/
const signupVender4 = async (req, res) => {
  try {
    const {mobile,gst_no}=req.body;
    if(!mobile || !gst_no){
      res.status(400).json({"result":"false","message":"require parameter is mobile,gst_no & shop_image"})
    }else{
      const validation = await Vender.findOne({mobile});
      const Images = req.files.map((file) => file.filename);
      if (validation.shop_status === 2) {
        validation.shop_image.push(...Images);
        await validation.save();
        const third = await Vender.findOneAndUpdate(
          { mobile },
          { gst_no,shop_status: 3 },
          { new: true }
        );
        return res.status(200).json({
          "result": "true",
          "message": "User registered successfully",
          "path": "http://103.104.74.215:3026/uploads/",
          data: third,
        });
      }else{
        return res.status(400).json({
        "result": "false",
        "message": "Vendor already registered. Please go to the login page.",
        });
      } 

    } 
  }catch (error) { 
    return res.status(400).json({
      "result": "false",
      "message": error.message,
    });
  }
}; 

/*........................vender login api...............*/
const venderLogin_One=async(req,res)=>{
  try{
    const Otp=Math.floor(1000 + Math.random() * 9000);
    const {mobile,fcm}=req.body;
    if(!mobile || !fcm){
      res.status(400).json({"result":"false","message":"require parameter are mobile,fcm"});
    }else{
      const vender = await Vender.findOne({mobile:mobile,shop_status:3,approve_status:1});
      if(vender){
        const data=await Vender.findOneAndUpdate({mobile},{fcm_id:fcm,otp:Otp},{new:true});
        res.status(200).json({"result":"true","message":"Vender login successfully",data:data});
      }else{
        res.status(400).json({"result":"false","message":"You mobile number is wrong or not approve by Admin"});
      }
    }
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
}; 

/*........................vender login api...............*/
const venderLogin=async(req,res)=>{
  try{
    const Otp=Math.floor(1000 + Math.random() * 9000);
    const {mobile,fcm}=req.body;
    if(!mobile || !fcm){
      res.status(400).json({"result":"false","message":"require parameter are mobile,fcm"});
    }else{
      const vender = await Vender.findOne({mobile:mobile});
      if(!vender){
        res.status(400).json({"result":"false","message":"mobile_no does not exist"});
        
      }else{
          const result = await Vender.findOne({mobile:mobile,shop_status:3,approve_status:1});
        if(result){
            const message = 'Your OTP is: {{Otp}}';
            const route = 'Otp';
            const url = `https://www.fast2sms.com/dev/bulkV2?authorization=A3ndvI0uNgetJ7FWRyhpEQ4xYk2Go5ja6wXmBOHL8SZz91PcKrPgz3lScCdDNn59HW62ZLohum0iYx74&route=otp&variables_values=${Otp}&flash=0&numbers=${mobile}`;
            const response = await axios.get(url);
            const data=await Vender.findOneAndUpdate({mobile},{fcm_id:fcm,otp:Otp},{new:true});
            res.status(200).json({"result":"true","message":"vender login successfully",data:data});
        }else{
          res.status(400).json({"result":"false","message":"mobile_no does not approve by Admin"});
        }
      }
    }
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};

/*-------------------verify otp api---------------------*/
const Verifyotp = async (req, res) => {
  try{
    const {mobile,otp} = req.body;
    if(otp && mobile) {
      const data =await Vender.findOne({mobile,otp});
      if (data) {
        res.status(200).json({
          "result": "true",
          "message": "user login secussfully",
          data
        })
      } else {
        return res.status(400).json({
          "result": "false",
          "message": "Invalid mobile or OTP",
        });
      }
    }else{
      res.status(400).json({
        "result": "false",
        "message": "required parameters are mobile and otp",
      });
    }
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};
 

 
/*--------------------resend otp api--------------------*/
const ResendOtp = async (req, res) => {
  const { mobile, fcm } = req.body;
  if ( !mobile || !fcm) {
    res.status(400).json({
      "result": "false",
      "message": "required parameters are mobile and fcm",
    });
  }else{
    var otp = Math.floor(1000 + Math.random() * 9000);
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=A3ndvI0uNgetJ7FWRyhpEQ4xYk2Go5ja6wXmBOHL8SZz91PcKrPgz3lScCdDNn59HW62ZLohum0iYx74&route=otp&variables_values=${encodeURIComponent(otp)}&flash=0&numbers=${encodeURIComponent(mobile)}`;
    const response = await axios.get(url);
    const update_data = await Vender.findOneAndUpdate({mobile},{$set:{otp:otp,fcm_id:fcm}},{new:true});
    const data=await update_data.save();
    res.status(200).json({
      "result": "true",
      "message": "otp sent sucessfully",
      data:data
    });
  }
};

/*................Category list api.............*/
const category_list=async(req,res)=>{
  try{
    const data=await Category.find({c_status:0});
    if(data.length>0){
      const result=data.map(item=>({
        categoryId:item._id,
        category_name:item.category_name
      }));
      res.status(200).json({"result":"true","message":"category list are",data:result});
    }else{
      res.status(400).json({"result":"false","message":"data does not found"})
    }
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};

/*................Category list api by shopId.............*/
const get_category_list=async(req,res)=>{
  const { shopId } = req.body;
  try{
    if(shopId){
    const vender = await Vender.findById({_id:shopId});


    const categoryId = vender.categoryId;
    console.log(categoryId)
    const result =await Category.find({_id:categoryId});
    console.log(result)
    if(result){
      const result1=result.map(item=>({
        categoryId:item._id,
        category_name:item.category_name
      }));
      res.status(200).json({"result":"true","message":"category list are",data:result1});
    }else{
      res.status(400).json({"result":"false","message":"data does not found"})
    }
  }else{
     res.status(400).json({"result":"false","message":"parameter required shopId"})
  }
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};

/*............get qrcode................*/

/*.................qr codes....................*/
const getQrcode = async (req, res) => {
  const { shopId } = req.body;
  try {
    if(!shopId){
      return res.status(400).json({ "result": "false", "message": "Required parameter is shopId" });
    }else{
      const shopData = await Vender.findById({ _id: shopId });
      const qrCode = shopData.qr_code;
      const shopIdResponse = shopData._id;
      const shop = shopData.shop_name;
      res.status(200).json({ "result": "true", "message": "QR code retrieved successfully", data:{ qr_code: qrCode, _id: shopIdResponse,shop_name:shop }});
    }
  }catch(err){
    res.status(500).json({ "result": "false", "message": err.message });
  }
};

/*.....................create shop banner.............*/
const createShopBanner_One = async (req, res) => {
  try {
    const { shopId } = req.body;
   // const {shopbanner,shoppdf} = req.files;

    if (!shopId) {
      return res.status(400).json({
        result: false,
        message: 'Required parameters: shopId, shopbanner'
      });
    }
    const result = await ShopBanner.findOne({shopId:shopId})
    if(!result){ 
    const Images = req.files.map((file) => file.filename);
    // const Pdf = shoppdf.map((file) => file.filename);
    //const Pdf = shoppdf ? shoppdf.map((file) => file.filename) : [];
    const newShopBanner = new ShopBanner({
      shopId,
      shopbanner: Images,
      banner_status: Images.map(() => '1'),
      //shoppdf:Pdf,
    });
    const savedShopBanner = await newShopBanner.save();
    res.status(200).json({
      "result": "true",
      "message": 'Data inserted successfully',
      data: savedShopBanner
    });
  }else{
    const Images = req.files.map((file) => file.filename);
     const updatedUserData = await ShopBanner.findOneAndUpdate(
        { shopId: shopId },
        { $set:{shopbanner:Images,banner_status: Images.map(() => '1')}},
        { new: true }
      );
      res.status(200).json({
        result: 'true',
        msg: 'shop banner update successfully..',
        data: updatedUserData, // Optionally, send the updated user data back in the response
    });
  }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};


/*.....................create shop banner.............*/
const createShopBanner = async (req, res) => {
  try {
    const { shopId } = req.body;
    if (!shopId) {
      return res.status(400).json({
        result: false,
        message: 'Required parameters: shopId, shopbanner'
      });
    }
    const existingShopBanner = await ShopBanner.findOne({ shopId: shopId });
    if (!existingShopBanner) {
      
      const Images = req.files.map((file) => file.filename);
      const newShopBanner = new ShopBanner({
        shopId,
        shopbanner: Array(6).fill(null).map((_, index) => Images[index] || null),
        shoppdf: Array(6).fill(null),
        banner_status: Array(6).fill('0').map((_, index) => (Images[index] ? '1' : '0'))
      });

      const savedShopBanner = await newShopBanner.save();
      res.status(200).json({
        result: 'true',
        message: 'shop banner inserted successfully',
        data: savedShopBanner
      });
    } else {
  
      const newImages = req.files.map((file) => file.filename);

      if (existingShopBanner.shopbanner.length === 6) {
        
        for (let i = 0; i < newImages.length; i++) {
          if (newImages[i]) {
            result.shopbanner[i] = newImages[i];
          }
        }

        const updatedUserData = await result.save();
        res.status(200).json({
          result: 'true',
          msg: 'shop banner replaced successfully',
          data: updatedUserData, 
        });
      } else {
    
        const updatedUserData = await ShopBanner.findOneAndUpdate(
          { shopId: shopId },
          { $push: { shopbanner: { $each: newImages }, banner_status: { $each: newImages.map(() => '1') } } },
          { new: true }
        );
        res.status(200).json({
          result: 'true',
          msg: 'shop banner updated successfully',
          data: updatedUserData, 
        });
      }
    }  
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};


/*.....................create AddShopPdf.............*/
const AddShopPdf = async (req, res) => {
  try {
    const { shopId, index } = req.body;

    if (!shopId || index === undefined) {
      return res.status(400).json({
        result: false,
        message: 'Required parameters: shopId, index, shoppdf'
      });
    }

    const result = await ShopBanner.findOne({ shopId: shopId });

    if (!result) {
      res.status(400).json({
        result: "false",
        message: 'shopId does not exist',
      });
    } else {
      const Images = req.files.map((file) => file.filename);

      const existingShopPdf = result.shoppdf || [];
      const updatedShopPdf = existingShopPdf.slice();

      // Insert the file name at the specified index
      if (index >= 0 && index < updatedShopPdf.length) {
        updatedShopPdf[index] = Images[0]; // Assuming only one file is uploaded
      } else {
        return res.status(400).json({
          result: false,
          message: 'Invalid index provided',
        });
      }

      const updatedUserData = await ShopBanner.findOneAndUpdate(
        { shopId: shopId },
        { $set: { shoppdf: updatedShopPdf } },
        { new: true }
      );

      res.status(200).json({
        result: 'true',
        msg: `shop pdf update ${index} index successfully..`,
        data: updatedUserData,
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};



const updateShopBannerStatus = async (req, res) => {
  try {
    const { shopId, selectedIndex, banner_status } = req.body;

    if (!shopId || selectedIndex === undefined || selectedIndex < 0 || banner_status === undefined) {
      return res.status(400).json({
        result: false,
        message: 'Required parameters: shopId, selectedIndex (shop_banner Array index), banner_status (0 or 1)'
      });
    }

    const result = await ShopBanner.findOne({ shopId: shopId });

    if (!result) {
      return res.status(404).json({
        result: false,
        message: 'Shop banner not found for the given shopId'
      });
    }

    // Validate that banner_status is either 0 or 1
    if (banner_status !== '0' && banner_status !== '1') {
      return res.status(400).json({
        result: false,
        message: 'Invalid value for banner_status. It should be either 0 or 1.'
      });
    }

    // Update the banner_status at the specified index
    const updatedUserData = await ShopBanner.findOneAndUpdate(
      { shopId: shopId },
      {
        $set: {
          [`banner_status.${selectedIndex}`]: banner_status
        }
      },
      { new: true }
    );

    res.status(200).json({
      result: true,
      msg: `Shop banner status at index ${selectedIndex} updated to ${banner_status} successfully.`,
      data: updatedUserData
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};





/*................get shop banner data................*/
 const getShopBanner= async(req,res)=>{
    try{
        const { shopId }=req.body;
        if(shopId){  
            const shop_data= await ShopBanner.findOne({shopId:shopId});
            if(shop_data){
                res.status(200).json({
                    result:'true',
                    msg:'shop banner data get successfully..',
                    data:shop_data
                });
            }else{
                res.status(400).json({
                    result:'false', 
                    msg: 'record not found..',
                })
            }
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required shopId..'
            })
        }
    }catch(error){
        console.log(error.message);
    }
};

/*................create shopcategory................*/
const shopcategory=async(req,res)=>{
  try{
    const {shop_id,category_image,shopcategory_name}=req.body;
    if(!shop_id || !shopcategory_name || !req.file){
      res.status(400).json({'result':"false","message":"require parameter are shop_id,category_image,shopcategory_name"});
    }else{
      const data= new Shopcategory({shop_id,category_image:req.file.filename,shopcategory_name});
      await data.save();
      res.status(200).json({"result":'true',"message":"data insert successfully",data:data});
    }
  }catch(error){
    res.status(400).json({"result":"false","message":error.message})
  }
};

/*.................shopcategory_list api..............*/
const shopcategory_list = async (req, res) => {
  try {
    const { categoryId} = req.body;
    if (!categoryId) {
      res.status(400).json({ 'result': 'false', 'message': 'required parameter is categoryId' });
    }else{
      const data = await Shopcategory.find({categoryId: categoryId });
      const categories=data.map(item=>({
        subcategory:item.subcategory
      }));
        res.status(200).json({ "result": 'true', "message": "shop category list", data:categories});
      }   
  }catch(error){
    res.status(400).json({ "result": "false", "message": error.message });
  }
}; 

/*-------------------create shop product-----------------*/
const create_product=async(req,res)=>{
  try{
    const {shopId,category,subcategory,products_name,brand_name,barcodes,variants,mrp_price,sale_price,discount,description,images,gst}=req.body;
    if(!shopId || !category || !products_name || !brand_name || !barcodes || !mrp_price || !sale_price){
      res.status(400).json({"result":"false","message":"require parameter are shopId,category,products_name,brand_name,barcodes,variants,mrp_price,sale_price,description,images,gst"});
    }else{
      const validation=await ShopProduct.findOne({shopId,products_name,variants});
      if(validation){
        res.status(400).json({"result":"false","message":"data already exist"})
      }else{
        //array image
        const Image=[];
        for (var i = 0; i <req.files.length; i++) {
          Image[i]=req.files[i].filename;
        }
        const barcodeArray = barcodes.split(',').map(code => code.trim());
        const dic=Number(mrp_price - sale_price);
        const percantage=Math.round(dic*100/mrp_price);
        const product=new ShopProduct({shopId,category,subcategory,products_name,brand_name,barcodes:barcodeArray,variants,mrp_price,sale_price,discount:percantage,description,gst,images:Image});
        const data=await product.save();
        res.status(200).json({"result":"true","message":"data insert successfully",data:data});
      }
    }
  }catch(err){
    console.log(err.message); 
      res.status(400).json({"result":"false","message":err.message});
  }
};


/*-------------------create shop master product-----------------*/
const create_master_product=async(req,res)=>{
  try{
    const {shopId,category,subcategory,products_name,brand_name,barcodes,variants,mrp_price,sale_price,description,images,gst}=req.body;
    if(!shopId || !category ||!subcategory || !products_name || !brand_name || !barcodes || !variants || !mrp_price || !sale_price){
      res.status(400).json({"result":"false","message":"require parameter are shopId,category,products_name,brand_name,barcodes,variants,mrp_price,sale_price,description,images,gst"});
    }else{
      const validation=await ShopProduct.findOne({shopId,products_name,variants});
      if(validation){
        res.status(400).json({"result":"false","message":"data already exist"})
      }else{
        //array image
        // const Image=[];
        // for (var i = 0; i <req.files.length; i++) {
        //   Image[i]=req.files[i].filename;
        // }
        const barcodeArray = barcodes.split(',').map(code => code.trim());
        const dic=Number(mrp_price - sale_price);
        const percantage=Math.round(dic*100/mrp_price);
        const product=new ShopProduct({shopId,category,subcategory,products_name,brand_name,barcodes:barcodeArray,variants,mrp_price,sale_price,discount:percantage,description,gst,images:images});
        const data=await product.save();
        res.status(200).json({"result":"true","message":"data insert successfully",data:data});
      }
    }
  }catch(err){
    console.log(err.message); 
      res.status(400).json({"result":"false","message":err.message});
  }
};

/*.............upload shopProduct through csv file.......*/
const uploadCsv_file_one = async (req, res) => {
  console.log(req.file)
  try {
    if(!req.file){
      res.status(400).json({"result":"false","message":"require parameter is images"});
    }else{
      const data = await new Promise((resolve, reject) => {
      const data = [];
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
          data.push(row); 
        })
        .on('end', () => {
          resolve(data);
        })
        .on('error', (err) => {
          reject(err);
        });
      });
      const productNames = data.map((product) => product.products_name);
      const variantNames = data.map((product) => product.variants);
      const shopnames = data.map((product) => product.shopId);
      const existingdata = await ShopProduct.find({
        products_name: { $in: productNames },
        variants: { $in: variantNames },
        shopId: { $in: shopnames },
      });
    if (existingdata.length > 0) {
        return res.status(400).json({ result: 'false', message: 'Product already exists' });
        } else {
          const processedData = data.map((product) => {
            //const imagesArray = product.images.split(',');
            const imagesArray = product.images ? product.images.split(',') : [];
            const { images, ...productData } = product;
            return { ...productData, images: imagesArray };
          });
    
          await ShopProduct.insertMany(processedData);
          return res.status(200).json({ result: 'true', message: 'Data inserted successfully' });
        }
      }
  } catch (err) {
    return res.status(400).json({ result: 'false', message: err.message });
  }
};


const readImage = async (imagePath) => {
  return fs.promises.readFile(imagePath);
};

/*.............upload shopProduct through csv file.......*/
const uploadCsv_file = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ result: 'false', message: 'CSV file is required.' });
    }

    const csvData = await new Promise((resolve, reject) => {
      const data = [];
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', () => {
          resolve(data);
        })
        .on('error', (err) => {
          reject(err);
        });
    });

    const productNames = csvData.map((product) => product.product_name);
    const variantNames = csvData.map((product) => product.variants);
    const shopnames = csvData.map((product) => product.shopId);

    console.log('Product Names:', productNames);
    console.log('Variant Names:', variantNames);
    console.log('Shop Names:', shopnames);

    const existingData = await ShopProduct.find({
      product_name: { $in: productNames },
      variants: { $in: variantNames },
      shopId: { $in: shopnames },
    });

    console.log('Existing Data:', existingData);

    if (existingData.length > 0) {
      return res.status(400).json({ result: 'false', message: 'Product already exists.' });
    }
    const processedData = await Promise.all(
      csvData.map(async (product) => {
        const imagesArray = [];
        if (product.image) {
          const imagePath = product.image;
          const imageName = path.basename(imagePath);
          const imageBuffer = await readImage(imagePath);
          fs.writeFileSync(path.join('uploads/', imageName), imageBuffer);
          imagesArray.push(imageName); // Save image name in the array
        }

        const { image, ...productData } = product;
        return { ...productData, images: imagesArray };
      })
    );

    await ShopProduct.insertMany(processedData);

    // Cleanup: Delete the uploaded CSV file
    fs.unlinkSync(req.file.path);

    return res.status(200).json({ result: 'true', message: 'Data and images inserted successfully.', data: processedData });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ result: 'false', message: err.message });
  }
}

 
/*...............getVenderProfile............*/
const getVenderProfile=async(req,res)=>{
  const {shopId}=req.body;
  if(!shopId){
    res.status(400).json({"result":"false","message":"require parameter is shopId"});
  }else{
    const data=await Vender.findById({_id : shopId});
    res.status(200).json({"result":"true","message":"get profile list is",data:data});
  }

};


/*..........shop product_list..............*/
const ShopProduct_list=async(req,res)=>{
  try{
    const {shopId,category_name}=req.body;
    if(!shopId || !category_name){
      res.status(400).json({"result":"false","message":"require parameter are shopId,category_name"});
    }else{
      const data=await ShopProduct.find({"shopId": shopId,category: category_name});
      const filterData=data.map(item=>({
        productId:item._id,
        shopId:item.shopId,
        products_name:item.products_name,
        variants:item.variants,
        barcodes:item.barcodes,
        image:item.images,
        mrp_price:item.mrp_price,
        price:item.sale_price,
        gst:item.gst,
        stock_status:item.stock_status,
        act_status:item.act_status,
        barcodes:item.barcodes
      }))
      res.status(200).json({"result":"true","message":"product list are",data:filterData})
    }

  }catch(err){
    res.status(400).json({"result":"false","message":err.message})
  }

};





/*.................category_lisr.............*/
const shopCategory_list = async (req, res) => {
  const { shopId } = req.body;
  if (!shopId) {
    return res.status(400).json({ "result": "false", "message": "Required parameter is shopId" });
  }

  try {
    const vendor = await Vender.findOne({ _id: shopId });
    if (!vendor) {
      return res.status(404).json({ "result": "false", "message": "Shop not found" });
    }

    const categories = await Category.find({ _id: vendor.categoryId });

    const productsByCategory = await Promise.all(
      categories.map(async (category) => {
        const categoryName = category.category_name;
        const imageUrls = category.image; // Join the image URLs into a single string
        const productsCount = await ShopProduct.countDocuments({ shopId: shopId, category: categoryName });
        return { category: categoryName, image: imageUrls, products: productsCount };
      })
    );

    res.status(200).json({ "result": "true", "message": "Category list with products", data: productsByCategory });
  } catch (err) {
    res.status(500).json({ "result": "false", "message": err.message });
  }
};


/*................shopName update api.............*/
const updateShop=async(req,res)=>{
  try{
  const {shopId,shop_name}=req.body;
  if(!shopId){
    es.status(400).json({"result":"false","message":"required parameter are shopId and shop_name "});

  }else{
    const data=await Vender.findOneAndUpdate({_id: shopId},{shop_name},{new:true});
    res.status(200).json({"result":"true","message":"data updated successfully"});

  }

}catch(error){
  res.status(400).json({"result":"false","message":error.message});
}
};



/*................vender logout................*/
const venderLogout=async(req,res)=>{
        try{
        const {shopId}=req.body;
        if(!shopId){
                res.status(400).json({"result":"false","message":"required parameter are shopId "});
        }else{
          const data=await Vender.findOneAndUpdate({_id: shopId},{fcm_id:""},{new:true});
          const fcm=data.fcm_id;
          res.status(200).json({"result":"true","message":"logout successfully",data:{fcm}});

        }
 }catch(error){
        res.status(200).json({"result":"false","message":error.message});
 }
};


/*.............vender status api...............*/
const shopOpen_close=async(req,res)=>{
  try{
        const {shopId}=req.body;
        if(!shopId){
          res.status(400).json({"result":"false","message":"required parameter are shopId "});
        }else{
          const dinu=await Vender.findOne({_id: shopId,act_status:0});
          if(dinu){
            const data=await Vender.findByIdAndUpdate({_id: shopId,act_status:0},{act_status:1},{new:true});
              res.status(200).json({"result":"true","message":"shop close successfully"});
          }else{
            const datas=await Vender.findByIdAndUpdate({_id: shopId,act_status:1},{act_status:0},{new:true});
              res.status(200).json({"result":"true","message":"shop open successfully"});
          }         
        }
 }catch(error){
        res.status(200).json({"result":"false","message":error.message});
 }
};



/*.............get status api...........*/
const getStatus=async(req,res)=>{
    try{
        const {shopId}=req.body;
        if(!shopId){
                res.status(400).json({"result":"false","message":"required parameter are shopId "});
        }else{
        const data=await Vender.findById({_id: shopId});
        const status=data.act_status;
        res.status(200).json({"result":"true","message":"get status successfully",data:{status}});

        }
 }catch(error){
        res.status(200).json({"result":"false","message":error.message});
 }

};


/*.................stock_status..............*/
const shopStock = async (req, res) => {
  try {
    const { shopId, productId } = req.body;

    if (!shopId || !productId) {
      res.status(400).json({ "result": "false", "message": "Required parameters are shopId and productId" });
    } else {
      const product = await ShopProduct.findOne({ shopId, _id: productId });

      if (product) {
        if (product.stock_status === 0) {
          // Toggle the stock status from 0 to 1 (or vice versa)
          product.stock_status = 1;
          await product.save();
          res.status(200).json({ "result": "true", "message": "Product turned off successfully" });
        } else {
          product.stock_status = 0;
          await product.save();
          res.status(200).json({ "result": "true", "message": "Product turned on successfully" });
        }
      } else {
        res.status(404).json({ "result": "false", "message": "Product not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ "result": "false", "message": error.message });
}
};






 
/*........................insert driver api............*/
const driver_one = async (req, res) => {
  try {
    const { shopId, driver_name, mob } = req.body;
    const  image  = req.file;
    if (!shopId || !driver_name || !mob) {
      res.status(400).json({ "result": "false", "message": "required parameters are shopId, driver_name, mob & (optional parameters) image" });
    } else {
      const newDriver = new DriverModel({ 
        shopId,
        driver_name,
        mob,
        image: image.filename,
        active_status: 1,
      });

      const savedDriver = await newDriver.save();
      res.status(200).json({ "result": "true", "message": "data inserted successfully", data: savedDriver });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ "message": err.message });
  }
};

const driver = async (req, res) => {
  try {
    const { shopId, driver_name, mob } = req.body;
    const image = req.file;

    if (!shopId || !driver_name || !mob) {
      res.status(400).json({
        result: "false",
        message: "Required parameters are shopId, driver_name, mob & (optional parameters) image",
      });
    } else {
      const newDriverData = {
        shopId,
        driver_name,
        mob,
        active_status: 1,
      };

      // Check if req.file exists before assigning it to the newDriverData object
      if (image) {
        newDriverData.image = image.filename;
      }

      const newDriver = new DriverModel(newDriverData);

      const savedDriver = await newDriver.save();
      res.status(200).json({
        result: "true",
        message: "Data inserted successfully",
        data: savedDriver,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


//create delete driver api 
const delete_driver= async(req,res)=>{
  try{
    const { driver_id }=req.body;
      if(driver_id){  
        const driver_data= await Driver.findByIdAndDelete({_id:driver_id});
        if(driver_data){
          res.status(200).json({
            result:'true',
            msg:'driver data deleted successfully..'
          });
        }else{
          res.status(400).json({
            result:'false', 
            msg: 'record not found..',
          })
        }
      }else{
        res.status(400).json({
          result:'false',
          msg:'parameter required driver_id..'
        })
      }
  }catch(error){
    console.log(error.message);
  }
};

//create driver status update api  
 const update_active_status = async(req,res)=>{
    try{
        const { driver_id,status }=req.body;
        
        if(driver_id){
            const driver_data= await Driver.findById({_id:driver_id});
           
            if(driver_data){
                const updateFields = {}; // Create an object to store the fields to be updated
                
                if (status) {
                    updateFields.active_status = status;
                }

                // Use $set to update only the specified fields
                const updatedDriverData = await Driver.findOneAndUpdate(
                    { _id: driver_id },
                    { $set: updateFields },
                    { new: true }
                );

                res.status(200).json({
                    result: 'true',
                    msg: 'driver status update successfully..',
                    active_status:updatedDriverData.active_status
                    //data: updatedUserData, // Optionally, send the updated user data back in the response
                });   
            }else{
               res.status(400).json({
                     result:'false', 
                    msg: 'record not found..',
                })
            }
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required driver_id & status(enable=1,disable=0)..'
            })
        }
    }catch(error){
        console.log(error.message);
    }
}; 


/*...................driver list.............*/
const driver_list=async(req,res)=>{
  try {
    const {shopId}=req.body;
    if(!shopId){
      res.status(400).json({"result":"false","message":"required parameters are shopId,"})
    }else{
      const driver =await Driver.find({shopId});
      const data=driver.map(item=>({
        image:item.image,
        name:item.driver_name,
        phone:item.mob,
        rating:item.av_rating,
        driverId:item._id,
      }))
    res.status(200).json({"result":"true","message":"driver successfully",data:data});
    }
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating a new driver' });
  }
};

/*...................product data update.............*/
 const update_product= async(req,res)=>{
    try{
        const { productId,mrp_price,sale_price,description,images }=req.body;
        
        if(productId){
            const shop_data= await ShopProduct.findOne({_id:productId});
             
            const dic=Number(mrp_price - sale_price);
            const percantage=Math.round(dic*100/mrp_price);
            if(shop_data){
                const updateFields = {}; // Create an object to store the fields to be updated
                
        
                if (mrp_price) {
                    updateFields.mrp_price = mrp_price;
                }

                if (sale_price) {
                    updateFields.sale_price = sale_price;
                }

                if (percantage) {
                    updateFields.discount = percantage;
                }

                if (description) {
                    updateFields.description = description;
                }
 
                if (images) {
                  //array image
                  const Image=[];
                  for (var i = 0; i <req.files.length; i++) {
                    Image[i]=req.files[i].filename;
                  }
                  updateFields.images = Image;
                }

               
                // Use $set to update only the specified fields
                const updatedUserData = await ShopProduct.findOneAndUpdate(
                    { _id: productId },
                    { $set: updateFields},
                    { new: true }
                );

                res.status(200).json({
                    result: 'true',
                    msg: 'product data update successfully..',
                    //data: updatedUserData, // Optionally, send the updated user data back in the response
                });
                
            }else{
               res.status(400).json({
                     result:'false', 
                    msg: 'record not found..',
                })
            }
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required productId, (optional parameter) mrp_price,sale_price,description & images..'
            })
        }
    }catch(error){
        console.log(error.message);
    }
};

/*...................product data delete.............*/
 const product_delete_one= async(req,res)=>{
    try{
        const { productId,shopId }=req.body;
        if(productId && shopId){ 

            const product_data= await ShopProduct.findOneAndDelete({_id:productId,shopId:shopId});
            //const cart_data= await Cart.findOneAndDelete({'products.shopId':shopId,'products.productId':productId});
            //const str_data= await Cart.find({'products.shopId':shopId});

            // const result = await Cart.updateOne(
            //     { "_id": cart_id, "user_id": user_id,  },
            //     { $pull: { "products": { "productId": productId,"shopId": shopId } } }
            // );
            if(product_data){
                res.status(200).json({
                    result:'true',
                    msg:'product data deleted successfully..'
                });
            }else{
                res.status(400).json({
                    result:'false', 
                    msg: 'record not found..',
                })
            }
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required productId & shopId..'
            })
        }
    }catch(error){
        console.log(error.message);
    }
};


/*...................product data delete.............*/
const product_delete = async (req, res) => {
    try {
        const { productId, shopId } = req.body;
        if (productId && shopId) {

            // Delete the product from the ShopProduct collection
            const product_data = await ShopProduct.findOneAndDelete({ _id: productId, shopId: shopId });

            // Use $pull to remove the product from all carts
            const result = await Cart.updateMany(
                { "products.shopId": shopId, "products.productId": productId,"booking_status":0 },
                { $pull: { "products": { "productId": productId, "shopId": shopId } } }
            );

            if (product_data || result.length > 0) {
                res.status(200).json({
                    result: 'true',
                    msg: 'Product data and related cart items deleted successfully.'
                });
            } else if (product_data) {
                res.status(200).json({
                    result: 'true',
                    msg: 'Product data deleted successfully. No matching cart items found.'
                });
            } else {
                res.status(400).json({
                    result: 'false',
                    msg: 'Record not found.'
                });
            }
        } else {
            res.status(400).json({
                result: 'false',
                msg: 'Parameters required: productId & shopId.'
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            result: 'false',
            msg: error.message
        }); 
    } 
};


// create all order list api
const order_list=async(req,res)=>{
    try{   
        const result = await Order.find({'vender_status':'','vender_status':'accept'});
            if(result.length==0){
                res.status(400).json({
                     result: 'false',
                    msg: 'record not found..'
                })
            }else{
               res.status(200).json({
                    result: 'true',
                    msg: 'order get successfully..',
                    data:result
                })
            }   
    }catch(error){
        console.log(error.message);
    }
};  

/*..................productQr ..........*/
const productinsertToQr_one=async(req,res)=>{
  try {
    const {barcode, shopId}=req.body;
    if(!barcode || !shopId){
      res.status(400).json({"result":"false","message":"required parameters are barcode,shopId"})
    }else{
      const data =await MasterProduct.findOne({shopId:shopId,barcode});
      if(data){
        const br=data.barcode;
        const validation=await ShopProduct.findOne({barcodes: br});
        const category_name = validation.category;
        const result = await Category.findOne({category_name:category_name});
        const categoryId = result._id;
        console.log(categoryId)
        if(validation){
          res.status(400).json({"result":"true","message":"product already exist",categoryId:categoryId,data:validation});
      }else{
        const insertData=new ShopProduct({
        shopId,
        category:data.cat_name,
        products_name:data.product_name,
        barcodes:data.barcode,
        brand_name:data.brand,
        variants:data.variant,
        description:data.description,
        images:data.images,
        subcategory:data.subcategory,
      });
      const dinu=await insertData.save();
             res.status(200).json({"result":"true","message":"data insert successfully",data:dinu});
      }

      }else{
        res.status(400).json({"result":"true","message":"data not found"});
      }
     }
    } catch (err) {
    console.error(err);
    res.status(500).json({ "message": err.message });
  }

};

/*..................productQr ..........*/
const productinsertToQr=async(req,res)=>{
  try {
    const {barcode, shopId}=req.body;
    if(!barcode || !shopId){
      res.status(400).json({"result":"false","message":"required parameters are barcode,shopId"})
    }else{
      const validation=await ShopProduct.findOne({shopId:shopId,barcodes:barcode});
      const data =await MasterProduct.findOne({barcode});
      if(validation){
          const category = data.category_name;
          const result = await Category.findOne({category_name:category});
          const categoryId = result._id;
          res.status(400).json({
            "result":"true",
            "message":"product already exist",
            categoryId:categoryId,
            data:validation
          });
      }else if(data){
          const category_name_data = data.category_name;
          const result = await Category.findOne({category_name:category_name_data});
          const categoryId = result._id;
          res.status(200).json({
            "result":"true",
            "message":"master product data get successfully",
            categoryId:categoryId,
            data:data
          });
        }else{
          res.status(400).json({
            "result":"false",
            "message":"record not found",
          });
        }
     }
    } catch (err) {
    console.error(err);
    res.status(500).json({ "message": err.message });
  }
};

  

/*...................update product data.........l*/
const updateProductData=async(req,res)=>{
   try {
    const {shopId,productId,mrp,sale_price}=req.body;
    if(!productId || !shopId || !sale_price || !mrp){
      res.status(400).json({"result":"false","message":"required parameters are productId,mrp,sale_price,shopId"})
    }else{
      const tt= Number(mrp - sale_price);
      const dt=Number(tt/100);
      const data =await ShopProduct.findOneAndUpdate({shopId,_id: productId},{mrp_price:mrp,sale_price:sale_price,discount:dt},{ new: true });         
          res.status(200).json({"result":"true","message":"data updated successfully"});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ "message": err.message });
  }
};

const deleteBannerByIndex = async (req, res) => {
  try {
    const { shopId, index } = req.body; // index is the index of the banner to be deleted

    if (!shopId || index === undefined || index < 0) {
      return res.status(400).json({
        result: false,
        message: 'Required parameters: shopId, index (to delete)',
      });
    }

    const shopBanner = await ShopBanner.findOne({ shopId });

    if (!shopBanner || !shopBanner.shopbanner || !shopBanner.shopbanner[index]) {
      return res.status(404).json({
        result: false,
        message: 'Banner not found at the specified index for the given shopId',
      });
    }

    const updatedBanners = [...shopBanner.shopbanner];
    updatedBanners.splice(index, 1); // Remove the banner at the specified index

    const updatedBanners_Status = [...shopBanner.banner_status];
    updatedBanners_Status.splice(index, 1);

    const updatedShopBanner = await ShopBanner.findOneAndUpdate(
      { shopId },
      { $set: { shopbanner: updatedBanners, banner_status: updatedBanners_Status } },
      { new: true }
    );

    res.status(200).json({
      result: true,
      message: 'Banner deleted successfully',
      data: updatedShopBanner.shopbanner, // Return updated shopbanners array
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

/*......................search_product_list.................*/
const search_product_list_one = async (req, res) => {
  try {
    const { shopId,products_name} = req.body;
    if (!shopId || !products_name) {
      return res.status(400).json({ 'result': "false", "message": "required parameters are shopId & products_name" });
    }

    // Fetch all products for the shop
    const productData = await ShopProduct.find({"shopId":shopId,"products_name":{ $regex: products_name, $options: 'i' } });
    // Fetch unique product names for the shop
    //console.log(productData)
    if(productData && productData.length > 0){                                               

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
        variants: item.variants,
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


const search_product_list = async (req, res) => {
  try {
    const { shopId, products_name ,barcodes} = req.body;
    if (!shopId ) {
      return res.status(400).json({ 'result': "false", "message": "required parameters are shopId & products_name or barcodes" });
    }

    const conditions = { "shopId": shopId };
    if (products_name) {
         conditions["products_name"] = { $regex: products_name, $options: 'i' };
    }
    if (barcodes) {
       conditions["barcodes"] = { $regex: barcodes, $options: 'i' };
    }
   // const condition = { "shopId": { $regex: new RegExp(shopId, 'i') } };
    const productData = await ShopProduct.find(conditions);
  
    if (productData && productData.length > 0) {
      
      const dinu = productData.map((item, index) => {
        return {
          shop_productId: item._id,
          shop_name: item.shop_name,
          product_name: item.products_name,
          brand_name: item.brand_name,
          barcodes: item.barcodes,
          description: item.description,
          cart_status: item.cart_status,
          images: item.images,
          qty: item.qty,
          mrp_price: item.mrp_price,
          sale_price: item.sale_price,
          discount: item.discount,
          variants: item.variants,
        };
      });

      res.status(200).json({
        "result": "true",
        "message": "Unique shop product data list",
        "path": "http://103.104.74.215:3026/uploads/",
        data: dinu
      });

    } else {
      res.status(400).json({
        "result": "false",
        "message": "record not found",
      });
    }
  } catch (error) {
    res.status(500).json({ 'result': "false", "message": error.message });
  }
};

/*......................search_master_list.................*/
const search_master_list_one = async (req, res) => {
  try {
    const { shopId,products_name} = req.body;
    if (!shopId || !products_name) {
      return res.status(400).json({ 'result': "false", "message": "required parameters are shopId & products_name" });
    }

    // Fetch all products for the shop
    const productData = await MasterProduct.find({"shopId":shopId,"product_name":{ $regex: products_name, $options: 'i' } }).populate('shopId');
    // Fetch unique product names for the shop
    //console.log(productData)
    if(productData && productData.length > 0){                                               

    // Prepare the response data
    const dinu = productData.map((item, index) => {
      return {
        shop_productId: item._id,
        shop_name: item.shop_name,
        category:item.shopId.category,
        subcategory:item.shopId.subcategory,
        product_name: item.products_name, 
        brand_name: item.brand_name,
        barcode:item.barcode,
        description: item.description, 
        cart_status: item.cart_status, 
        images: item.images,
        qty:item.qty,
        mrp_price: item.mrp_price,
        sale_price: item.sale_price,
        discount: item.discount,
        variants: item.variants,
      };
    });
    
      res.status(200).json({
        "result": "true",
        "message": "Unique master product data list",
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

/*......................search_master_list.................*/
const search_master_list = async (req, res) => {
  try {
    const { products_name} = req.body;
    if ( !products_name) {
      return res.status(400).json({ 'result': "false", "message": "required parameters are products_name" });
    }

    // Fetch all products for the shop
    const data = await MasterProduct.findOne({"product_name":products_name });
   
    if(data){                                               

    const category_name_data = data.category_name;
    const result = await Category.findOne({category_name:category_name_data});
    const categoryId = result._id;
    res.status(200).json({
      "result":"true",
      "message":"data get successfully",
      categoryId:categoryId,
      data:data
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

//create shop order list api 
 const Shop_Order_List_One = async(req,res)=>{
    try{
        const { shopId }=req.body;

        if(shopId){
            var createdAt = {'createdAt': -1}
            const result = await Order.find({"shopId":shopId,$or: [
                { 'vender_status': " " },
                { 'vender_status': "accept" }
                ]
                }).populate({
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
                    address:item.address,
                    city:item.city,
                    pin_code:item.pin_code,
                    order_no:item.order_no,
                    grand_total:item.grand_total,
                    order_status:item.order_status,
                    vender_status:item.vender_status,
                    product_count:item.cartId.products.length,
                    order_date:item.order_date,
                    driver_assign_status:item.driver_assign_status,
                    products: item.cartId.products.map(product => ({
                        productId: product.productId._id,
                        product_name: product.productId.products_name,
                        product_image: product.productId.images[0],
                        variants:product.productId.variants
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
                msg:'parameter required shopId..'
            })
        }
    }catch(error){
        console.log(error.message);
    }
}

const Shop_Order_List = async (req, res) => {
    try {
        const { shopId } = req.body;
        if (shopId) {
            var createdAt = { 'createdAt': -1 }
            const result = await Order.find({
                "shopId": shopId, $or: [
                    { 'vender_status': " " },
                    { 'vender_status': "accept" }
                ]
            }).populate({
                path: 'cartId',
                populate: {
                    path: 'products.productId',
                },
            }).sort(createdAt);

            if (!result || result.length == 0) {
                res.status(400).json({
                    result: 'false',
                    msg: 'record not found..'
                });
            } else {

              const data = result.map((item, index) => {
              const myindex = result[index].cartId.products.length;

            if (myindex !== 0) {
              return {
                orderId: item._id,
                userId: item.userId,
                cartId: item.cartId._id,
                address: item.address,
                city: item.city,
                pin_code: item.pin_code,
                order_no: item.order_no,
                grand_total: item.grand_total,
                order_status: item.order_status,
                vender_status: item.vender_status,
                product_count: myindex,
                order_date: item.order_date,
                driver_assign_status: item.driver_assign_status,
                products: myindex > 0
                  ? item.cartId.products.map(product => ({
                  productId: product.productId ? product.productId._id : null,
                  product_name: product.productId ? product.productId.products_name : null,
                  variants: product.productId ? product.productId.variants : null
                }))
                : []
              };
            }
          });
          const filteredData = data.filter((item) => item );
       
        if (filteredData.length == 0) {
          res.status(400).json({ result: "false", msg: "product not found" })
        } else {
          res.status(200).json({
            result: 'true',
            msg: 'order list get successfully..',
            data: filteredData
          })
        }
          }
        } else {
            res.status(400).json({
              result: 'false',
              msg: 'parameter required shopId..'
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}


//create shop order list api 
 const Reject_Order_List = async(req,res)=>{
    try{
        const { shopId }=req.body;

        if(shopId){
            var createdAt = {'createdAt': -1}
            const result = await Order.find({"shopId":shopId,
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
                msg:'parameter required shopId..'
            })
        }
    }catch(error){
        console.log(error.message);
    }
}

/*................Update_Order_Status api.............*/
const Update_Order_Status=async(req,res)=>{
  try{
    const {orderId,userId,order_status,vender_status}=req.body;
    if(!orderId || !userId || !order_status || !vender_status){
      res.status(400).json({
        "result":"false",
        "message":"required parameter are orderId, userId, order_status & vender_status(accept or reject) "
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

      const data = await Order.findOneAndUpdate({_id: orderId,userId:userId},{order_status:order_status,vender_status:vender_status,in_progress_date:formattedDate},{new:true});
      res.status(200).json({
        "result":"true",
        "message":"order status update successfully"
      });
      const user_data = await User.findById({ _id: userId });
      console.log(user_data)
      var token = [user_data.fcm_id]
      var payload ={
          notification:{
          title: "Needoo Vender App",
          body: `Your Order ${data.order_no} is ${vender_status} By Vender.`
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
      const notification = new Notification({ userId,title:payload.notification.title,notification:payload.notification.body,date:formattedDate})
      await notification.save(); 
    }
  }catch(error){
    console.log(error.message);
    res.status(400).json({
      "result":"false",
      "message":error.message
    });
  }
};

/*...................vender data update.............*/
 const update_vender= async(req,res)=>{
    try{
        const { shopId,delivery_charge,max_distance,open_time,close_time,o_time,c_time,flat_delivery_charge,min_order }=req.body;
        
        if(shopId){
            const vender_data= await Vender.findOne({_id:shopId});
             
            if(vender_data){
                const updateFields = {}; // Create an object to store the fields to be updated
                
        
                if (delivery_charge) {
                    updateFields.delivery_charge = delivery_charge;
                }

                if (max_distance) {
                    updateFields.max_distance = max_distance;
                }

                if (open_time) {
                    updateFields.open_time = open_time;
                }

                if (close_time) {
                    updateFields.close_time = close_time;
                }

                if (o_time) {
                    updateFields.o_time = o_time;
                }

                if (c_time) {
                    updateFields.c_time = c_time;
                }

                if (flat_delivery_charge) {
                    updateFields.flat_delivery_charge = flat_delivery_charge;
                }

                if (min_order) {
                    updateFields.min_order = min_order;
                }

                // Use $set to update only the specified fields
                const updatedVenderData = await Vender.findOneAndUpdate(
                    { _id: shopId },
                    { $set: updateFields},
                    { new: true }
                );

                res.status(200).json({
                    result: 'true',
                    msg: 'vender data update successfully..',
                    //data: updatedVenderData, // Optionally, send the updated user data back in the response
                });
                
            }else{
               res.status(400).json({
                     result:'false', 
                    msg: 'record not found..',
                })
            }
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required shopId,(optionals parameter) delivery_charge, distance, open_time, close_time, o_time,c_time, flat_delivery_charge, min_order..'
            })
        }
    }catch(error){
        console.log(error.message);
    }
};

/*.........................asign_driver.............*/
const asign_driver = async (req, res) => {
  try {
    const {shopId,orderId,userId,driverId}=req.body;
    if(!shopId || !orderId || !userId || !driverId ){
      res.status(400).json({"result":"false","message":"require parameter are shopId, orderId,userId,driverId"});
    }else{
      // Apply validation
      const date = new Date();
      const option = { timeZone: 'Asia/Kolkata' };
      const day = date.getDate(); // Day of the month
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const month = monthNames[date.getMonth()]; // Month name
      const year = date.getFullYear(); // Year
      const hours = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Kolkata' }); // Time
      const formattedDate = `${day} ${month} ${year}, ${hours}`;


        const asign_driver_abc = new Asign_Diver({shopId,orderId,userId,driverId,driver_status:'0'});
        await asign_driver_abc.save();
        const updatedDriverStatus = await Order.findOneAndUpdate(
                    { _id: orderId },
                    { $set: {order_status:'Packed',asign_date:formattedDate,driver_assign_status:'1'}},
                    { new: true }
                );
        
        const user_data = await User.findById({ _id: userId });
        const driver_data = await Driver.findById({ _id: driverId });
        //console.log(user_data)
        //console.log(driver_data)
        var token = [user_data.fcm_id]
        var payload ={
            notification:{
            title: "Needoo Vender App",
            body: "your order asign driver successfully by vender"
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
        var token1 = [driver_data.fcm_id]
        var payload1 ={
            notification:{
            title: "Needoo Vender App",
            body: "your order asign driver successfully by vender"
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
        const notification = new Notification({ userId,orderId,driverId,title:payload.notification.title,driver_title:payload1.notification.title,notification:payload.notification.body,driver_notification:payload1.notification.body,date:formattedDate})
        await notification.save();
       return res.status(200).json({
          "result": "true",
          "message": "order assign successfully driver",
          data: asign_driver_abc
        });
    }
  }catch (error) {
    console.log(error) 
     res.status(400).json({
      "result": "false",
      "message": error.message,
    });
  } 
};

/////    create loyalty cart   /////
const loyaltyCart = async (req, res) => {
  try {
    const { shopId, title, point_per_rupees, value_of_one_point, mini_redeemable_points } = req.body
    if ( shopId && title && point_per_rupees && value_of_one_point && mini_redeemable_points) {
      const loyaltyCartData = new loyaltyCartModel({ shopId, title, point_per_rupees, value_of_one_point, mini_redeemable_points })
      const data = await loyaltyCartData.save()
      res.status(200).json({ result: "true", msg: "loyalty cart create successfull", data: data })
    } else {
      res.status(400).json({ result: "false", msg: "parameter require shopId, title,point_per_rupees, value_of_one_point, mini_redeemable_points" })
    }

  } catch (error) {
     console.log(error.message) 
    return res.status(400).json({
      "result": "false",
      "message": error.message,
    });
  }
}

/// get loyalty cart  ///
const getLoyaltyCart = async (req, res) => {
  try {
    const { shopId } = req.body
    if (shopId) {
      const loyaltyCart = await loyaltyCartModel.find({shopId:shopId})
      if (!loyaltyCart || loyaltyCart.length == 0) {
        res.status(400).json({ result: "false", msg: "record not found" })
      } else {
        res.status(200).json({ result: "true", msg: "loyalty cart data get success", data: loyaltyCart })
      }
    } else {
      res.status(400).send({ result: "false", msg: "parameter require user_id" })
    }

  } catch (error) {
    console.log(error.message)
  }
}

/*...................updateLoyaltyCart data update.............*/
 const updateLoyaltyCart= async(req,res)=>{
    try{
        const { loyaltyId, title, point_per_rupees, value_of_one_point, mini_redeemable_points }=req.body;
        
        if(loyaltyId){
            const loyaltyCart = await loyaltyCartModel.findById({ _id: loyaltyId })
             
            if(loyaltyCart){
                const updateFields = {}; // Create an object to store the fields to be updated
                
        
                if (title) {
                    updateFields.title = title;
                }

                if (point_per_rupees) {
                    updateFields.point_per_rupees = point_per_rupees;
                }

                if (value_of_one_point) {
                  updateFields.value_of_one_point = value_of_one_point;
                }

                if (mini_redeemable_points) {
                  updateFields.mini_redeemable_points = mini_redeemable_points;
                }

                // Use $set to update only the specified fields
                const updatedVenderData = await loyaltyCartModel.findByIdAndUpdate(
                    { _id: loyaltyId },
                    { $set: updateFields},
                    { new: true }
                );

                res.status(200).json({
                    result: 'true',
                    msg: 'loyalty cart data successfully..',
                    //data: updatedVenderData, // Optionally, send the updated user data back in the response
                });
                
            }else{
               res.status(400).json({
                     result:'false', 
                    msg: 'record not found..',
                })
            }
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required loyaltyId  (optional parameter) title,point_per_rupees, value_of_one_point, mini_redeemable_points..'
            })
        }
    }catch(error){
        console.log(error.message);
    }
};



/////    delete loyalty  cart  ////
const deleteLoyaltyCart = async (req, res) => {
  try {
    const { loyaltyId } = req.body
    if (loyaltyId) {
      const loyaltyCart = await loyaltyCartModel.findById({ _id: loyaltyId })
      if (!loyaltyCart || loyaltyCart.length == 0) {
        res.status(400).json({ result: false, msg: "record not found" })
      } else {
        await loyaltyCartModel.findByIdAndDelete({ _id: loyaltyId })
        res.status(200).json({ result: "true", msg: "loyalty cart data delete success" })
      }
    } else {
      res.status(400).json({ result: "false", msg: "parameter require loyaltyId" })
    }
  } catch (error) {
    console.log(error)
  }
}

const Today_Shop_Order_List = async (req, res) => {
    try {
        const { shopId } = req.body;

        if (shopId) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

            const createdAt = { 'createdAt': -1 }
            const result = await Order.find({
                "shopId": shopId,
                "updatedAt": {
                    $gte: today, // Greater than or equal to today
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Less than tomorrow
                },
                'order_status': "Completed"    
            }).populate({
                path: 'cartId',
                populate: {
                    path: 'products.productId',
                },
            }).sort(createdAt);

            if(!result || result.length == 0) { 
                res.status(400).json({
                    result: 'false',
                    msg: 'record not found..'
                });
            }else {
                var total_order_value = 0;
                for (const order of result) {
                  const grandTotal = order.grand_total;
                  total_order_value += grandTotal;
                }

                const shop_data = await Vender.findById({_id:shopId});
                
                const offlineOrders = result.filter(order => order.payment_mode == "offline");
                //const onlineOrders = result.filter(order => order.payment_mode != "offline");
                const get_gst = 18;
                const get_commission = shop_data.commission;
                const no_of_offline_order = offlineOrders.length;
                //const no_of_online_order = onlineOrders.length;
                const total_offline_value = (get_gst + get_commission)*no_of_offline_order;
                // const total_online_value = (get_gst + get_commission)*no_of_online_order;
                const totalOfflineGrandTotal = offlineOrders.reduce((total, order) => total + order.grand_total, 0);
                //const totalOnlineGrandTotal = onlineOrders.reduce((total, order) => total + order.grand_total, 0);
                const remaining_totalOfflineGrandTotal = totalOfflineGrandTotal - total_offline_value;
                //const remaining_totalOnlineGrandTotal = totalOnlineGrandTotal + total_online_value;
                const settlements_value = totalOfflineGrandTotal - remaining_totalOfflineGrandTotal;


                console.log(remaining_totalOfflineGrandTotal);
                //console.log(remaining_totalOnlineGrandTotal);

                const data = result.map(item => ({
                    orderId: item._id,
                    userId: item.userId,
                    cartId: item.cartId._id,
                    address: item.address,
                    order_no:item.order_no,
                    total_ammount: item.grand_total,
                    order_status: item.order_status,
                    vender_status: item.vender_status,
                    total_sells: item.cartId.products.length,
                    order_date: item.order_date,
                    driver_assign_status: item.driver_assign_status,
                    no_of_order:result.length,
                    order_value:total_order_value,
                    settlements:settlements_value,
                    products: item.cartId.products.map(product => ({
                        productId: product.productId ? product.productId._id : '',
                        product_name: product.productId ? product.productId.products_name : '',
                        product_image: product.productId ? product.productId.images[0] : '',
                        variants: product.productId ? product.productId.variants : '',
                    }))
                }));
                res.status(200).json({
                    result: 'true',
                    msg: 'today order list get successfully..',
                    data: data
                })
              
            }
        } else {
            res.status(400).json({
                result: 'false',
                msg: 'parameter required shopId..'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            result: 'false',
            msg: 'internal server error'
        });
    }

}

const Weekly_Shop_Order_List = async (req, res) => {
    try {
        const { shopId } = req.body;

        if (shopId) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

            // Calculate the start date of the current week (Monday as the first day of the week)
            const startOfWeek = new Date(today);
            const dayOfWeek = today.getDay();
            const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            startOfWeek.setDate(diff);

            // Calculate the end date of the current week (Sunday)
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const createdAt = { 'createdAt': -1 }
            const result = await Order.find({ 
                "shopId": shopId,
                "updatedAt": {
                    $gte: startOfWeek, // Greater than or equal to the start of the week (Monday)
                    $lt: new Date(endOfWeek.getTime() + 24 * 60 * 60 * 1000) // Less than the end of the week (Sunday)
                },
                'order_status': "Completed"
            }).populate({
                path: 'cartId',
                populate: {
                    path: 'products.productId',
                },
            }).sort(createdAt);

            if (!result || result.length == 0) {
                res.status(400).json({
                    result: 'false',
                    msg: 'record not found..'
                });
            } else {
                var total_order_value = 0;
                  for (const order of result) {
                    const grandTotal = order.grand_total;
                    total_order_value += grandTotal;
                  }
                const shop_data = await Vender.findById({_id:shopId});
                
                const offlineOrders = result.filter(order => order.payment_mode == "offline");
                //const onlineOrders = result.filter(order => order.payment_mode != "offline");
                const get_gst = 18;
                const get_commission = shop_data.commission;
                const no_of_offline_order = offlineOrders.length;
                //const no_of_online_order = onlineOrders.length;
                const total_offline_value = (get_gst + get_commission)*no_of_offline_order;
                // const total_online_value = (get_gst + get_commission)*no_of_online_order;
                const totalOfflineGrandTotal = offlineOrders.reduce((total, order) => total + order.grand_total, 0);
                //const totalOnlineGrandTotal = onlineOrders.reduce((total, order) => total + order.grand_total, 0);
                const remaining_totalOfflineGrandTotal = totalOfflineGrandTotal - total_offline_value;
                //const remaining_totalOnlineGrandTotal = totalOnlineGrandTotal + total_online_value;
                const settlements_value = totalOfflineGrandTotal - remaining_totalOfflineGrandTotal;


                const data = result.map(item => ({
                    orderId: item._id, 
                    userId: item.userId,
                    cartId: item.cartId._id,
                    address: item.address,
                    order_no:item.order_no,
                    total_ammount: item.grand_total,
                    order_status: item.order_status,
                    vender_status: item.vender_status,
                    total_sells: item.cartId.products.length,
                    order_date: item.order_date,
                    no_of_order:result.length,
                    order_value:total_order_value,
                    settlements:settlements_value,
                    driver_assign_status: item.driver_assign_status,
                    products: item.cartId.products.map(product => ({
                        productId: product.productId ? product.productId._id : '',
                        product_name: product.productId ? product.productId.products_name : '',
                        product_image: product.productId ? product.productId.images[0] : '',
                        variants: product.productId ? product.productId.variants : '',
                    }))
                }));
                res.status(200).json({
                    result: 'true',
                    msg: 'this week order list get successfully..',
                    data: data
                })
            }
        } else {
            res.status(400).json({
                result: 'false',
                msg: 'parameter required shopId..'
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            result: 'false',
            msg: 'internal server error'
        });
    }
}

const Monthly_Shop_Order_List = async (req, res) => {
    try {
        const { shopId, month } = req.body;

        if (shopId && month) {
            // Validate month input (assuming month is the name of the month, e.g., "January")
            const monthIndex = new Date(month + ' 1, 2000').getMonth();
            if (isNaN(monthIndex)) {
                res.status(400).json({
                    result: 'false',
                    msg: 'Invalid month name provided.'
                });
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

            // Set the date to the first day of the selected month
            const startOfMonth = new Date(today.getFullYear(), monthIndex, 1);

            // Set the date to the first day of the next month
            const endOfMonth = new Date(today.getFullYear(), monthIndex + 1, 1);

            const createdAt = { 'createdAt': -1 }
            const result = await Order.find({
                "shopId": shopId,
                "updatedAt": {
                    $gte: startOfMonth, // Greater than or equal to the start of the month
                    $lt: endOfMonth // Less than the start of the next month
                },
                'order_status': "Completed"
            }).populate({
                path: 'cartId',
                populate: {
                    path: 'products.productId',
                },
            }).sort(createdAt);

            if (!result || result.length == 0) {
                res.status(400).json({
                    result: 'false',
                    msg: 'record not found..'
                });
            } else {
                const shop_data = await Vender.findById({_id:shopId});
                
                const offlineOrders = result.filter(order => order.payment_mode == "offline");
                //const onlineOrders = result.filter(order => order.payment_mode != "offline");
                const get_gst = 18;
                const get_commission = shop_data.commission;
                const no_of_offline_order = offlineOrders.length;
                //const no_of_online_order = onlineOrders.length;
                const total_offline_value = (get_gst + get_commission)*no_of_offline_order;
                // const total_online_value = (get_gst + get_commission)*no_of_online_order;
                const totalOfflineGrandTotal = offlineOrders.reduce((total, order) => total + order.grand_total, 0);
                //const totalOnlineGrandTotal = onlineOrders.reduce((total, order) => total + order.grand_total, 0);
                const remaining_totalOfflineGrandTotal = totalOfflineGrandTotal - total_offline_value;
                //const remaining_totalOnlineGrandTotal = totalOnlineGrandTotal + total_online_value;
                const settlements_value = totalOfflineGrandTotal - remaining_totalOfflineGrandTotal;

                const data = result.map(item => ({
                    orderId: item._id,
                    userId: item.userId,
                    cartId: item.cartId._id,
                    address: item.address,
                    city: item.city,
                    pin_code: item.pin_code,
                    order_no:item.order_no,
                    total_ammount: item.grand_total,
                    order_status: item.order_status,
                    vender_status: item.vender_status,
                    total_sells: item.cartId.products.length,
                    order_date: item.order_date,
                    no_of_order:result.length,
                    order_value:total_order_value,
                    settlements:settlements_value,
                    driver_assign_status: item.driver_assign_status,
                    products: item.cartId.products.map(product => ({
                        productId: product.productId ? product.productId._id : '',
                        product_name: product.productId ? product.productId.products_name : '',
                        product_image: product.productId ? product.productId.images[0] : '',
                        variants: product.productId ? product.productId.variants : '',
                    }))
                }));
                res.status(200).json({
                    result: 'true',
                    msg: 'this month order list get successfully..',
                    data: data
                })
            }
        } else {
            res.status(400).json({
                result: 'false',
                msg: 'parameters shopId and month are required.'
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ 
            result: 'false',
            msg: 'internal server error'
        });
    }
}

const Date_Shop_Order_List = async (req, res) => {
    try {
        const { shopId, startDate, endDate } = req.body;

        if (shopId && startDate && endDate) {
            const startDateTime = new Date(startDate.split('/').reverse().join('-') + 'T00:00:00Z');
            const endDateTime = new Date(endDate.split('/').reverse().join('-') + 'T23:59:59.999Z');
            //endDateTime.setHours(23, 59, 59, 999); // Set time to the end of the day
           
            
            const createdAt = { 'createdAt': -1 }
            const result = await Order.find({
                "shopId": shopId,
                "updatedAt": {
                    $gte: startDateTime, // Greater than or equal to the start date
                    $lt: endDateTime // Less than the end date
                },
                'order_status': "Completed"
            }).populate({
                path: 'cartId',
                populate: { 
                    path: 'products.productId',
                },
            }).sort(createdAt);

            if (!result || result.length === 0) {
                res.status(400).json({
                    result: 'false',
                    msg: 'record not found..'
                });
            } else {
                var total_order_value = 0;
                  for (const order of result) {
                    const grandTotal = order.grand_total;
                    total_order_value += grandTotal;
                  }
                const shop_data = await Vender.findById({_id:shopId});
                
                const offlineOrders = result.filter(order => order.payment_mode == "offline");
                //const onlineOrders = result.filter(order => order.payment_mode != "offline");
                const get_gst = 18;
                const get_commission = shop_data.commission;
                const no_of_offline_order = offlineOrders.length;
                //const no_of_online_order = onlineOrders.length;
                const total_offline_value = (get_gst + get_commission)*no_of_offline_order;
                // const total_online_value = (get_gst + get_commission)*no_of_online_order;
                const totalOfflineGrandTotal = offlineOrders.reduce((total, order) => total + order.grand_total, 0);
                //const totalOnlineGrandTotal = onlineOrders.reduce((total, order) => total + order.grand_total, 0);
                const remaining_totalOfflineGrandTotal = totalOfflineGrandTotal - total_offline_value;
                //const remaining_totalOnlineGrandTotal = totalOnlineGrandTotal + total_online_value;
                const settlements_value = totalOfflineGrandTotal - remaining_totalOfflineGrandTotal;

                const data = result.map(item => ({
                    orderId: item._id,
                    userId: item.userId,
                    cartId: item.cartId._id,
                    address: item.address,
                    city: item.city,
                    pin_code: item.pin_code,
                    order_no:item.order_no,
                    total_ammount: item.grand_total,
                    order_status: item.order_status,
                    vender_status: item.vender_status,
                    total_sells: item.cartId.products.length,
                    order_date: item.order_date,
                    no_of_order:result.length,
                    order_value:total_order_value,
                    settlements:settlements_value,
                    driver_assign_status: item.driver_assign_status,
                    products: item.cartId.products.map(product => ({
                        productId: product.productId ? product.productId._id : '',
                        product_name: product.productId ? product.productId.products_name : '',
                        product_image: product.productId ? product.productId.images[0] : '',
                        variants: product.productId ? product.productId.variants : '',
                    }))
                }));
                res.status(200).json({
                    result: 'true',
                    msg: 'order list retrieved successfully.',
                    data: data
                })
            }
        } else {
            res.status(400).json({
                result: 'false',
                msg: 'parameters shopId, startDate, and endDate are required.'
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            result: 'false',
            msg: 'internal server error'
        });
    }
}

//create track my order list api 
const Track_My_Order = async(req,res)=>{
    try{
        const { orderId }=req.body;
        if(orderId ){
            const result = await Order.find({"_id":orderId}).populate('addressId').populate('shopId').populate('userId').populate({
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
              const driverDetails = await Asign_Diver.findOne({"orderId":orderId});
              
              if(driverDetails){
                const driverId = driverDetails.driverId
                const driver_data = await Driver.findById({"_id":driverId});
                const data = result.map(item => ({
                    orderId:item._id,
                    userId:item.userId,
                    cartId:item.cartId._id,
                    driver_name:driver_data.driver_name,
                    mobile_no:item.userId.phone,
                    address:item.addressId ? item.addressId.address : '',
                    discount_price:item.discount_price,
                    order_no:item.order_no,
                    grand_total:item.grand_total,
                    order_status:item.order_status,
                    product_count:item.cartId.products.length,
                    payment_mode:'cash on delivery',
                    order_date:item.order_date,
                    in_progress_date:item.in_progress_date,
                    asign_date:item.asign_date,
                    delivery_date:item.delivery_date,
                    completed_date:item.completed_date,
                    delivery_charge:item.shopId.delivery_charge,
                    driver_assign_status:item.driver_assign_status,
                    products: item.cartId.products.map(product => ({
                        productId: product.productId._id,
                        product_name: product.productId.products_name,
                        variant:product.productId.variant,
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
              }else{
                const data = result.map(item => ({
                    orderId:item._id,
                    userId:item.userId,
                    cartId:item.cartId._id,
                    address:item.addressId ? item.addressId.address : '',
                    discount_price:item.discount_price,
                    grand_total:item.grand_total,
                    order_status:item.order_status,
                    product_count:item.cartId.products.length,
                    payment_mode:'cash on delivery',
                    order_date:item.order_date,
                    delivery_charge:item.shopId.delivery_charge,
                    driver_assign_status:item.driver_assign_status,
                    products: item.cartId.products.map(product => ({
                        productId: product.productId._id,
                        product_name: product.productId.products_name,
                        variant:product.productId.variant,
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

/*................delete cart api..........*/
const delete_cart = async (req, res) => {
  try {
    const { cartId, orderId, productId, price } = req.body;
    if (cartId && orderId &&  productId && price ) {
      const result = await Cart.updateOne(
        { "_id": cartId, "products.productId": productId },
        { $pull: { "products": { "productId": productId } }
      });

      // Check if the product array is empty after deletion
      const cart = await Cart.findOne({ "_id": cartId });
      const order = await Order.findById({ "_id": orderId });
      const total_ammount = order.grand_total;
      const remaining_total = total_ammount-price;
      const order_data = await Order.findByIdAndUpdate({_id:orderId},{$set:{'grand_total':remaining_total}},{new:true})
      
      if (!result || result.length == 0) {
        // If the product array is empty, delete the entire cart
        //await Cart.deleteOne({ "_id": cartId });
        res.status(400).json({
          "result": 'true',
          "message": 'record not found.'
        });
      }else{
        res.status(200).json({
         "result": 'true',
         "message": 'cart product deleted successfully.'
        });
     }
    } else {
      res.status(400).json({
        "result": 'false',
        "message": 'parameters required: cartId, orderId, productId & price'
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

/*................update cart api..........*/
const update_cart = async (req, res) => {
  try {
    const { cartId, orderId, productId, qty } = req.body;
    if (cartId && orderId &&  productId && qty ) {
     
      const cart = await Cart.findById({ _id: cartId }); 
      const product = await ShopProduct.findById({ _id: productId });
      const order = await Order.findById({ _id: orderId });
      const price = product.sale_price;
      console.log(price)
      const total_price = qty * price;
      console.log(total_price)
      const grand_total = order.grand_total;
      console.log(grand_total)
      const remaining_total = grand_total - total_price;
      console.log(remaining_total)
      const order_data = await Order.findByIdAndUpdate({_id:orderId},{$set:{'grand_total':remaining_total}},{new:true})
    
     

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
        console.log(productIndex)

        if (productIndex !== -1) {
          // Update the product's quantity and price in the cart 
          const total_qty = cart.products[productIndex].qty;
          const remaining_qty = total_qty - qty;        
          cart.products[productIndex].qty = remaining_qty;
          cart.products[productIndex].price  = price * remaining_qty;

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
        "result": 'false',
        "message": 'parameters required: cartId, orderId, productId, price & qty'
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

/*...................get_notification_list.................*/
const get_notification_list = async (req, res) => {
  try {
    const { shopId } = req.body;
    if (!shopId) {
      return res.status(400).json({ "result": "false", "message": "required parameter is shopId" });
    }

    const result = await Notification.find({ "shopId": shopId });
    if(result){
      const data = result.map(item => ({
        shopId: item.shopId,
        title: item.shop_title,
        notification: item.shop_notification,
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

/*................get_like_shop data................*/
const get_driver_latlog = async (req, res) => {
  try {
    const {shopId,orderId} = req.body;
    if (!shopId && !orderId ) {
      return res.status(400).json({ result: 'false', message: 'Required parameters are shopId & orderId,' });
    }
    const data = await Asign_Diver.findOne({ 'shopId': shopId, 'orderId': orderId });
    console.log(data)
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

      const address_data = await Address.findOne({userId: user_id }).sort({ updatedAt: -1 }).limit(1);
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



/*---------------------faq_data api------------------------*/
const faq_data=async(req,res)=>{
  try{
    const data=await faqListModel.find({});
    res.status(200).json({"result":"true","message":"faq list are",data:data});
  }catch(error){
    res.status(400).json({"result":"false","message":error.message});
  }
};

/*..........shop product_list..............*/
const shop_product_list=async(req,res)=>{
  try{
    const {shopId}=req.body;
    if(!shopId){
      res.status(400).json({"result":"false","message":"require parameter are shopId.."});
    }else{
      const data=await ShopProduct.find({"shopId": shopId});
      const filterData=data.map(item=>({
        productId:item._id,
        shopId:item.shopId,
        products_name:item.products_name,
        variants:item.variants,
        barcodes:item.barcodes,
        image:item.images,
        mrp_price:item.mrp_price,
        price:item.sale_price,
        gst:item.gst,
        stock_status:item.stock_status,
        act_status:item.act_status,
        barcodes:item.barcodes
      }))
      res.status(200).json({"result":"true","message":"product list are",data:filterData})
    }

  }catch(err){
    res.status(400).json({"result":"false","message":err.message})
  }

};



/*..................export module.................*/
module.exports={
    signupVender,
    venderLogin,
    Verifyotp,
    ResendOtp,
    signupVender2,
    signupVender3,
    signupVender4,
    category_list,
    createShopBanner,
    AddShopPdf,
    updateShopBannerStatus,
    shopcategory, 
    getQrcode,
    create_product,
    uploadCsv_file,
    getVenderProfile,
    shopcategory_list,
    ShopProduct_list,
    shopCategory_list,
    updateShop,
    venderLogout,
    shopOpen_close,
    getStatus,
    shopStock,
    driver,
    driver_list,
    delete_driver,
    update_active_status,
    update_product,
    product_delete,
    getShopBanner,
    order_list,
    productinsertToQr,
    updateProductData,
    get_category_list,
    deleteBannerByIndex,
    search_product_list,
    search_master_list,
    Shop_Order_List,
    Reject_Order_List,
    Update_Order_Status,
    update_vender,
    asign_driver,
    loyaltyCart,
    getLoyaltyCart,
    updateLoyaltyCart,
    deleteLoyaltyCart,
    Today_Shop_Order_List,
    Weekly_Shop_Order_List,
    Monthly_Shop_Order_List,
    Date_Shop_Order_List,
    Track_My_Order,
    delete_cart,
    update_cart,
    get_notification_list,
    faqlist,
    termlist,
    Privacy_list,
    contactus_list,
    create_master_product,
    get_driver_latlog,
    cart_calculation,
    faq_data,
    shop_product_list

};



