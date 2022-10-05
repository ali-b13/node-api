const Post=require('../models/Post');
const User = require('../models/User');

// adding a post for a user
exports.addPost=async(req,res,next)=>{
  // const userId= req.session.user._id;
  // req.body.userId=userId
  console.log('file received',req.file)
  console.log(req.body)
  try {
     const post = new Post({content:req.body.content,userId:req.body.userId,video:req.file?.mimetype=='video/quicktime'||req.file?.mimetype=='video/mp4'?req.file?.path:'',
     image:req.file?.mimetype=='image/png'||req.file?.mimetype=='image/jpg'||req.file?.mimetype=='image/jpeg'?req.file?.path:''
    })
    const savePost= await post.save()
    res.status(202).json({message:"Successfully created a post",post:savePost})
  } catch (error) {
    error.statusCode=500;
    next(error)
  }
 }
// updating a post using the method put
exports.updatePost=async(req,res,next)=>{
  const postId =req.params.postId;
  
    try {
     const post = await Post.findById(postId);
    if(post){
        if(req.session.user._id.toString()===post.userId.toString()){

       await  post.updateOne({$set:req.body});
       res.status(202).json({message:"successfully updated a post",post:post})
     }else {
      res.status(404).json({message:"You can not update this account"})
     }
    } else {
      const error=new Error('No id with this account');
      error.statusCode=404;
      throw error
    }
  } catch (error) {
    error.message="No Account with this id"
    error.statusCode=500;
    next(error)
  }
}
exports.getFriendsPost=async(req,res,next)=>{
   try {
    const currentUser = await User.findById(req.params.userId)
      if(currentUser){
       const currentUserPost = await Post.find({userId:currentUser._id});
        const friendsPosts=await Promise.all(
          currentUser.followers.map(friendId=>{
          return  Post.find({userId:friendId})
          })
        )
        res.status(200).json({message:'all posts you follow',posts:currentUserPost.concat(...friendsPosts)})
      }else {
         error.statusCode=404;
    error.message='no posts'
    next(error)
      }
   } catch (error) {
    error.statusCode=500;
    error.message='no posts'
    next(error)
   }
}
exports.getSinglePost=async(req,res,next)=>{
  const postId= req.params.postId;
     Post.findById(postId).then(post=>{

       res.status(200).json({message:"single post",post:post})
     })
}

exports.deletePost=async(req,res,next)=>{
  const postId =req.params.postId;
  try {
      const post=await Post.findById(postId);
      if(post){
        if(post.userId.toString()===req.session.user._id.toString()){
       const postSaved= await post.deleteOne({_id:post._id})
       res.status(202).json({message:'deleted successfully ',post:postSaved})
          
        }else {
          const error=new Error('No Account to perform this operation');
          error.statusCode=404;
          next(error)
        }
      }

  } 
  catch (error) {
    error.statusCode=404;
    error.message='No Post Exists'
    next(error)
  }
}

exports.getUserRelatedPosts=async(req,res,next)=>{
  const username =req.params.username;
  console.log(username)
    try {
       const currentUser=await User.findOne({username:username});
       console.log(currentUser)
       const userPosts=await Post.find({userId:currentUser._id})
       console.log(userPosts)
       res.status(200).json({message:'user posts',posts:userPosts})
    } catch (error) {
      error.statusCode=404;
      error.message='no posts'
      next(error)
    }
}
exports.postLikes=async(req,res,next)=>{
  const postId =req.params.postId;
  console.log(req.body)
  console.log('post id',postId ,'and user id is',req.body.id)
   try {
       const post =await Post.findById(postId);
       if(post){
         console.log('right you there')
          if(!post.likes.includes(req.body.id)){
          const savedPost=  await post.updateOne({$push:{likes:req.body.id}});
          
          res.status(202).json({message:'you liked this post',post:post.likes})
          }else {
            await post.updateOne({$pull:{likes:req.body.id}});
            res.status(202).json({message:"you  disLiked this post",post:post.likes})
          }

        }else {
          const error =new Error('No id for this post');
          error.statusCode=404;
          next(error)
        }
       } catch (error) {
    error.statusCode=404;
    error.message=' post not found '
    next(error);
   }
}