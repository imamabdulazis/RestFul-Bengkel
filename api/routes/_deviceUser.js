const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DeviceUser = require('../models/deviceUser');
const _ = require('lodash');

router.get('/', (req, res, next) => {
    DeviceUser.find()
        .populate('user', 'nama nomor_telp')
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
    DeviceUser.find({ user: req.body.id_user })
        .then(result => {
            if (result.length < 1) {
                const device = new DeviceUser({
                    _id: mongoose.Types.ObjectId(),
                    user: req.body.id_user,
                    fcm_token: req.body.fcm_token,
                    systemName: req.body.systemName,
                    systemVersion: req.body.systemVersion,
                    getManufacturer: req.body.getManufacturer,
                })
                return device.save()
                    .then(doc => {
                        res.status(200).json({
                            status: 200,
                            message: `Berhasil tambah fcm token user`
                        });
                    })
                    .catch(err => {
                        res.status(500).json({ status: 500, message: err });
                    })
            } else {
                return DeviceUser.update({ _id: result[0]._id }, { $set: { fcm_token: req.body.fcm_token } })
                    .exec()
                    .then(doc => {
                        res.status(200).json({
                            status: 200,
                            message: `Berhasil update fcm token user`
                        });
                    })
                    .catch(err => {
                        res.status(500).json({ status: 500, message: err });
                    })
            }
        })
})

router.delete('/:id', (req, res, next) => {
    DeviceUser.remove({ _id: req.params.id })
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

// user
router.get('/:userId', (req, res, next) => {
    DeviceUser.find({ user: req.params.userId })
        .populate('user', 'nama nomor_telp')
        .then(doc => {
            if (_.isEmpty(doc)) {
                res.status(404).json({
                    status: 404,
                    message: "Belum ada data device user!"
                })
            } else {
                res.status(200).json({
                    status: 200,
                    data: doc[0]
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

    DeviceUser.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: `Berhasil update data device user`
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

module.exports = router;