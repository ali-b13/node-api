const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const User= new Schema({
  fullName:{type:String,required:true},
  username:{type:String,required:true},
  email:{type:String,required:true},
  password:{type:String,required:true},
  description:{type:String,max:120,default:''},
  city:{type:String,max:50,default:''},
  relationShip:{type:Number,enm:[1,2,3],default:0},
  from:{type:String,max:50,default:''},
  profile_pic:{type:String,default:''},
  cover_pic:{type:String,default:''},
  followers:{type:Array,default:[]},
  followings:{type:Array,default:[]},
  isAdmen:{type:Boolean,default:false},
  mobile_No:Number,
},{timestamps:true});

module.exports=mongoose.model('user',User)