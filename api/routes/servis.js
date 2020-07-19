const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Servis = require('../models/servis');
const Produk = require('../models/produk');

router.get('/', (req, res, next) => {
    Servis.find()
        .select('_id created_at jumlah_produk jenis_servis total_bayar keterangan')
        .populate('produk', 'nama')
        .populate('bengkel', 'nama_bengkel nomor_telp')
        .populate('user', 'nama email nomor_telp alamat')
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
            const servis = new Servis({
                _id: mongoose.Types.ObjectId(),
                created_at: new Date().toISOString(),
                user: req.body.userId,
                bengkel: req.body.bengkelId,
                produk: req.body.produkId,
                jumlah_produk: req.body.jumlah_produk,
                jenis_servis: req.body.jenis_servis,
                biaya_servis: req.body.biaya_servis,
                keterangan: req.body.keterangan,
            })
            return servis.save()
        })
        .then(result => {
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

router.patch('/:servisId', (req, res, next) => {
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
                message: `Berhasil update data servis`,
                data: doc,
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.delete('/:servisId', (req, res, next) => {
    Servis.remove({ _id: req.params.servisId })
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
                message: "Servis Berhasil di hapus"
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