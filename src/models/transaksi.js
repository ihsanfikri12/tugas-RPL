const mongoose = require('mongoose')

const transaksiSchema = {
    avatar: {
        type:Buffer
    },
    name: {
        required:true,
        trim:true,
        type:String
    },
    jumlah: {
        required:true,
        type: Number,
        trim: true
    },   
    harga: {
        required:true,
        type: Number,
        trim: true
    },
    totalHarga: {
        required:true,
        type: Number,
        trim: true
    },
    alamat: {
        type: String,
        trim: true
    },
    kodePembayaran:{
        type: String,
        trim: true
    },
    metodePembayaran:{
        type: String,
        trim: true
    },
    statusPengiriman: {
        type: String,
        trim: true
    },
    pembeli: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    penjual: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}

const Transaksi = mongoose.model('transaksi',transaksiSchema)

module.exports = Transaksi