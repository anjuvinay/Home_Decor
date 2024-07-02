const express=require("express")
const session = require('express-session')
const dbConnect = require("./config/dbConnect")
const app=express()
const dotenv=require('dotenv').config()
const PORT=process.env.PORT || 7000
const logger=require('morgan')
const path=require('path')
const methodOverride = require("method-override");
const multer = require('multer')
dbConnect()

const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')



app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads'); // 'uploads/' is the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Define the file name for the uploaded file (you can customize this)
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });




app.set('views', path.join(__dirname, 'views'));
app.set("view engine","ejs")



app.use(logger('dev'));
app.use(methodOverride("_method"));
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    secret:"keyboard cat",
    resave: false,
    saveUninitialized: true
}))



app.use('/', userRoute)

app.use('/admin', adminRoute)






app.listen(PORT,()=>{
    console.log(`server is running at PORT ${PORT}`)
})