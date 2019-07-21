const mongoose = require('mongoose')

const barangSchema = {
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}

const barang = mongoose.model('barang',barangSchema)

module.exports = barang