const express=require('express');
const router=express.Router();
const userController=require('../controllers/user.controller')
// GET A USER
router.get('/userInfo',userController.getUser)
// UPDATE A USER 
router.put('/update/:userId',userController.updateUser)
// DELETE A USER 
router.delete('/:userId',userController.deleteUser)
// FOLLOW A USER
router.put('/:userId/follow',userController.followUser)
// UnFOLLOW  A USER 
router.put('/:userId/unfollow',userController.unFollowUser)
// GET friends 
router.get('/:userId/friends',userController.userFriends)
module.exports=router;