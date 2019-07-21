const express = require('express')
const {isLogin} = require('../middleware/auth')
const Transaksi = require('../models/transaksi')
const Barang = require('../models/barang2')
const router = new express.Router()

router.post("/barang2/:id/beliSementara",isLogin, async(req,res)=>{
    const barang = await Barang.findById({_id:req.params.id})
    try{
    const transaksi = {
        name:barang.name,
        avatar: barang.avatar,
        jumlah: req.body.jumlah,
        harga:barang.harga,
        totalHarga:barang.harga*req.body.jumlah,
        pembeli:req.user.id
    }

    const transaksi2=await Transaksi.create(transaksi)
    res.redirect(`/barang2/transaksi/${transaksi2.id}`)
    
    } catch(e) {
        console.log(e)
    }
    
})

router.get("/barang2/transaksi/:id", isLogin, async(req,res)=>{
    const transaksi = await Transaksi.findById({_id:req.params.id})
    const buffer = Buffer.from(transaksi.avatar).toString('base64')
    res.render("checkout",{transaksi,buffer})
})

router.post('/barang2/:id/transaksi',async(req,res)=>{
    const transaksi = new Transaksi(req.body)

    try {
        await transaksi.save()
        res.status(201).send()
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/barang2/:id/transaksi',async(req,res)=>{
    try {
        const transaksi = await Transaksi.findById({_id})
        res.send(transaksi)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/barang2/:id/transaksi', async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','stok','harga','terjual']
    const isValid = updates.every((update)=>{
        allowedUpdates.includes(update)
    })

    if(!isValid){
        return res.status(404).send()
    }

    try{
        const transaksi = await Transaksi.findByIdAndUpdate(req.params.id,req.body,
            {
                new:true,
                runValidators:true
            }
        )

        if(!transaksi){
            return res.status(404).send()
        }

        res.send(barang)
    } catch(e) {
        res.status(404).send()
    }
})

module.exports = router