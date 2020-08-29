const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Report = require('../models/report');
const Servis = require('./../models/servis');
const _ = require('lodash');
const moment = require('moment');
const Produk = require('../models/produk');

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
                isDeleteUser: false,
            })
            if (req.body.id_produk) {
                Produk.findById(req.body.id_produk)
                    .then((result) => {
                        if (result.stok < 1) {
                            res.status(404).json({
                                status: 404,
                                message: "Produk sedang kosong"
                            })
                        } else {
                            return Produk.update({ _id: req.body.id_produk }, {
                                $set: { stok: result.stok - 1 }
                            }).then(() => {
                                Servis.update({ _id: newArray[0]._id }, {
                                    $set: {
                                        isService: true,
                                        keterangan_bengkel: req.body.keterangan,
                                        produk: req.body.id_produk,
                                        jumlah_produk: 1,
                                    }
                                }).then(() => {
                                    return report.save().then(() => {
                                        res.status(200).json({
                                            status: 200,
                                            message: `Berhasil simpan report`
                                        })
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
                        }
                    })
            } else {
                Servis.update({ _id: newArray[0]._id }, {
                    $set: {
                        isService: true,
                        keterangan_bengkel: req.body.keterangan,
                        produk: null,
                        jumlah_produk: 1,
                    }
                }).then(() => {
                    return report.save().then(() => {
                        res.status(200).json({
                            status: 200,
                            message: `Berhasil simpan report`
                        })
                    })
                }).catch(err => {
                    res.status(500).json({
                        status: 500,
                        message: err
                    })
                })
            }
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
            var newArray = doc.filter(function (el) {
                if (el.isDeleteUser == false) {
                    return el;
                }
            })
            if (_.isEmpty(newArray)) {
                res.status(404).json({
                    status: 404,
                    message: "Belum ada data report!"
                })
            } else {
                res.status(200).json({
                    status: 200,
                    data: newArray
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

// delete riwayat user
router.put('/user/delete/:reportId', (req, res) => {
    const id = req.params.reportId;

    Report.update({ _id: id }, { $set: { isDeleteUser: req.body.isDeleteUser } })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: `Berhasil hapus riwayat`,
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
});

// get report form date to date
router.post('/bengkel/date', (req, res) => {
    Report.find({ bengkel: req.body.id_bengkel })
        .exec()
        .then((result) => {
            if (result.length < 1) {
                return res.status(200).json({
                    status: 404,
                    message: "Belum ada data laporan"
                })
            } else {
                Report.find({
                    updated_at: {
                        $gte: new Date(req.body.from_date),//from date
                        $lt: new Date(req.body.to_date)//to date
                    }
                })
                    .select('_id no_transaksi updated_at user keterangan total_harga ')
                    .populate('user','email')
                    .exec()
                    .then((result) => {
                        if (result.length < 1) {
                            return res.status(404).json({
                                status: 404,
                                message: "Belum ada data laporan"
                            })
                        } else {
                            res.status(200).json({
                                status: 200,
                                data: result
                            })
                        }
                    })
            }
        }).catch((err) => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
})

module.exports = router;