const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Servis = require('../models/servis');
const _ = require('lodash');
const checkAuth = require('../middleware/check-auth');

router.get('/:userId', (req, res) => {
    Servis.find({ user: req.params.userId })
        .populate('user', 'nama email alamat')
        .populate('bengkel', 'nama_bengkel nomor_telp')
        .populate('produk', 'nama harga')
        .then(doc => {
            if (_.isEmpty(doc)) {
                res.status(404).json({
                    status: 404,
                    message: "Belum ada data servis!"
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

router.patch('/:servisId', checkAuth, (req, res, next) => {
    const id = req.params.servisId;
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Servis.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: `Berhasil update servis`,
                data: doc,
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.delete('/:servisId', checkAuth, (req, res, next) => {
    Servis.remove({ _id: req.params.servisId })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: "Berhasil menghapus servis",
            })
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})


module.exports = router;