// create admin auth file
const isLogin=async(req,res,next)=>{
	try{
		if(req.session.user_id){}
			else{
				res.redirect("/public/admin_login");
			}
			next();

	}catch(error){
		console.log(error.message)
	}

};



//create logout auth
const isLogout =async(req,res,next)=>{
	try{
		if(req.session.user_id){
			res.redirect("/public/index");
		}next();

	}catch(error){
		console.log(error.message)
	}

};


// export module
module.exports={
	isLogout,
	isLogin
}