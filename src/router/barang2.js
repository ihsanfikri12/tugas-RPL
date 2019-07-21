const express = require('express')
const Barang = require('../models/barang2')
const sharp = require('sharp')
const {isLogin,upload} = require('../middleware/auth')

const router = new express.Router()

//done
router.get('/barang2', async(req,res)=>{
    try{
        const barang = await Barang.find({})

        const terimaBarang = []
        // const buffer = Buffer.from(barang.avatar).toString('base64')
        barang.forEach((barang)=>{
            terimaBarang.push(Buffer.from(barang.avatar).toString('base64'))
        })


        const angka = terimaBarang.length

        res.render('index',{
            terimaBarang,
            angka,
            barang
            // buffer
        })        
    } 
    catch(e){
        res.status(500).send()
    }   
})

//done
router.post('/barang2',isLogin,upload.single('avatar'),async(req,res)=>{
        
    try {
        
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        console.log(buffer)
        const barang2 = {
            name:req.body.name,
            stok:req.body.stok,
            harga:req.body.harga,
            avatar:buffer,
            owner:req.user._id
        }
        await Barang.create(barang2)

        
        
        res.redirect('/barang2')

    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/barang2/jualan', isLogin, async(req,res)=>{
    try {
        await req.user.populate('barang2').execPopulate()
        const barang2 = req.user.barang2
        const terimaBarang = []
        // const buffer = Buffer.from(barang.avatar).toString('base64')
        barang2.forEach((barang)=>{
            terimaBarang.push(Buffer.from(barang.avatar).toString('base64'))
        })


        const angka = terimaBarang.length
        const halaman = "/barang2"
        res.render('barangJualan',{
            barang2,
            terimaBarang,
            angka,
            halaman
        })
    }
    catch(e) {
        res.render('/barang2')
    }
})

//done
router.get('/barang2/jualan/create',isLogin, async(req,res)=>{
    res.render('jualBarang')
})


//done
router.get('/barang2/:id', async(req,res)=>{
    const _id = req.params.id

    try{
        const barang = await Barang.findOne({_id})
        const buffer = Buffer.from(barang.avatar).toString('base64')

        if(!barang) {
            return res.status(404).send()
        }

        res.render('product',{
            barang,
            buffer
        })
    }catch(e){
        res.status(500).send()
    }
} )

router.get('/barang2/:id/edit', isLogin, async(req,res)=>{
    const barang2 = await Barang.findOne({_id:req.params.id,owner:req.user.id})
    res.render('editBarang',{barang2})
})

router.patch('/barang2/:id',upload.single('avatar'),async(req,res)=>{
    const barang = await Barang.findOne({_id: req.params.id})
        if(!barang){
            return res.status(404).send()
        }

    if(req.file!==undefined) {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        barang.avatar=buffer
    }

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','stok','harga','terjual', 'avatar']
    const isValid = updates.every((update)=>allowedUpdates.includes(update))
    

    if(!isValid){
        return res.status(404).send()
    }

    try{
        updates.forEach((update)=>{
                barang[update] = req.body[update]
        })

        await barang.save()

        res.redirect('/barang2/jualan')
    } catch(e) {
        console.log(e)
        res.redirect('/barang2/jualan')
    }
})

router.delete('/barang2/:id', isLogin, async(req,res)=>{
    try {
        const barang = await Barang.findOneAndDelete({_id:req.params.id})
        
        if(!barang) {
            return res.status(404).send()
        }

        res.redirect('/barang2/jualan')
    } catch(e) {
        res.redirect('barang2/jualan')
    }
})

module.exports = router