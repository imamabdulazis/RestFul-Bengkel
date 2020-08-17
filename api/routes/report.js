const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Report = require('../models/report');
const Servis = require('./../models/servis');
const _ = require('lodash');
const moment = require('moment');
const { populate } = require('../models/report');

router.get('/', (req, res, next) => {
    Report.find()
        .select('_id no_transaksi keterangan total_harga')
        .populate('bengkel', 'nama_bengkel nomor_telp')
        .populate('user', 'nama nomor nomor_telp')
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: 'Berhasil retrieve data report',
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
    Servis.find({ user: req.body.id_user })
        .then(result => {
            var newArray = result.filter(function (el) {
                if (el.isService == false) {
                    return el;
                }
            })
            if (result.length < 1 || newArray.length < 1) {
                return res.status(404).json({
                    status: 404,
                    message: "Data service anda belum ada",
                })
            }
            const report = new Report({
                _id: mongoose.Types.ObjectId(),
                no_transaksi: moment().format('YYMMDDhhmmss'),
                user: req.body.id_user,
                bengkel: req.body.id_bengkel,
                keterangan: req.body.keterangan,
                total_harga: req.body.total,
            })
            return Servis.update({ _id: newArray[0]._id }, { $set: { isService: true, keterangan_bengkel: req.body.keterangan } })
                .then(() => {
                    return report.save().then(() => {
                        res.status(200).json({
                            status: 200,
                            message: `Berhasil simpan report`
                        })
                    }).catch(err => {
                        res.status(500).json({
                            status: 500,
                            message: err
                        })
                    })
                }).catch(err => {
                    res.status(500).json({
                        status: 500,
                        message: err
                    })
                })
        })
})

router.delete('/:reportId', (req, res, next) => {
    Report.remove({ _id: req.params.reportId })
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
                message: "Berhasil di hapus"
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })

})
// get report by bengkel
router.get('/bengkel/:bengkelId', (req, res, next) => {
    Report.find({ bengkel: req.params.bengkelId })
        .populate('user', 'nama')
        .populate('bengkel', 'nama_bengkel')
        .then(doc => {
            if (_.isEmpty(doc)) {
                res.status(404).json({
                    status: 404,
                    message: "Belum ada data report!"
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

// get riwayt user
router.get('/user/:userId', (req, res, next) => {
    Report.find({ user: req.params.userId })
        .populate('user', 'nama')
        .populate('bengkel', 'nama_bengkel')
        .then(doc => {
            if (_.isEmpty(doc)) {
                res.status(404).json({
                    status: 404,
                    message: "Belum ada data report!"
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

module.exports = router;