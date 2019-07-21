const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const Barang = require('./barang')

const userSchema = new mongoose.Schema ({
    name : {
        type: String,
        required : true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password : {
        type: String,
        required:true,
        minlength:7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Value can not contain password')
            }
        }
    },
    phone : {
        type: Number,
        required:true,
        trim:true,
        minlength: 10,
        validate(value){
            if(value<0) {
                throw new Error("phone must be positive number ")
            }
        }
    },
    address: [{
        address:{
            type: String,
            trim: true,
        }
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
    
}
)

userSchema.virtual('barang', {
    ref: 'Barang',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token

}

userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('remove', async function (next) {
    const user = this
    await Barang.deleteMany({ owner: user._id })
    next()
})

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


const User = mongoose.model('user',userSchema)

module.exports = User
