const mongoose = require('mongoose')

const barang2Schema = {
    name: {
        type: String,
        required:true,
        trim:true
    },
    stok: {
        type: Number,
        required: true,
        trim:true
    },
    harga:{
        type: Number,
        required: true,
        trim:true
    },
    terjual:{
        type: Number,
        trim:true,
        default : 0
    },
    avatar: {
        type: Buffer
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}

const barang = mongoose.model('barang2',barang2Schema)

module.exports = barang