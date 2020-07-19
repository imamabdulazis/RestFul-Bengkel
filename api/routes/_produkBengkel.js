const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Produk = require('../models/produk');
const _ = require('lodash');
const checkAuth = require('../middleware/check-auth');

router.get('/:bengkelId', (req, res) => {
    Produk.find({ bengkel: req.params.bengkelId })
        .populate('bengkel', 'nama_bengkel')
        .then(doc => {
            if (_.isEmpty(doc)) {
                res.status(404).json({
                    status: 404,
                    message: "Belum ada data produk!"
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

router.patch('/:produkId', checkAuth, (req, res, next) => {
    const id = req.params.produkId;
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Produk.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: `Berhasil update produk`,
                data: doc,
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.delete('/:produkId', checkAuth, (req, res, next) => {
    const id = req.params.produkId;

    Produk.remove({ _id: id })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: "Berhasil menghapus produk",
            })
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})


module.exports = router;