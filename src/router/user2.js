const express = require('express')
const passport = require('passport')
const User = require('../models/user2')
const router = new express.Router()

router.get('/register',(req,res)=>{
    res.render('register')
})

router.post('/register',async (req,res)=>{
    const newUser = new User({username:req.body.username})
    try {
        await User.register(newUser,req.body.password)
        passport.authenticate('local')
        res.redirect('/barang2')
    } catch(e){
        console.log(e)
        res.render('register')
    }
})

router.get('/login',async(req,res)=>{
    res.render('login')
})

router.post('/login',passport.authenticate('local',
{
    successRedirect: "/barang2",
    failureRedirect:"/login"
}),(err,req,res,next)=>{
    console.log(err)
})

module.exports = router