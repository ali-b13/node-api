const express=require('express');
const router=express.Router();
const authController=require('../controllers/auth.controller')
// Login Post 

router.post('/register',authController.signUp)
router.post('/login',authController.login);
router.get('/logout',authController.signOut)
module.exports=router;