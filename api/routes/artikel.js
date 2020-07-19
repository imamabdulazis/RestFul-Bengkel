const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Artikel = require('../models/artikel');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, (req, res, next) => {
    Artikel.find()
        .select('_id title content created_at')
        .populate('bengkel', 'nama_bengkel nomor_telp')
        .exec()
        .then(doc => {
            if (doc.length < 1) {
                res.status(404).json({
                    status: 404,
                    message: 'Data artikel tidak ada!',
                });
            } else {
                res.status(200).json({
                    status: 200,
                    message: 'Berhasil retrieve data artikel',
                    jumlah: doc.length,
                    data: doc
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
})

router.post('/', checkAuth, (req, res, next) => {
    Artikel.find({ title: req.body.title })
        .then(result => {
            if (!result) {
                res.status(409).json({
                    status: 409,
                    message: "Judul sudah tersedia pernah ditulis sebelumnya"
                })
            }
            const artikel = new Artikel({
                _id: mongoose.Types.ObjectId(),
                title: req.body.title,
                content: req.body.content,
                bengkel: req.body.bengkelId,
            })
            return artikel.save()
        })
        .then(result => {
            console.log(result);
            res.status(200).json({
                status: 200,
                message: "Berhasil menambah artikel!",
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

    Artikel.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: `Berhasil update data artikel`,
                data: doc,
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.delete('/:artikelId', checkAuth, (req, res, next) => {
    Artikel.remove({ _id: req.params.artikelId })
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
                message: "Artikel Berhasil di hapus"
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })

});

router.get('/:artikelId', checkAuth, (req, res, next) => {
    Artikel.findById(req.params.artikelId)
        .select('_id title content created_at')
        .populate('bengkel', 'nama_bengkel nomor_telp')
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