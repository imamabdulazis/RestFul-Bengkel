const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Kategori = require('../models/kategori');
const _ = require('lodash');
const checkAuth = require('../middleware/check-auth');

router.get('/:bengkelId', (req, res) => {
    Kategori.find({ bengkel: req.params.bengkelId })
        .populate('bengkel', 'nama_bengkel')
        .then(doc => {
            if (_.isEmpty(doc)) {
                res.status(404).json({
                    status: 404,
                    message: "Belum ada data kategori!"
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

router.patch('/:kategoriId', (req, res, next) => {
    const id = req.params.kategoriId;
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Kategori.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: `Berhasil update kategori`,
                data: doc,
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.delete('/:kategoriId', (req, res, next) => {
    Kategori.remove({ _id:  req.params.kategoriId })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: "Berhasil menghapus kategori",
            })
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})


module.exports = router;