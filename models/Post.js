const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Post =new Schema({
  content:{type:String ,max:200},
  userId:{
    type:mongoose.Types.ObjectId,
    required:true
  },
  image:{type:String ,default:''},
  video:{type:String ,default:''},
  comments:[{userId:{type:mongoose.Types.ObjectId},comment:String}],
  likes:{type:Array,default:[]}

},{timestamps:true})

module.exports= mongoose.model('post',Post);
