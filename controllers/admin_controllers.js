//import all models of admin panel here
const mongoose =require('mongoose'); 
const User=require("../models/user_models");
const Category=require("../models/category_models");
const Banner=require("../models/banner_models"); 
const MasterProduct=require("../models/master_product_models");
const ContactUs=require("../models/contactus_models");
const Term=require("../models/term_condiction_models");
const Privacy=require("../models/privacy_policy_models");
const Faq=require("../models/faq_models");
const Vender=require("../models/vender_models"); 
const Shopcategory=require("../models/shopcategory");
const Order=require("../models/order_models");
const ShopProduct=require("../models/shopproduct_models");
const Driver=require("../models/driver_models");
const Notification=require("../models/notification_models");
const ShopBanner=require("../models/shop_banner");  
const QRCode=require("../models/qrcode_models");
const Transaction=require("../models/transaction_report_models");
const admin = require('firebase-admin');
  
   
/*--------------import module-------------------*/
//const csv=require("csvtojson"); 
const path=require("path"); 
const fs = require('fs'); 
const csv = require('csv-parser');

/*.............Admin login Page............*/
const AdminLogin_page=async(req,res)=>{
    res.render('login')
};

/*.............show_vender_manu............*/
// const show_vender_manu=async(req,res)=>{
//     res.render('show_vender_manu')
// };



/*..................Admin login api................*/
const AdminLogin=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const admin_login=await User.findOne({email:email,password:password});
        if (admin_login) {
            if(admin_login.is_user === 0){
                res.render("login",{message:"email and Password incorrect"});
            }else{
                req.session.user_id=admin_login._id;
                console.log(req.session)
                res.redirect('/public/index');
            }
        }else{
            res.render('login',{message:"email and Password incorrect"});
        }
    }catch(error){
        console.log(error.message)
    }
};

/*-----------------admin logout--------------------*/
const AdminLogout=async(req,res) => {
    req.session.destroy();
    res.render('login');
};

/*..................show index page-------------------*/
const indexPage=async(req,res)=>{
   // res.render("index")
   //create admin indexpage api
    const usercount=await User.count();
    const a={usercount};
    const vendercount=await Vender.count();
    const b={vendercount};
    const categorycount=await Category.count();
    const c={categorycount};
    const ordercount=await Order.count();
    const d={ordercount};
    const productcount=await MasterProduct.count();
    const e={productcount};
    
    const data=[a,b,c,d,e];
    res.render('index',{data:data});
};

