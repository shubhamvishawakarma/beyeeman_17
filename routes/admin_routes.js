// import dependancies in the  router files
const express=require("express");
const router=express();
const multer = require("multer");
const adminControllers=require("../controllers/admin_controllers");
const auth=require("../middlewere/admin_auth");


  
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
        file.mimetype == "text/csv"
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



/*.................import admin controllers............*/
router.get("/admin_login",auth.isLogout,adminControllers.AdminLogin_page);
router.post("/admin_login",adminControllers.AdminLogin);
router.get("/index",auth.isLogin,adminControllers.indexPage);
router.get("/admin_logout",auth.isLogout,adminControllers.AdminLogout);
  
/*................BANNER OPERATION...............*/
router.post("/create_banner",upload.single('image'),adminControllers.createBanner);
router.get("/create_banner",auth.isLogin,adminControllers.createBanner_page);
router.get("/banner_list",auth.isLogin,adminControllers.BannerList);
router.post("/banner_update/:bannerId",upload.single('image'),adminControllers.Banner_update);
router.get("/banner_update/:bannerId",auth.isLogin,adminControllers.bannerUpdate);
router.get("/banner_delete/:bannerId",auth.isLogin,adminControllers.bannerDelete);

router.get("/banner_update_status/:bannerId",auth.isLogin,adminControllers.updateBanner_status);
  
/*.................Category operation...................*/
router.post("/create_category",upload.single('image'),adminControllers.createCategory);
router.get("/create_category",auth.isLogin,adminControllers.create_categoryPage);
router.get("/category_list",auth.isLogin,adminControllers.category_list);
router.post("/category_update/:categoryId",upload.single('image'),adminControllers.updateCategory);
router.get("/category_update/:categoryId",auth.isLogin,adminControllers.updateCategory_page);
router.get("/category_update_status/:categoryId",auth.isLogin,adminControllers.updateCategory_status);

/*-------------------------master product operation---------------------*/
router.post("/create_master_product",upload.array('images',5),adminControllers.createMaster_product);
router.get("/master_product_list",auth.isLogin,adminControllers.MasterProduct_list);
router.get("/create_master_product",auth.isLogin,adminControllers.createProduct_page);
router.get("/update_master_product_status/:productId",auth.isLogin,adminControllers.updatemaster_product_status);
router.get("/update_master_product/:productId",auth.isLogin,adminControllers.updatemaster_product_page);
router.post("/update_master_product/:productId",upload.array('images',5),adminControllers.updatemaster_product);
router.post('/get_sub_category/:id', adminControllers.getSubCategory)

/*-----------------------------user operation url setup-------------------*/
router.get("/user_list",auth.isLogin,adminControllers.userList);
router.get("/user_details/:userId",auth.isLogin,adminControllers.userDetails); 
router.get("/user_delete/:id",auth.isLogin,adminControllers.userDelete);


/*------------------------------faq operation------------------------*/
router.get("/faqList",auth.isLogin,adminControllers.faqlist);
router.get("/faq_update/:id",auth.isLogin,adminControllers.updatefaq);
router.post("/faq_update/:id",adminControllers.Updatefaq);

/*--------------------------------term operation----------------------*/
router.get("/termList",auth.isLogin,adminControllers.termlist);
router.get("/term_update/:id",auth.isLogin,adminControllers.updateTerm);
router.post("/term_update/:id",adminControllers.UpdateTerm);

/*-----------------privacy url setup-------------------*/
router.get("/privacyList",auth.isLogin,adminControllers.pollicylist);
router.get("/update_privacy/:id",auth.isLogin,adminControllers.updatepollicy);
router.post("/update_privacy/:id",adminControllers.UpdatePollicy);
 

/*-----------------contact us ---------------------------*/
router.get("/contactList",auth.isLogin,adminControllers.contactus_list);
router.get("/contact_update/:id",auth.isLogin,adminControllers.updatecontact);
router.post("/contact_update/:id",adminControllers.Updatecontact);
 
