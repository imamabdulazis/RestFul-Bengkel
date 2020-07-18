const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Servis = require('../models/servis');

router.get('/', (req, res, next) => {
    Servis.find()
        .select('_id jumlah_produk jenis_servis total_bayar keterangan')
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: 'Berhasil retrieve data servis',
                jumlah:doc.length,
                data: doc
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
})

router.post('/', (req, res, next) => {
    const servis = new Servis({
        _id: mongoose.Types.ObjectId(),
        produk: req.body.produkId,
        jumlah_produk: req.body.jumlah_produk,
        jenis_servis: req.body.jenis_servis,
        total_bayar: req.body.total_bayar,
        keterangan: req.body.keterangan,
    })
    servis
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                status: 200,
                message: "Berhasil menambah servis",
                data: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: err });
        })



})

router.put('/:servisId', (req, res, next) => {
    const id = req.params.servisId;

    res.status(200).json({ update: id });
})

router.delete('/:servisId', (req, res, next) => {
   
    
})

router.get('/:servisId', (req, res, next) => {
    const id = req.params.servisId;

    res.status(200).json({ dataOne: id });
})


module.exports = router;