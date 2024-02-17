// import dependancies in the  router files
const express=require("express");
const router=express(); 
const multer = require("multer");
const userControllers=require("../controllers/app_controllers");

    
  
/*...............use multer............*/ 
const storage=multer.diskStorage({  
    destination:"uploads",   
    filename:(req,file,cb)=>{
        cb(null,file.originalname); 
    },  

}); 
 
const upload = multer({
    storage: storage,
    fileFilter: function(req,file,callback){
        if(
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"||
        file.mimetype == "image/csv"
    ){
        callback(null,true)
    }else{
        console.log('only  png , jpg & jpeg file supported')
        callback(null,false)
    } 

   }, 
   limits:{

    filesize:100000000000 //1000000 bytes=1MB
   }
}); 
 
/*.................import user controllers............*/
router.post("/user_login",userControllers.User_login);
router.post("/verify_otp",userControllers.Verifyotp);  
router.post("/resend_otp",userControllers.ResendOtp); 
router.post("/getProfile",userControllers.getProfile);
router.post("/updateProfile",upload.single('image'),userControllers.updateProfile);
router.post("/addAddress",userControllers.addAddress);
router.post("/address_list",userControllers.Address_list);
router.post("/get_last_address",userControllers.Get_Last_Address);
router.post("/updateAddress",userControllers.updateAddress);
router.post("/deleteAddress",userControllers.deleteAddress); 
router.post("/updateUser",userControllers.updateUser);
router.post("/User_logout",userControllers.userLogout); 
router.post('/booking_order',userControllers.Add_Order);  
router.post('/my_order_list',userControllers.My_Order_List);
router.post('/my_order_data',userControllers.My_Order_Data);  
router.post('/my_order_status',userControllers.My_Order_Status);
router.post('/track_my_order',userControllers.Track_My_Order);
router.post('/cancel_order',userControllers.Cancel_Order);
router.post('/reject_order_list',userControllers.Reject_Order_List);
   
router.get("/banner_list",userControllers.Banner_list)   
router.get("/category_list",userControllers.category_list) 
router.get("/faq_list",userControllers.faqlist) 
router.get("/term_list",userControllers.termlist)  
router.get("/policy_list",userControllers.Privacy_list) 
router.get("/contact_list",userControllers.contactus_list) 
router.post("/support",userControllers.support_api)   
router.post("/shop_list",userControllers.shop_list);  
router.post("/store_search",userControllers.store_search);
router.post("/spacific_shop_search",userControllers.spacific_shop_search);
router.post("/shop_banner_list",userControllers.shopBanner_list);
router.post("/shop_category_list",userControllers.shopcategory_list);
router.post("/shop_product_list",userControllers.ShopProduct_list);
router.post("/shop_product_list_by_category",userControllers. Product_list_by_Product_Category);
router.post("/match_qrcode",userControllers.matchQrcode);
router.post("/variant_list",userControllers.variants_list);   
router.post("/like_api",userControllers.likedProducts); 
router.post("/shop_information",userControllers.shopInformation);
router.post("/shopVeriant",userControllers.shopVariant); 
router.post("/shop_details",userControllers.shopDetails); 
router.post("/subcategory_list",userControllers.subcategory_list);
router.post("/get_subcategory_list",userControllers.get_subcategory_list);
router.post("/add_cart",userControllers.addcart);
router.post("/replace_cart",userControllers.replacecart);
router.post("/update_cart",userControllers.update_cart); 
router.post("/delete_cart",userControllers.delete_cart); 
router.post("/cart_list",userControllers.cart_list);
router.post("/cart_calculation",userControllers.cart_calculation);
router.post("/search_product_list",userControllers.SearchProduct_list);
router.post("/shop_data",userControllers.shopData);
router.post("/report_status",userControllers.reportStatus);
router.post("/product_variants_list",userControllers.Product_Variants_List);
router.post("/like_shop",userControllers.like_shop); 
router.post("/get_like_shop",userControllers.get_like_shop);
router.post("/like_shop_data",userControllers.Like_Shop_Data);
router.post("/shop_product_list_data",userControllers.ShopProduct_list_data);
router.post("/get_driver_latlog",userControllers.get_driver_latlog);
router.post("/get_driver_details",userControllers.get_driver_details);
router.post("/get_notification_list",userControllers.get_notification_list);
router.post("/get_shop_status",userControllers.get_shop_status);
router.post("/delete_user_account",userControllers.delete_user_account);
router.post('/get_loyaltycart', userControllers.getLoyaltyCart);
router.post('/get_my_loyaltycart', userControllers.getMyLoyaltyCart);
router.post('/readim_loyaltypoint', userControllers.readim_loyaltypoint);
router.get("/faq_data",userControllers.faq_data);

module.exports=router;
 