/*-----------------------------csvfile upload----------------------*/
router.get("/csvfile/upload",auth.isLogin,adminControllers.csvfile);
router.post("/csvfile/upload",upload.single('images'),adminControllers.csvfile_upload);

   
/*.......................shop url..........................*/

router.get("/shop_list",/*auth.isLogin,*/adminControllers.shop_list);
router.get("/approve_shop_status/:_id",adminControllers.approveShop_status);
router.get("/shop_details/:id",adminControllers.shop_details);
router.get("/shop_vender_list",adminControllers.shop_vender_list);
router.get("/shop_vender_menu/:id",adminControllers.show_vender_manu);



/*....................shop category url..................*/
router.get("/subcategory_list",adminControllers.shopcategory_list);
router.post("/subcategory",upload.single('category_image'),adminControllers.shopcategory);
router.get("/subcategory",adminControllers.createsubcategory_page);
router.post("/subcategory_update/:categoryId",upload.single('category_image'),adminControllers.updateSubategory);
router.get("/subcategory_update/:categoryId",auth.isLogin,adminControllers.updateSubategory_page);

 
/*-----------------------------push notification----------------------*/
router.get("/push_messaging_service",adminControllers.push_notification);
router.get("/send_notification",adminControllers.send_notification);
router.post("/send_notification",upload.single('image'),adminControllers.all_send_notification);
router.get("/delete_push_notification/:id",adminControllers.delete_push_notification);

/*-----------------------------order List----------------------*/
router.get("/order_list",adminControllers.order_list);
router.get("/edit_order/:id",adminControllers.edit_order);
router.post("/update_order_status/:id",adminControllers.updateOrderStatus);
router.get("/delete_order/:id",adminControllers.deleteOrder);

/*-----------------------------delivery boy List----------------------*/
router.get("/delivery_boy_list",adminControllers.delivery_boy_list);
router.get("/delete_delivery_boy/:id",auth.isLogin,adminControllers.deliveryboyDelete);

/*-----------------------------payment List----------------------*/
router.get("/payment_list",adminControllers.payment_list);


/*-----------------transaction report ---------------------------*/
router.get("/transaction_report_list",adminControllers.transaction_report_list);
router.get("/refund_report_list",adminControllers.refund_report_list);

  
/*-----------------service charge report ---------------------------*/
router.get('/add_service_charge',adminControllers.createServiceCharge)
router.post('/add_service_charge',adminControllers.addServiceCharge)

/*......................vender shop url..........................*/
router.get("/vender_product_details/:id",adminControllers.product_details); 
router.get("/push_notification_service/:id",adminControllers.push_notification_service);
router.get("/delivery_boy_vender_list/:id",adminControllers.delivery_boy_vender_list);
router.get("/product_vender_list/:id",adminControllers.product_vender_list);
router.get("/shop_vender_banner_list/:id",adminControllers.shop_vender_banner_list);
router.get("/delete_push_notification_vender/:id",adminControllers.delete_push_notification_vender);
router.get("/csvfile_vender",adminControllers.csvfile_vender);
router.post("/csvfile_vender",upload.single('images'),adminControllers.csvfile_upload_vender);
router.get("/user_qr_details/:id",adminControllers.user_qr_details);
router.get("/report_vender_details/:id",adminControllers.report_vender_details); 
router.get("/order_vender_details/:id",adminControllers.order_vender_details);
router.get("/edit_vender_product/:id",adminControllers.edit_vender_product);
router.get("/delete_delivery_boy_vender/:id",adminControllers.delete_delivery_boy_vender);
router.get("/update_vender_product_status/:id",adminControllers.update_vender_product_status);
router.post("/update_vender_product/:id",upload.array('images',5),adminControllers.update_vender_product);
router.get("/search_shop_category_list/:id",adminControllers.search_shop_category_list);
router.get("/vender_setting_details/:id",adminControllers.vender_setting_details);
router.post("/add_vender_commission/:id",adminControllers.add_vender_commission);
router.get("/send_notification_vender/:id",adminControllers.send_notification_vender);
router.post("/send_notification_vender/:id",upload.single('image'),adminControllers.all_send_notification_vender);

module.exports=router; 
 