const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Kategori = require('../models/kategori');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, (req, res, next) => {
    Kategori.find()
        .select('_id nama_kategori bengkel')
        .populate('bengkel', 'nama_bengkel')
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: 'Berhasil retrieve data kategori',
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

router.post('/', checkAuth, (req, res, next) => {
    Kategori.find({ nama_kategori: req.body.nama_kategori })
        .then(result => {
            if (!result) {
                res.status(409).json({
                    status: 409,
                    message: "Kategori sudah tersedia"
                })
            }
            const kategori = new Kategori({
                _id: mongoose.Types.ObjectId(),
                nama_kategori: req.body.nama_kategori,
                bengkel: req.body.bengkelId,
            })
            return kategori.save()
        })
        .then(result => {
            console.log(result);
            res.status(200).json({
                status: 200,
                message: "Berhasil menambah kategori!",
                data: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: err });
        })
})

router.patch('/:kategoriId', checkAuth, (req, res, next) => {
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
                message: `Berhasil update data servis`,
                data: doc,
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.delete('/:kategoriId', checkAuth, (req, res, next) => {
    Kategori.remove({ _id: req.params.kategoriId })
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

});

router.get('/:kategoriId', checkAuth, (req, res, next) => {
    Kategori.findById(req.params.kategoriId)
        .select('_id nama_kategori bengkel')
        .populate('bengkel', 'nama_bengkel')
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