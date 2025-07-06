const express=require('express')
const mongoose=require('mongoose')
const isLoggedIn = require('../middleware/isLoggedIn')
const isAdmin = require('../middleware/isAdmin')
const router=express.Router()

router.get("/admin",isLoggedIn,isAdmin,(req,res)=>{
    res.json({ message: "Welcome to admin dashboard", user: req.session.user });
})

router.get("/user",isLoggedIn,(req,res)=>{
    res.json({ message: `Welcome ${req.session.user.username}` });
})

module.exports = router;