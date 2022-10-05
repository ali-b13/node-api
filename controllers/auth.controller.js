const User=require('../models/User')
const bcrypt=require('bcryptjs')
exports.signUp=(req,res,next)=>{
  User.findOne({username:req.body.username}).then(user=>{

    if(user){
      console.log('error occurred')
      const error =new Error('username Already taken');
      error.statusCode=422;
      throw error
    }
     bcrypt.hash(req.body.password,12).then(hashedPassword=>{
  
      const addUser=new User(
        {fullName:req.body.fullName,
          username:req.body.username,
          password:hashedPassword,
          mobile_No:req.body.mobile_No,
          email:req.body.email
      })
      addUser.save().then(user=>{
        const{createdAt,password,__v,isAdmen,updatedAt,...others}=user._doc
        res.status(201).json({user:others,message:"successfully created user"})
      })
    })
  }).catch(err=>{
    if(!err.statusCode){
      err.statusCode=500;
      err.message=err.message
     
    }
     next(err)
  })
}
exports.login=(req,res,next)=>{

  console.log(req.body)
  User.findOne({email:req.body.email}).then(user=>{
    if(user){
      const password=req.body.password;
      bcrypt.compare(password,user.password).then(isEqual=>{
        console.log(isEqual)
        if(isEqual){
          req.user=user
          req.session.isLoggedIn=true
          req.session.user=user;
          const{isAdmen,password,createdAt,updatedAt,__v,...insensitiveInfo}=req.session.user._doc;
          res.status(200).json({message:"successfully login",user:insensitiveInfo})
        }else {
          const error=new Error('Invalid credentials');
          error.statusCode=422;
          next(error)

        }
      })
    }else {
      console.log('error in catch')
        const error=new Error('No Such Account');
         error.statusCode=422;
         throw error;
    }
  }).catch(err=>{
    if(!err.statusCode){
      err.statusCode=422;
    }
    next(err)
  })
}


exports.signOut=(req,res,next)=>{
  req.session.destroy(()=>{
    console.log('session destroyed')
    res.status(200).json({message:'You logged out'})
  })
  

}