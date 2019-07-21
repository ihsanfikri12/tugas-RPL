const jwt = require('jsonwebtoken')
const User = require('../models/user')
const multer = require('multer')

// const auth = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '')
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
//         if (!user) {
//             throw new Error()
//         }

//         req.token = token
//         req.user = user
//         next()
//     } catch (e) {
//         res.status(401).send({ error: 'Please authenticate.' })
//     }
// }

const isLogin = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

const upload = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

module.exports = {isLogin,upload}