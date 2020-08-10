const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Produk = require('../models/produk');
const _ = require('lodash');

router.get('/', (req, res, next) => {
    Order.find()
        .select('_id created_at nama_keluhan merk_motor nomor_telp')
        .populate('bengkel', 'nama_bengkel nomor_telp')
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: 'Berhasil retrieve data servis',
                jumlah: doc.length,
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
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        nama_keluhan: req.body.nama_keluhan,
        merk_motor: req.body.merk_motor,
        nomor_telp: req.body.nomor_telp,
        user: req.body.userId,
        bengkel: req.body.bengkelId,
    })
    order
        .save()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: `Berhasil booking servis`
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
})

router.delete('/:orderId', (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            if (!result) {
                res.status(404).json({
                    status: 404,
                    message: "Data tida ditemukan"
                })
            }
            res.status(200).json({
                status: 200,
                message: "Pemesanan Berhasil di hapus"
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })

})
// get servis by bengkel
router.get('/bengkel/:bengkelId', (req, res, next) => {
    Order.find({ bengkel: req.params.bengkelId })
        .populate('bengkel', 'nama_bengkel')
        .then(doc => {
            if (_.isEmpty(doc)) {
                res.status(404).json({
                    status: 404,
                    message: "Belum ada data booking!"
                })
            } else {
                res.status(200).json({
                    status: 200,
                    data: doc
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
})

// user
router.get('/user/:userId', (req, res, next) => {
    Order.find({ user: req.params.userId })
        .populate('user', 'nama nomor_telp')
        .then(doc => {
            if (_.isEmpty(doc)) {
                res.status(404).json({
                    status: 404,
                    message: "Belum ada data booking!"
                })
            } else {
                res.status(200).json({
                    status: 200,
                    data: doc
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
});

module.exports = router;