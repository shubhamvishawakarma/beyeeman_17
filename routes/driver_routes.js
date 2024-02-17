// import dependancies in the  router files
const express=require("express");
const router=express();
const multer = require("multer");
const driverControllers=require("../controllers/driver_controllers");


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

 
/*.................import driver controllers............*/
router.post("/driver_login",driverControllers.driver_login);
router.post("/Verifyotp",driverControllers.Verifyotp);
router.post("/resend_otp",driverControllers.ResendOtp); 
router.post("/updateProfile",upload.single('image'),driverControllers.updateProfile);
router.post("/getProfile",driverControllers.getProfile);
router.post("/updateDriver",upload.single('image'),driverControllers.updateDriver);
router.post("/updatelatlong",driverControllers.updatelatlong);
router.post("/driverLogout",driverControllers.driverLogout);
router.post("/get_order_list",driverControllers.get_order_list);
router.post('/update_order_status',driverControllers.Update_Order_Status);
router.post("/get_order_status",driverControllers.get_order_status);
router.post("/get_order_details",driverControllers.get_order_details);
router.post("/get_notification_list",driverControllers.get_notification_list);

module.exports=router;
 
 

