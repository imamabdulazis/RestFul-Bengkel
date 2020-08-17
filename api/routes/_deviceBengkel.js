const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DeviceBengkel = require('../models/deviceBengkel');
const _ = require('lodash');

router.get('/', (req, res, next) => {
    DeviceBengkel.find()
        .populate('bengkel', 'nama_bengkel nomor_telp')
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: 'Berhasil retrieve data device',
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
    DeviceBengkel.find({ bengkel: req.body.id_bengkel })
        .then(result => {
            if (result.length < 1) {
                const device = new DeviceBengkel({
                    _id: mongoose.Types.ObjectId(),
                    bengkel: req.body.id_bengkel,
                    fcm_token: req.body.fcm_token,
                    systemName: req.body.systemName,
                    systemVersion: req.body.systemVersion,
                    getManufacturer: req.body.getManufacturer,
                })
                return device
                    .save()
                    .then(result => {
                        res.status(200).json({
                            status: 200,
                            message: `Berhasil tambah fcm token bengkel`
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            status: 500,
                            message: err
                        })
                    })
            } else {
                return DeviceBengkel.update({ _id: result[0]._id }, {
                    $set: {
                        fcm_token: req.body.fcm_token,
                        systemName: req.body.systemName,
                        systemVersion: req.body.systemVersion,
                        getManufacturer: req.body.getManufacturer,
                    }
                })
                    .exec()
                    .then(doc => {
                        res.status(200).json({
                            status: 200,
                            message: `Berhasil update fcm token bengkel`
                        });
                    })
                    .catch(err => {
                        res.status(500).json({ status: 500, message: err });
                    })
            }
        })
})

router.delete('/:id', (req, res, next) => {
    DeviceBengkel.remove({ _id: req.params.id })
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
                message: "Device token Berhasil di hapus"
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })

})

// bengkel
router.get('/:bengkelId', (req, res, next) => {
    DeviceBengkel.find({ bengkel: req.params.bengkelId })
        .populate('bengkel', 'nama_bengkel alamat nomor_telp')
        .then(doc => {
            if (_.isEmpty(doc)) {
                res.status(404).json({
                    status: 404,
                    message: "Belum ada data device bengkel!"
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


router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    DeviceBengkel.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: `Berhasil update data device bengkel`
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

module.exports = router;