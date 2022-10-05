const User=require('../models/User');
const bcrypt=require('bcryptjs');
const { default: mongoose } = require('mongoose');
exports.getUser=async(req,res,next)=>{
  const userId=req.query.userId;
  const username=req.query.username
  console.log(userId,'user id')
  console.log(username,'user name')
  try {
        const user =userId? await User.findById(userId): await User.findOne({username:username})
        const {password,updatedAt,isAdmen,...others}=  user._doc
      res.status(201).json({user:others,message:'user exists'})
  } catch (err) {
    err.message="No user exists";
      err.statusCode=404;
      next(err)
  }
}

exports.updateUser= async(req,res,next)=>{
  const userId=req.params.userId
  if(req.user?._id.toString()===userId.toString()){
   if(req.body.password){
    try {
      const salt= await bcrypt.genSalt(12)
        req.body.password=await bcrypt.hash(req.body.password,salt)
    } catch (error) {
      res.status(404).json('can not update password')
    }
   }
    User.findOneAndUpdate({_id:userId},{$set:req.body}).then(user=>{
         User.findById(user._id).then(user=>{
          res.status(201).json({user:user,message:"successfully updated a user"})
         })
    }).catch(err=>{
      err.statusCode=404;
      err.message=" Could not find a user"
      next(err)
    }) 
  }else {
     res.status(404).json({message:'You only can update your account'})
  }
}

exports.deleteUser=(req,res,next)=>{
  const userId=req.params.userId;
  if(req.session.user?._id.toString() ===userId.toString()){

     User.findByIdAndDelete(userId).then(()=>{
      req.session.destroy(()=>{
        res.status(202).json({message:"user deleted"})
      })
     }).catch(err=>{
        err.statusCode=422;
        err.message="You can not delete ";
        next(err)
     })
    }else {
      res.status(422).json({message:"Can not perform such an action"})
    }
}

exports.followUser=async(req,res,next)=>{
   const userId=req.params.userId;
   console.log(userId,'user id'),
   console.log('followers id',req.body.userId)
   if(userId){
      
    try {
       const follower =await User.findById(userId);
       const user=await User.findById(req.body.userId)
       console.log(user)
       if(!user.followers.includes(follower._id)){
       await  user.updateOne({$push:{followers:userId}});
       await follower.updateOne({$push:{followings:user._id}})
      
         res.status(202).json({message:"You follow a user"})
       }else {
         res.status(200).json({message:"You already follow this user"})
       }

    } catch (err) {
       err.statusCode=422;
       err.message="you cant follow yourself";
       next(err)
    }
   } else {
    res.status(422).json({message:"you cant follow yourself"})
   }
}

exports.unFollowUser=async(req,res,next)=>{
   const userId=req.params.userId;
  console.log(userId,'follower ')
   console.log(req.body.userId,'user ')
   if(userId){
    try {
       const follower =await User.findById(userId);
       const user=await User.findById(req.body.userId)
       console.log(user,'user')
       if(user?.followers.includes(follower._id)){
       await  user.updateOne({$pull:{followers:userId}});
       await  follower.updateOne({$pull:{followings:user._id}})
        
         res.status(202).json({message:"You unfollow a user"})
       }else {
         res.status(200).json({message:"You already unfollow this user"})
       }

    } catch (err) {
       err.statusCode=422;
       next(err)
    }
   } else {
    res.status(422).json({message:"problem occured"})
   }
 
}

exports.userFriends=async(req,res,next)=>{
  const userId=req.params.userId;
    try {
      const user =await User.findById(userId);
        const friends=await Promise.all(
          user.followers.map(friend=>{
            return  User.findById(friend).then(user=>{
               const{password,createdAt ,updatedAt,email,isAdmen,...others}=user._doc;
              return others
            })
             
          })
        )
        
        console.log(friends,'friends')
        res.status(200).json({message:'all friends',friends:friends})
    } catch (error) {
      error.statusCode=500;
      error.message='no such friends'
    }
}