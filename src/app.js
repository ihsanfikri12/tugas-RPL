const express = require('express')
const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const User = require('./models/user2')
const methodOverride = require('method-override')
require('./db/mongoose')

// const userRouter = require('./router/user2')
// const barangRouter = require('./router/barang')
const barangRouter = require('./router/barang2')
const userRouter = require('./router/user2')
const transakiRouter = require('./router/transaksi')
// const index = require('./router/index')

const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../views')
// const partialsPath = path.join(__dirname,'../views/partials')

const app = express()

app.set('view engine','ejs')
app.set('views', viewsPath)

app.use(session({
    secret: "my dream can not be real",
    resave: false,
    saveUnintialized: false
}))

app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(express.urlencoded())
app.use(methodOverride('_method'))
// app.use(formidableMiddleware())
// app.use(busboy())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    next()
})

// app.use(userRouter)
// app.use(index)
// app.use(barangRouter)
app.use(barangRouter)
app.use(userRouter)
app.use(transakiRouter)

module.exports = app