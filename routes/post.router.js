const express=require('express');
const router=express.Router();
const postController=require('../controllers/post.controller')
//POST A POST
router.post('/posts/add-post',postController.addPost)
// PUT Update a post 
router.put('/posts/:postId',postController.updatePost)
// GET timeline Posts
router.get('/posts/:userId',postController.getFriendsPost)

// GET single Post 
router.get('/post/:postId',postController.getSinglePost);

// DELETE Post 
router.delete('/posts/:postId',postController.deletePost);

// GET User related posts
router.get('/profile/posts/:username',postController.getUserRelatedPosts)
// likes post 
router.put('/posts/:postId/likes',postController.postLikes)

module.exports=router