/*............create banner api.........*/
const createBanner=async(req,res)=>{
    try{
        const banner= new Banner({image:req.file.filename,banner_link:req.body.banner_link});
        const data=await banner.save();
        res.status(200).redirect("/public/banner_list");/*json({"result":"true",data:data})*/
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*............create banner page..............*/
const createBanner_page=async(req,res)=>{
    try{
        res.status(200).render("create_banner");
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*......................banner list api..............*/
const BannerList=async(req,res)=>{
    try{
        const banner_list=await Banner.find({});
        res.status(200).render("banner",{"result":"true","message":"banner list are",data:banner_list});
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*................Banner update api..................*/
const Banner_update=async(req,res)=>{
    try{
        const {banner_link} = req.body;
        const bannerId=req.params.bannerId;
        const bannerUpdate=await Banner.findByIdAndUpdate({"_id":bannerId},{image:req.file.filename,banner_link:banner_link},{new:true});
        res.status(200).redirect("/public/banner_list")
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*.................banner update page.............*/
const bannerUpdate=async(req,res)=>{
    try{
        const bannerId=req.params.bannerId;
        const data=await Banner.findById({"_id":bannerId});
        res.render("edit_banner",{"result":"true","message":"updated list are ",data:data});
        console.log(data)
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*....................banner delete api............*/
const bannerDelete=async(req,res)=>{
    try{
        const bannerId=req.params.bannerId;
        const data_delete=await Banner.findByIdAndDelete({"_id":bannerId});
        res.status(200).redirect("/public/banner_list");/*json({"result":"true","message":"data deleted sucessfully"})*/
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }

};

/*..................update banner status...................*/
const updateBanner_status=async(req,res)=>{
    try{
        const bannerId=req.params.bannerId;
        const data=await Banner.findOne({"_id":bannerId});
        const status=data.b_status;
        if(status===0){
            const update_data=await Banner.findByIdAndUpdate({"_id":bannerId},{b_status:1},{new:true});
            res.status(200).redirect("/public/banner_list");/*json({"result":"true","message":"data updated successfully"})*/
        }else{
            const update_data=await Banner.findByIdAndUpdate({"_id":bannerId},{b_status:0},{new:true});
            res.status(200).redirect("/public/banner_list");
        }
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*....................user delete api............*/
const userDelete=async(req,res)=>{
    try{
        const Id=req.params.id;
        const data_delete=await User.findByIdAndDelete({"_id":Id});
        res.status(200).redirect("/public/user_list");/*json({"result":"true","message":"data deleted sucessfully"})*/
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }

};

/*..................create category api...................*/
const createCategory=async(req,res)=>{
    try{
        const {category_name}=req.body;
        const category= new Category({category_name,image:req.file.filename});
        const data=await category.save();
        res.status(200).redirect("/public/category_list");

    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*..................create category page...................*/
const create_categoryPage=async(req,res)=>{
    try{
        res.status(200).render("create_category");
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*..................category list api...................*/
const category_list=async(req,res)=>{
    try{
        const data=await Category.find({});
        res.render("category_list",{"result":"true","message":"data list are",data:data});
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*..................update category api...................*/
const updateCategory=async(req,res)=>{
    try{
        const categoryId=req.params.categoryId;
        const {category_name}=req.body;
        const dinesh=await Category.findOne({"_id":categoryId});
        if(dinesh){
            if(req.file){
                var datarecord={
                    category_name,
                    image:req.file.filename
                }
            }else{
                var datarecord={
                    category_name
                }
            }
            const data=await Category.findByIdAndUpdate({"_id":categoryId},(datarecord),{new:true});
            const dinu=await data.save();
            res.status(200).redirect("/public/category_list");
        }else{
            res.status(400).json({"result":'false',"message":"data does not found"})
        }
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*..................update category page...................*/
const updateCategory_page=async(req,res)=>{
    try{
        const categoryId=req.params.categoryId;
        const data=await Category.findById({"_id":categoryId});
        res.status(200).render("edit_category",{"message":"updated list are",data:data})
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*..................update category status...................*/
const updateCategory_status=async(req,res)=>{
    try{
        const categoryId=req.params.categoryId;
        const data=await Category.findOne({"_id":categoryId});
        const status=data.c_status;
        if(status===0){
            const update_data=await Category.findByIdAndUpdate({"_id":categoryId},{c_status:1},{new:true});
            res.status(200).redirect("/public/category_list");/*json({"result":"true","message":"data updated successfully"})*/
        }else{
            const update_data=await Category.findByIdAndUpdate({"_id":categoryId},{c_status:0},{new:true});
            res.status(200).redirect("/public/category_list");
        }
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*-------------------create master product-----------------*/
const createMaster_product = async (req, res) => {
    const {category_name,subcategory, product_name, brand_name, gst, description, barcode, variants} = req.body;
   // const { images } = req.files;
    console.log(category_name)
        console.log(subcategory)
    console.log(product_name)
    try {
        if (!category_name || !product_name || !brand_name || !variants) {
                res.status(400).json({"result":"false","message":"require parameter are category_name,subcategory, product_name, brand_name, gst, description,qty, barcode, variants"});
        }else{
            const Image=[];
            for (var i = 0; i <req.files.length; i++) {
                Image[i]=req.files[i].filename;
            }
            const barcodeArray = barcode.split(',').map(code => code.trim());
            const newProduct = new MasterProduct({
                category_name,
                subcategory,
                product_name,
                brand_name,
                description,
                barcode:barcodeArray,
                variants,
                images:Image
            });
            const savedProduct = await newProduct.save();
            res.status(200).redirect("/public/master_product_list"/*{
                "result": "true",
                "message": 'Product added successfully.',
                data: savedProduct
            }*/);
        }
    } catch (error) {
        console.log(error.message);
        // res.status(500).json({
        //     result: false,
        //     msg:error.message
        // });
    }
};

const getSubCategory = async (req, res) => {
    try {
        const id = req.params.id
        const subCategory = await Shopcategory.find({ categoryId: id })
        if (!subCategory || subCategory.length == 0) {
            return res.status(200).json({ result: "false", msg: "record not found" })
        }

        const subCategoryData = subCategory.map(items => items.
            subcategory)
        res.status(200).json({ result: "true", msg: "subcategory get success", subCategoryData: subCategoryData })
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
}



/*--------------------------create product page--------------------*/
const createProduct_page=async(req,res)=>{
    try{
        const data=await Category.find({});
        const list=await Shopcategory.find({});
        res.render("create_master_product",{"result":"true",data:data,list:list});
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};
 

/*.............................master product list...................*/
const MasterProduct_list=async(req,res)=>{
    try{
        const data=await MasterProduct.find({});
        res.status(200).render("master_product_list",{"result":"true","message":"product list are",data:data});
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*-------------------------------update product api-----------------------------*/
const updatemaster_product=async(req,res)=>{
    try{
        const {cat_name,product_name,brand,barcode,gst,variant_name,description}=req.body;
        const productId=req.params.productId;
        const Image=[];
        for (var i = 0; i <req.files.length; i++) {
            Image[i]=req.files[i].filename;
        }
        const dinesh=await MasterProduct.findOne({"_id":productId});
        if(dinesh){
            if(Image.length>0){
                var datarecord={
                    product_name,brand,gst,variant_name,barcode,description,images:Image
                }
            }else{
                var datarecord={
                    product_name,brand,gst,variant_name,barcode,description
                } 
            }
            const data=await MasterProduct.findByIdAndUpdate({"_id":productId},(datarecord),{new:true});
            const dashing=await data.save();
            res.status(200).redirect("/public/master_product_list");
        }else{
            res.status(400).json({"result":"false","message":"data does not found"});
        }
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*-----------------------------------update product page----------------------*/
const updatemaster_product_page=async(req,res)=>{
    try{
        const productId=req.params.productId;
        const data=await MasterProduct.findById({"_id":productId});
        res.status(200).render("master_product_update",{"result":"true",data:data});
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*----------------------------update product status api-----------------*/
const updatemaster_product_status=async(req,res)=>{
    try{
        const productId=req.params.productId;
        const data=await MasterProduct.findOne({"_id":productId});
        const status=data.act_status;
        console.log(status)
        if(status===0){
            const update_data=await MasterProduct.findByIdAndUpdate({"_id":productId},{act_status:1},{new:true});
            res.status(200).redirect("/public/master_product_list");/*json({"result":"true","message":"data updated successfully"})*/
        }else{
            const update_data=await MasterProduct.findByIdAndUpdate({"_id":productId},{act_status:0},{new:true});
            res.status(200).redirect("/public/master_product_list");
        }
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*......................User list api---------------------*/
const userList=async(req,res)=>{
    try{
        const data=await User.find({is_user:0});
        res.status(200).render("user_show",{"result":"true","message":"user data list are",data:data});
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*-----------------------user details-------------------------*/
const userDetails=async(req,res)=>{
    try{
        const userId=req.params.userId;
        const data=await User.findOne({"_id":userId});
        res.status(200).render("user_details",{"result":"true",data:data})
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};



/*--------------faq list api--------------------*/
const faqlist=async(req,res)=>{
    try{
        const data=await Faq.find();
        res.status(200).render('faq',{data:data});
    }catch(error){
        res.status(400).json({ message:error.message})
    }
}

/*----------------update faq api------------------*/
const updatefaq=async(req,res)=>{
    const id=req.params.id;
    try{
        const data=await Faq.findById({"_id":id});
        res.status(200).render('edit_faq',{data:data});
    }catch(error){
        res.status(400).json({ message:error.message})
    }
};


/*---------------update faq api-------------*/
const Updatefaq=async(req,res)=>{
    const {title,text}=req.body;
    const id=req.params.id;
    try{
        const data=await Faq.findByIdAndUpdate({"_id":id},{$set:{title,text},new:true});
        res.status(200).redirect("/public/faqList");
    }catch(error){
        res.status(400).json({ message:error.message})
    }
};


/*--------------------term list api------------------------*/
const termlist=async(req,res)=>{
    try{
        const data=await Term.find();
        res.status(200).render('term_condiction',{data:data});
    }catch(error){
        res.status(400).json({ message:error.message})
    }
}


/*--------------------term update page--------------------------*/
const updateTerm=async(req,res)=>{
    const id=req.params.id;
    try{
        const data=await Term.findById({"_id":id});
        res.status(200).render('edit_term_condition',{data:data});
    }catch(error){
        res.status(400).json({ message:error.message})
    }
};

/*---------------------term update api---------------------------*/
const UpdateTerm=async(req,res)=>{
    const {title,text}=req.body;
    const id=req.params.id;
    try{
        const data=await Term.findByIdAndUpdate({"_id":id},{$set:{title,text},new:true});
        res.status(200).redirect("/public/termList");
    }catch(error){
        res.status(400).json({ message:error.message})
    }    
};


/*-----------------------privacy list-----------------*/
const pollicylist=async(req,res)=>{
    try{
        const data=await Privacy.find();
        res.status(200).render('privacy_pollicy',{data:data});
    }catch(error){
        res.status(400).json({ message:error.message})
    }
}

/*-----------------privacy page----------------------------*/
const updatepollicy=async(req,res)=>{
    const id=req.params.id;
    try{
        const data=await Privacy.findById({"_id":id});
        res.status(200).render('edit_privacy',{data:data});
    }catch(error){
        res.status(400).json({ message:error.message})
    }
};


/*--------------------update privacy api------------------*/
const UpdatePollicy=async(req,res)=>{
    const {title,text}=req.body;
    const id=req.params.id;
    try{
        const data=await Privacy.findByIdAndUpdate({"_id":id},{$set:{title,text},new:true});
        res.status(200).redirect("/public/privacyList");
    }catch(error){
        res.status(400).json({ message:error.message})
    }
};


/*--------------------client contactus list api-------------------*/
const contactus_list=async(req,res)=>{
    try{
        const data=await ContactUs.find({});
        res.status(200).render('contact',{data:data});
    }catch(error){
        res.status(400).json({ message:error.message})
    }
};

/*-----------------------contact update -----------------------*/
const updatecontact=async(req,res)=>{
    const id=req.params.id;
    try{
        const data=await ContactUs.findById({"_id":id});
        res.status(200).render('edit_contact',{data:data});
    }catch(error){
        res.status(400).json({ message:error.message})
    }
};


/*----------------update contactus api----------------------*/
const Updatecontact=async(req,res)=>{
    const {client_name,phone,whatsapp,email}=req.body;
    const id=req.params.id;
    try{
        const data=await ContactUs.findByIdAndUpdate({"_id":id},{$set:{client_name,phone,whatsapp,email},new:true});
        res.status(200).redirect("/public/contactList");
    }catch(error){
        res.status(400).json({ message:error.message})
    }
};

/*.................upload csv file------------------*/
const csvfile=async(req,res)=>{
    try{
        res.render("upload_csvfile")
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*------------------upload csv file api----------------------*/
const csvfile_upload = (req, res) => {
  new Promise((resolve, reject) => {
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
    })
    .then(async (data) => {
     const productNames = data.map((product) => product.product_name);
      const variantNames = data.map((product) => product.variants);

      const existingBarcodes = await MasterProduct.find({
        product_name : productNames,variants:variantNames
      });
      // const existingBarcodes = await MasterProduct.find({
      //   barcode: { $in: data.map((product) => product.barcode) },
      // });

      if (existingBarcodes.length > 0) {
        res.status(400).json({ "result": 'false', "message": 'Product already exists' });
      } else {
        // Process each product data
        const processedData = data.map((product) => {
          // Split the images string by commas to get an array of image URLs
          const imagesArray = product.images.split(',');

          // Remove the 'images' field from the original product data
          const { images, ...productData } = product;

          // Add the images array to the product data
          return { ...productData, images: imagesArray };
        });

        return MasterProduct.insertMany(processedData);
      }
    })
    .then((result) => {
      res.status(200).redirect('/public/master_product_list');
    })
    .catch((err) => {
      res.status(400).json({ result: 'false', message: err.message });
  });
}; 

/*.................upload csv vender file------------------*/
const csvfile_vender=async(req,res)=>{
    try{
        res.render('upload_csvfile_vender')
        //res.status(200).redirect("/public/csvfile/upload/vender");
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*------------------upload csv file api----------------------*/
const csvfile_upload_vender = (req, res) => {
    let shopId=''
  new Promise((resolve, reject) => {
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
    })
    .then(async (data) => {
     const productNames = data.map((product) => product.products_name);
     shopId = data.map((product) => product.shopId);
     const variantNames = data.map((product) => product.variants);
     console.log(shopId)
      const existingBarcodes = await ShopProduct.find({
        products_name : productNames,shopId:shopId,variants:variantNames
      });
     

      if (existingBarcodes.length > 0) {
        res.status(400).json({ "result": 'false', "message": 'Product already exists' });
      } else {
        // Process each product data
        const processedData = data.map((product) => {
          // Split the images string by commas to get an array of image URLs
          const imagesArray = product.images.split(',');

          // Remove the 'images' field from the original product data
          const { images, ...productData } = product;

          // Add the images array to the product data
          return { ...productData, images: imagesArray };
        });

        return ShopProduct.insertMany(processedData);
      }
    })
    .then((result) => {
        console.log(shopId)
       //res.render('upload_csvfile_vender',{'output':'shop_product add sucessfully'})
     res.status(200).redirect(`/public/product_vender_list/${shopId}`);
    })
    .catch((err) => {
      res.status(400).json({ result: 'false', message: err.message });
  });
};



/*...............shoplist api......................*/
const shop_list=async(req,res)=>{
    try{
        const data = await Vender.find({});
        res.status(200).render("shop_list",{data:data});
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*...............shoplist api......................*/
const shop_vender_list=async(req,res)=>{
    try{
        const list = await Category.find({});
        const data = await Vender.find({});   
        res.status(200).render("shop_vender_list",{list:list,data:data});
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*...............search_shop_category_list......................*/
const search_shop_category_list=async(req,res)=>{
    try{
        const Id=req.params.id;
        console.log(Id)
        const data = await Vender.find({'categoryId':Id});
        console.log(data)   
        res.status(200).render("shop_category_vender_list",{data:data});
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*................update approve status..........*/
const approveShop_status=async(req,res)=>{
    try{
        const ID=req.params._id;
        const data=await Vender.findOne({_id : ID});
        const status=data.approve_status;
        if(status===0){
             const update_data=await Vender.findByIdAndUpdate({"_id":ID},{approve_status:1},{new:true});
            res.status(200).redirect("/public/shop_list");/*json({"result":"true","message":"data updated successfully"})*/
        }else{
             const update_data=await Vender.findByIdAndUpdate({"_id":ID},{approve_status:0},{new:true});
            res.status(200).redirect("/public/shop_list");/*json({"result":"true","message":"data updated successfully"})*/
        }
        //res.redirect("/public/shop_list");
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*..................shop details......................*/
const shop_details=async(req,res)=>{
    try{
        const ID=req.params.id;
        const data=await Vender.find({_id : ID});
        res.status(200).render("shop_details",{data:data});
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*.............show_vender_manu............*/
const show_vender_manu=async(req,res)=>{
    try{
       const shopId=req.params.id;
       const data=await Vender.findById({_id : shopId});
        console.log(shopId)
        const usercount=await ShopProduct.count({"shopId":shopId});
        const a={usercount};
        const vendercount=await Order.count({"shopId":shopId});
        const b={vendercount};
        const categorycount=await Driver.count({"shopId":shopId});
        const c={categorycount};
        const ordercount=await Order.count({"shopId":shopId});
        const d={ordercount};
        const list=[a,b,c,d];
        res.status(200).render("show_vender_manu",{data:data,list:list});
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*.............push_notification_service............*/
const push_notification_service=async(req,res)=>{
   try{
        const shopId=req.params.id;
        const list=await Vender.findById({_id:shopId});
        const data=await Notification.find({"shopId":shopId,"admin_status":"0"});
        res.status(200).render("push_notification_vender_list",{list:list,data:data});
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*.............delivery_boy_vender_list............*/
const delivery_boy_vender_list=async(req,res)=>{
   try{
        const shopId=req.params.id;
        const list=await Vender.findById({_id:shopId})
        const data=await Driver.find({"shopId":shopId});
        res.status(200).render("delivery_boy_vender_list",{list:list,data:data});
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*....................delete_delivery_boy_vender api............*/
const delete_delivery_boy_vender=async(req,res)=>{
    try{
        var Id=req.params.id;
        Id = new mongoose.Types.ObjectId(Id)
        const data_delete=await Driver.findByIdAndDelete({"_id":Id});
        res.status(200).redirect(`/public/delivery_boy_vender_list/${data_delete.shopId}`);/*json({"result":"true","message":"data deleted sucessfully"})*/
        //res.status(200).render("push_notification_vender_list");
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*.............product_vender_list............*/
const product_vender_list=async(req,res)=>{
   try{
        const shopId=req.params.id;
        const list=await Vender.findById({_id:shopId})
        const data=await ShopProduct.find({"shopId":shopId});
        res.status(200).render("product_vender_list",{list:list,data:data});
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*----------------------------update vender product status api-----------------*/
const update_vender_product_status=async(req,res)=>{
    try{
        const productId=req.params.id;
        const data=await ShopProduct.findOne({"_id":productId});
        const status=data.act_status;
        console.log(status)
        if(status===0){
            const update_data=await ShopProduct.findByIdAndUpdate({"_id":productId},{act_status:1},{new:true});
            res.status(200).redirect(`/public/product_vender_list/${data.shopId}`);/*json({"result":"true","message":"data updated successfully"})*/
        }else{
            const update_data=await ShopProduct.findByIdAndUpdate({"_id":productId},{act_status:0},{new:true});
            res.status(200).redirect(`/public/product_vender_list/${data.shopId}`);
        }
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*-------------------------------update vender product api-----------------------------*/
const update_vender_product=async(req,res)=>{
    try{
        const {mrp_price,sale_price,gst,description}=req.body;
        const productId=req.params.id;
        const data=await ShopProduct.findById({_id: productId});
        const Image=[];
        for (var i = 0; i <req.files.length; i++) {
            Image[i]=req.files[i].filename;
        }
        var data_record;
        if(data){
            if(Image.length>0){
                 data_record={
                    mrp_price,sale_price,gst,description,images:Image
                }
            }else{
                const tt= Number(mrp_price - sale_price);
                const dt=Number(tt/100);
                 data_record={
                    mrp_price,sale_price,gst,discount:dt,description
                } 
            }
            const update_data=await ShopProduct.findByIdAndUpdate({"_id":productId},(data_record),{new:true});
            const dashing=await update_data.save();
            res.status(200).redirect(`/public/product_vender_list/${data.shopId}`);
        }else{
            res.status(400).json({"result":"false","message":"data does not found"});
        }
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*.............shop_vender_banner_list...........*/
const shop_vender_banner_list=async(req,res)=>{
   try{
        const shopId=req.params.id;
        const list=await Vender.findById({_id:shopId});
        const data=await ShopBanner.find({"shopId":shopId});
        res.status(200).render("shop_vender_banner_list",{list:list,data:data});
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*....................delete_push_notification_vender api............*/
const delete_push_notification_vender=async(req,res)=>{
    try{
        var Id=req.params.id;
        Id = new mongoose.Types.ObjectId(Id)

        const data_delete=await Notification.findByIdAndDelete({"_id":Id});
        res.status(200).redirect(`/public/push_notification_service/${data_delete.shopId}`);/*json({"result":"true","message":"data deleted sucessfully"})*/
        //res.status(200).render("push_notification_vender_list");
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*..................user qr details......................*/
const user_qr_details=async(req,res)=>{
    try{
        const shopId=req.params.id;
        const list=await Vender.findById({_id:shopId})
        const data=await QRCode.find({shopId : shopId}).populate('userId');
        res.status(200).render("user_qr_list",{list:list,data:data});
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*..................report_vender_details......................*/
const report_vender_details=async(req,res)=>{
    try{
        const shopId=req.params.id;
        const list=await Vender.findById({_id:shopId});
        const data=await Order.find({shopId : shopId}).populate('userId');
        res.status(200).render("report_vender_list",{list:list,data:data});
    }catch(err){
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*-----------------------------------edit_vender_product----------------------*/
const edit_vender_product=async(req,res)=>{
    try{
        const productId=req.params.id;
        const data=await ShopProduct.findById({"_id":productId});
        res.status(200).render("edit_vender_product",{"result":"true",data:data});
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*.................order_vender_details api..............*/
const order_vender_details = async (req, res) => {
    try {
        const shopId=req.params.id;
        const list=await Vender.findById({_id:shopId});
        const data = await Order.find({shopId : shopId}).populate('userId').populate('addressId').populate('shopId').populate({
                path:'cartId',
                populate: {
                    path: 'products.productId', 
                },
            });
               
        res.status(200).render("order_vender_list",{ "result": 'true', "message": "order list",list:list, data:data});   
    } catch (error) {
        res.status(400).json({ "result": "false", "message": error.message });
    };
};

/*............vender_setting_details..............*/
const vender_setting_details=async(req,res)=>{
    try{
        const shopId=req.params.id;
        console.log(shopId)
        const data=await Vender.findById({_id:shopId});
        res.status(200).render("vender_setting",{data:data});
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*----------------------------add_vender_commission api-----------------*/
const add_vender_commission=async(req,res)=>{
    try{
        const { commission } = req.body;
        const shopId=req.params.id;
        const data=await Vender.findById({_id:shopId});

        const update_data=await Vender.findByIdAndUpdate({_id:shopId},{$set:{commission:commission}},{new:true});
        res.status(200).redirect(`/public/shop_vender_menu/${shopId}`);
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*............send_notification..............*/
const send_notification=async(req,res)=>{
    try{

        res.status(200).render("send_notification");
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*................all_send_notification..........*/
const all_send_notification = async (req, res) => {
    try {
        const { title, description, type } = req.body;

        let data;

        if (type === 'All') {
            const user = await User.find({});
            const vender = await Vender.find({});

            data = [...user, ...vender];
        } else if (type === 'User') {
            data = await User.find({});
        } else if (type === 'Vender') {
            data = await Vender.find({});
        } else {
            // Handle other types if needed
            return res.status(400).json({ "result": "false", "message": "Invalid user type" });
        }

        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const user = data[i];
                const fcm_id = user.fcm_id;

                const token = [fcm_id];

                const payload = {
                    notification: {
                        title: title,
                        body: description,
                        image:`http://103.104.74.215:3026/uploads/${req.file.filename}`
                    },
                    data :{
                       image:`http://103.104.74.215:3026/uploads/${req.file.filename}`
                    }
                };

                const options = {
                    priority: "high",
                    timeToLive: 60 * 60 * 24
                };

                try {
                    await admin.messaging().sendToDevice(token, payload, options);
                    console.log(`Successfully sent message to ${type} with FCM ID:`, fcm_id);   
                } catch (error) {
                    console.log(`Error sending message to ${type} with FCM ID:`, fcm_id, "Error:", error);
                }
            }
               const notification = new Notification({ title: title, notification: description, type: type,image:req.file.filename,admin_status:"1" });
               await notification.save();
            res.status(200).redirect("/public/push_messaging_service");
        } else {
            res.status(400).json({ "result": "false", "message": `No ${type}s found` });
        }

    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};


/*............send_notification_vender..............*/
const send_notification_vender=async(req,res)=>{
    try{
        const shopId = req.params.id;
        const data = await Vender.findById({_id:shopId});
        res.status(200).render("send_notification_vender_list",{"message":'',data:data});
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*................all_send_notification_vender..........*/
const all_send_notification_vender = async (req, res) => {
    try {
        const { title, description } = req.body;
        const shopId = req.params.id;

        let data;
        const user = await QRCode.find({'shopId':shopId}).populate('userId');
        data = [...user];
       
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const user = data[i];
                const fcm_id = user.userId.fcm_id;

                const token = [fcm_id];

                const payload = {
                    notification: {
                        title: title,
                        body: description,
                        image:`http://103.104.74.215:3026/uploads/${req.file.filename}`
                    }
                };

                const options = {
                    priority: "high",
                    timeToLive: 60 * 60 * 24
                };

                try {
                    await admin.messaging().sendToDevice(token, payload, options);
                    console.log(`Successfully sent message to  with FCM ID:`, fcm_id);   
                } catch (error) {
                    console.log(`Error sending message to with FCM ID:`, fcm_id, "Error:", error);
                    
                }
            }
               const notification = new Notification({ shopId,title: title, notification: description, image:req.file.filename,admin_status:"0" });
               await notification.save();
            res.status(200).redirect(`/public/push_notification_service/${shopId}`);
        } else {
            //res.status(400).json({ "result": "false", "message": 'No data found' });
            res.status(400).redirect(`/public/send_notification/${shopId}`,{'message':'No data found'});
        }

    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};



/*................create shopcategory................*/
const shopcategory=async(req,res)=>{
    try{
        const {categoryId,category_image,subcategory}=req.body;
        if(!categoryId || !subcategory || !req.file){
            res.status(400).json({'result':"false","message":"require parameter are categoryId,category_image,subcategory"});
        }else{
            const data= new Shopcategory({categoryId,category_image:req.file.filename,subcategory});
            await data.save();
            res.status(200).redirect("/public/subcategory_list"/*{"result":'true',"message":"data insert successfully",data:data}*/);
        }
    }catch(error){
        res.status(400).json({"result":"false","message":error.message})
    }
};


/*.................shopcategory_list api..............*/
const shopcategory_list = async (req, res) => {
    try {
        const data = await Shopcategory.find({});
        res.status(200).render("subcategory",{ "result": 'true', "message": "shop subcategory list", data:data});   
    } catch (error) {
        res.status(400).json({ "result": "false", "message": error.message });
    };
};


/*.............create supcategory_page..............*/
const createsubcategory_page=async(req,res)=>{
    try{
        const data=await Shopcategory.find({});
        const result=await Category.find({});
        res.render("create_subcategory",{"result":"true",data:data,result});
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*................update subcategory page..............*/
const updateSubategory=async(req,res)=>{
    try{
        const categoryId=req.params.categoryId;
        const {subcategory}=req.body;
        const dinesh=await Shopcategory.findOne({"_id":categoryId});
        if(dinesh){
            if(req.file){
                var datarecord={
                    subcategory,
                    category_image:req.file.filename
                }
            }else{
                var datarecord={
                    subcategory
                }
            }
            const data=await Shopcategory.findByIdAndUpdate({"_id":categoryId},(datarecord),{new:true});
            const dinu=await data.save();
            res.status(200).redirect("/public/subcategory_list");
        }else{
            res.status(400).json({"result":'false',"message":"data does not found"})
        }
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};



/*................update subcategory....................*/
const updateSubategory_page=async(req,res)=>{
    try{
        const categoryId=req.params.categoryId;
        const data=await Shopcategory.findById({"_id":categoryId});
        res.status(200).render("update_subcategory",{"message":"updated list are",data:data})
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*................push notification ....................*/
const push_notification=async(req,res)=>{
    try{
        const data = await Notification.find({admin_status:"1"})
        res.status(200).render("push_notification",{data:data})
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*....................delete_push_notification api............*/
const delete_push_notification=async(req,res)=>{
    try{
        const notificationId=req.params.id;
        const data=await Notification.findByIdAndDelete({_id:notificationId});
        //res.status(200).render("push_notification");
         res.status(200).redirect("/public/push_messaging_service");
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};


/*.................order_list api..............*/
const order_list = async (req, res) => {
    try {
        const data = await Order.find({}).populate('userId').populate('addressId').populate('shopId').populate({
                path:'cartId',
                populate: {
                    path: 'products.productId', 
                },
            });;
               
        res.status(200).render("order_list",{ "result": 'true', "message": "order list", data:data});   
    } catch (error) {
        res.status(400).json({ "result": "false", "message": error.message });
    };
};

/*.................edit order api..............*/
const edit_order = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Order.findById({'_id':id});
        res.status(200).render("edit_order",{ "result": 'true', "message": "edit_order", data:data});   
    } catch (error) {
        res.status(400).json({ "result": "false", "message": error.message });
    };
};

/*-----------------order status page----------------------------*/
const updateOrderStatus=async(req,res)=>{
    const id=req.params.id;
    const order_status=req.body.order_status;
    try{
        const data = await Order.findByIdAndUpdate({"_id":id},{$set:{order_status},new:true});
        res.redirect('/public/order_list');
    }catch(error){
        res.status(400).json({ message:error.message})
    }
};

/*....................order delete api............*/
const deleteOrder=async(req,res)=>{
    try{
        const id=req.params.id;
        const data = await Order.findByIdAndDelete({"_id":id});
        res.status(200).redirect("/public/order_list");
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }
};

/*.................transaction_report_list..............*/
const transaction_report_list = async (req, res) => {
    try {
        const vendercount=await Vender.count({});
        const a={vendercount};
        const list=[a];
        const orders = await Order.find({}); 
        var total_amount = 0;
        for (const order of orders) {
            const grandTotal = order.grand_total;
            total_amount += grandTotal;
        }
        console.log(total_amount)
        const data = await Order.find({}).populate('userId').populate('shopId').populate({
                path:'cartId',
                populate: {
                    path: 'products.productId', 
                },
            });
        res.status(200).render("transaction_report_list",{list:list,total_amount:total_amount,data:data});   
    } catch (error) {
        res.status(400).json({ "result": "false", "message": error.message });
    };
};

/*.................refund_report_list..............*/
const refund_report_list = async (req, res) => {
    try {
        const data = await Transaction.find({});
        res.status(200).render("refund_transaction_list",{data:data});   
    } catch (error) {
        res.status(400).json({ "result": "false", "message": error.message });
    };
};



/*.................deliver_boy_list api..............*/
const delivery_boy_list = async (req, res) => {
    try {
        const data = await Driver.find({});
        res.status(200).render("delivery_boy_list",{ "result": 'true', "message": "order list", data:data});   
    } catch (error) {
        res.status(400).json({ "result": "false", "message": error.message });
    };
};

/*....................delivery boy delete api............*/
const deliveryboyDelete=async(req,res)=>{
    try{
        const Id=req.params.id;
        const data_delete=await Driver.findByIdAndDelete({"_id":Id});
        res.status(200).redirect("/public/delivery_boy_list");/*json({"result":"true","message":"data deleted sucessfully"})*/
    }catch(err){
        console.log(err.message);
        res.status(400).json({"result":"false","message":err.message});
    }

};

/*.................payment_list api..............*/
const payment_list = async (req, res) => {
    try {
        const data = await Order.find({});
        res.status(200).render("payment_list",{ "result": 'true', "message": "order list", data:data});   
    } catch (error) {
        res.status(400).json({ "result": "false", "message": error.message });
    };
};

 /*..................product details......................*/
const product_details = async (req, res) => {
    console.log("product detail hitted");
    try {
        const ID = req.params.id;

        const data = await shopproduct_models.find({ shopId: ID });
       
        res.status(200).render("vp_details", { data: data });
    } catch (err) {
        res.status(400).json({ "result": "false", "message": err.message });
    }
};
 
/*..................create service charge......................*/
const createServiceCharge = async (req, res) => {
    try {
        res.render('add_service_charge',{msg:''})
    } catch (error) {
        console.log(error)
        res.status(500).json({ result: "false", msg: "Internel Server Error" })
    }
}

 /*..................create service charge......................*/
const addServiceCharge = async (req, res) => {
    try {
        const { service_charge } = req.body
        const result = await Vender.updateMany({}, { $set: { service_charge } });
        res.render('add_service_charge',{msg:"Service Charge Add Successfull"})
    } catch (error) {
        console.log(error)
        res.status(500).json({ result: "false", msg: "Internel Server Error" })
    }
}



/*..................export module.................*/
module.exports={

    AdminLogin_page,
    AdminLogin,
    indexPage,
    AdminLogout,
/*---------------Banner----------*/
    createBanner,
    createBanner_page,
    BannerList,
    Banner_update,
    bannerUpdate,
    bannerDelete,
    updateBanner_status,
/*--------------Category----------*/
    createCategory,
    create_categoryPage,
    category_list,
    updateCategory,
    updateCategory_page,
    updateCategory_status,
/*...............Master Product......*/
    createMaster_product,
    MasterProduct_list,
    createProduct_page,
    updatemaster_product_status,
    updatemaster_product_page,
    updatemaster_product,
 /*---------------users----------------*/
    userList,
    userDetails,
    userDelete,
/*--------------faq---------------------*/
    faqlist,
    updatefaq,
    Updatefaq,
/*-----------------term-------------------*/
    termlist,
    updateTerm,
    UpdateTerm,
/*---------------privacy policy--------------*/
    pollicylist,
    updatepollicy,
    UpdatePollicy,
/*-----------------client contactus-----------*/
    contactus_list,
    updatecontact,
    Updatecontact,

/*-----------------csv file-----------------------*/
    csvfile,
    csvfile_upload,

/*.....................shop list................*/
    shop_list,
    approveShop_status,
    shop_details,
    show_vender_manu,
    shop_vender_list,

/*.....................shop category..............*/
    shopcategory,
    shopcategory_list,
    createsubcategory_page,
    updateSubategory,
    updateSubategory_page,
    getSubCategory,

/*.....................push notification..............*/
    push_notification,
    send_notification,
    all_send_notification,
    delete_push_notification,

/*.....................order_list..............*/
    order_list,
    edit_order,
    updateOrderStatus,
    deleteOrder,
/*.....................delivery_boy_list..............*/
    delivery_boy_list,
    deliveryboyDelete,
/*.....................payment_list..............*/
    
    payment_list,


/*.....................transaction_report_list..............*/
    transaction_report_list,
    refund_report_list,

/*.....................service charge ..............*/
    createServiceCharge,
    addServiceCharge,

/*.....................vender_product_list..............*/
     product_details,
     push_notification_service,
     delivery_boy_vender_list,
     product_vender_list,
     shop_vender_banner_list,
     delete_push_notification_vender,
     csvfile_vender,
     csvfile_upload_vender,
     user_qr_details,
     report_vender_details,
     order_vender_details,
     edit_vender_product,
     delete_delivery_boy_vender,
     update_vender_product_status,
     update_vender_product,
     search_shop_category_list,
     vender_setting_details,
     add_vender_commission,
     send_notification_vender,
     all_send_notification_vender
    
};

