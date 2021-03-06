const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Servis = require('../models/servis');
const _ = require('lodash');

router.get('/', (req, res, next) => {
    Servis.find()
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
    const servis = new Servis({
        _id: mongoose.Types.ObjectId(),
        user: req.body.userId,
        bengkel: req.body.bengkelId,
        produk: null,
        jumlah_produk: req.body.jumlah_produk,
        jenis_servis: req.body.jenis_servis,
        merk_motor: req.body.merk_motor,
        nomor_telp: req.body.nomor_telp,
        biaya_servis: req.body.biaya_servis,
        keterangan_user: req.body.keterangan_user,
        keterangan_bengkel: req.body.keterangan_bengkel,
        isService: false,
    });

    Servis.find({ user: req.body.userId })
        .then((result) => {
            var newArray = result.filter(function (el) {
                if (el.isService === false) {
                    return el;
                }
            });
            if (newArray.length > 0) {
                return res.status(409).json({
                    status: 409,
                    message: "Anda masih memiliki status servis aktif"
                })
            } else {
                return servis
                    .save()
                    .then(() => {
                        res.status(200).json({
                            status: 200,
                            message: `Berhasil simpan servis`
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            status: 500,
                            message: err
                        })
                    })
            }
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
                message: `Berhasil update data servis`
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


function createAntrian(result, user_id) {
    var newArray = result.filter(function (el) {
        if (el.isService === false) {
            return el;
        }
    });

    if (_.isEmpty(newArray)) {

    } else {
        let nomor = newArray.findIndex(x => x.user == user_id);
        const antrian = new Antrian({
            _id: mongoose.Types.ObjectId(),
            nomor_antrian: nomor + 1
        })
        return antrian.save();
    }
}

module.exports = router;