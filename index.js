const express=require("express")
const session = require('express-session')
const dbConnect = require("./config/dbConnect")
const app=express()
const dotenv=require('dotenv').config()
const PORT=process.env.PORT || 7000
dbConnect()

const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')

app.set("view engine","ejs")

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