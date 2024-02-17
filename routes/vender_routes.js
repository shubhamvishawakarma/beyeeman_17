// import dependancies in the  router files
const express=require("express");
const router=express();
const multer = require("multer");
const venderControllers=require("../controllers/vender_controllers");


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
        file.mimetype == "text/csv"  ||
        file.mimetype == "application/pdf" 
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

 
   
 
/*.................import vender controllers............*/
router.post("/vender_signup",upload.array('shop_image',4),venderControllers.signupVender);
router.post("/venderLogin",venderControllers.venderLogin);
router.post("/Verifyotp",venderControllers.Verifyotp);  
router.post("/ResendOtp",venderControllers.ResendOtp);
router.post("/vender_signup1",upload.array('shop_image',2),venderControllers.signupVender2);
router.post("/vender_signup2",upload.array('shop_image',6),venderControllers.signupVender3);
router.post("/vender_signup3",upload.array('shop_image',5),venderControllers.signupVender4);
router.get("/category_list",venderControllers.category_list);
router.post("/shop_banner",upload.array('shopbanner',6),venderControllers.createShopBanner);
router.post("/shop_pdf",upload.array('shoppdf',6),venderControllers.AddShopPdf);

//router.post("/shop_banner",upload.fields([ { name: 'shopbanner', maxCount: 6 },{ name: 'shoppdf', maxCount: 6 }]),venderControllers.createShopBanner);
router.post("/create_shopProduct",upload.array('images',5),venderControllers.create_product);
router.post("/update_shopProduct",upload.array('images',5),venderControllers.update_product);
router.post("/delete_shopProduct",venderControllers.product_delete);
router.post("/get_shop_banner",venderControllers.getShopBanner);
router.post("/shopcategory",upload.single('category_image'),venderControllers.shopcategory);
router.post("/product_to_csv",upload.single('images'),venderControllers.uploadCsv_file);
router.post("/qrcode_list",venderControllers.getQrcode); 
router.post("/getVenderProfile",venderControllers.getVenderProfile);
router.post("/shopcategory_list",venderControllers.shopcategory_list);
router.post("/product_list",venderControllers.ShopProduct_list); 
router.post("/category_list",venderControllers.shopCategory_list); 
router.post("/update_shop",venderControllers.updateShop); 
router.post("/vendor_logout",venderControllers.venderLogout);
router.post("/shopOpen_close",venderControllers. shopOpen_close);
router.post("/getStatus",venderControllers.getStatus);  
router.post("/shopStock",venderControllers.shopStock);    
router.post("/create_driver",upload.single('image'),venderControllers.driver);
router.post("/driver_list",venderControllers.driver_list);  
router.post("/delete_driver",venderControllers.delete_driver);
router.post("/update_driver_status",venderControllers.update_active_status);
router.get("/order_list",venderControllers.order_list);
router.post("/productInsert_toQr",venderControllers.productinsertToQr);
router.post("/updateProductData",venderControllers.updateProductData);
router.post("/get_category_list",venderControllers.get_category_list);
router.post("/update_shop_banner_status",venderControllers.updateShopBannerStatus);
router.post("/delete_banner",venderControllers.deleteBannerByIndex);
router.post("/search_product_list",venderControllers.search_product_list);
router.post("/search_master_list",venderControllers.search_master_list);
router.post('/shop_order_list',venderControllers.Shop_Order_List);
router.post('/reject_order_list',venderControllers.Reject_Order_List);
router.post('/update_order_status',venderControllers.Update_Order_Status);
router.post("/update_vender",venderControllers.update_vender);
router.post("/asign_driver",venderControllers.asign_driver);  
router.post('/add_loyaltycart', venderControllers.loyaltyCart);
router.post('/get_loyaltycart', venderControllers.getLoyaltyCart);
router.post('/update_loyaltycart', venderControllers.updateLoyaltyCart);
router.post('/delete_loyaltycart', venderControllers.deleteLoyaltyCart);
router.post('/today_shop_order_list',venderControllers.Today_Shop_Order_List);
router.post('/weekly_shop_order_list',venderControllers.Weekly_Shop_Order_List);
router.post('/monthly_shop_order_list',venderControllers.Monthly_Shop_Order_List);
router.post('/date_shop_order_list',venderControllers.Date_Shop_Order_List);
router.post('/track_my_order',venderControllers.Track_My_Order); 
router.post("/delete_cart",venderControllers.delete_cart);
router.post("/update_cart",venderControllers.update_cart);
router.post("/get_notification_list",venderControllers.get_notification_list);
router.get("/faq_list",venderControllers.faqlist);
router.get("/term_list",venderControllers.termlist);
router.get("/policy_list",venderControllers.Privacy_list);
router.get("/contact_list",venderControllers.contactus_list);
router.post("/create_masterProduct",venderControllers.create_master_product);
router.post("/get_driver_latlog",venderControllers.get_driver_latlog);
router.post("/cart_calculation",venderControllers.cart_calculation);
router.get("/faq_data",venderControllers.faq_data);
router.post("/shop_product_list",venderControllers.shop_product_list); 

 
module.exports=router;  
   
 