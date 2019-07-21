const mongoose = require('mongoose')
const passportLocalmongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema ({
    username : {
        type: String,
        required : true,
        trim: true
    },
    password : String,
    address: [{
        address:{
            type: String,
            trim: true,
        }
    }]
})

userSchema.virtual('barang2',{
    ref:"barang2",
    localField:'_id',
    foreignField:'owner'
})

userSchema.plugin(passportLocalmongoose)

const User = mongoose.model('User',userSchema)

module.exports = User