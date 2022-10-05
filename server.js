const express =require('express');
const path=require('path')
const mongoose=require('mongoose')
const cors =require('cors');
const morgan=require('morgan')
const session=require('express-session');
const app=express();
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Credentials', true);
        return res.status(200).json({});
    }
    next();
});
require('dotenv').config()
const multer =require('multer')
const mongoDb_Store_Session=require('connect-mongodb-session')(session)
const Store =new mongoDb_Store_Session({
   uri:process.env.MONGO_DB_URL,
   collection:"sessions",
   Cookie:{maxAge:1200}
})
app.use(express.urlencoded({extended:true}))
const fileStorage=multer.diskStorage({
   destination:(req,file,cb)=>{
       cb(null,'images/')
   },
   filename:(req,file,cb)=>{
     cb(null,Date.now()+'-'+file.originalname)
   }
})
const filterImages=(req,file,cb)=>{
   if(file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'){
      cb(null,true)
   }else {
      cb(null,false)
   }
}
app.use(multer({storage:fileStorage}).single('file'))
const port=process.env.PORT;
app.use(express.json())
app.use(morgan('combined'))
app.use('/images', express.static(path.join(__dirname,'images')))
app.use(
  session({
    secret: "dkke4j3id8f8eicd",
    resave: false,
    saveUninitialized: false,
    store: Store,
  })
);
const postRouter=require('./routes/post.router')
const userRouter=require('./routes/user.routes')
const authRouter=require('./routes/auth.router')
 app.use((req,res,next)=>{
   if(req.session.isLoggedIn){
      req.user=req.session.user
   }
  next()
 })
app.use('/user',userRouter)
app.use(postRouter)
app.use(authRouter)
app.use((error,req,res,next)=>{
   if(!error.statusCode){
      error.statusCode=500
   }
   res.status(error.statusCode).json({message:error.message})
})
 mongoose.connect(process.env.MONGO_DB_URL).then(()=>{
  console.log('connection successfully established')
  app.listen(port,()=>{
    console.log('server is running on ',port)
 })}).catch((err)=>{
  console.log(err)
 })
