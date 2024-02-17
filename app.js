// import dependancies in app.js fiel
const express=require("express");
const app=express();
const multer = require("multer");
const ejs =require('ejs');
const path = require('path');
const fs = require("file-system");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app_routes=require("./routes/app_routes");
const admin_routes=require("./routes/admin_routes");
const vender_routes=require("./routes/vender_routes");
const driver_routes=require("./routes/driver_routes");



// middlewere setup
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
const filePath = path.join(__dirname, '/uploads');
app.set(path.join(__dirname, '/uploads'));
app.engine('html', require('ejs').renderFile);


//create middlewere
app.use(express.json());
app.use(cookieParser());
app.use(session({secret:'my fdgfghbshanky',saveUninitialized: true,resave: true}));
//body parser using
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());


//setup routes
app.use("/needoo/api",app_routes);
app.use("/public",admin_routes);
app.use("/needoo/digital",vender_routes);
app.use("/needoo/digital/api",driver_routes);



//error handler
app.use((err,req,res,next)=>{res.status(404).json({
    error:err.message})
});

module.exports = app;
