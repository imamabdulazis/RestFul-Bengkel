const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Produk = require('../models/produk');

router.get('/', (req, res, next) => {
    Order.find()
        .select('_id produk quantity')
        .populate('produk','nama')
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
    Produk.findById(req.body.produkId)
        .then(produk => {
            if (!produk) {
                res.status(404).json({
                    status: 404,
                    message: "Produk tidak ditemukan"
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                produk: req.body.produkId,
                quantity: req.body.quantity,
            })
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(200).json({
                status: 200,
                message: "Berhasil menambah pemesanan",
                data: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: err });
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

        })

})

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('produk quantity _id')
        .populate('produk')
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                data: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
})


module.exports = router;