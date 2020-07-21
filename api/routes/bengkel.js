const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const _ = require('lodash');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Bengkel = require('../models/bengkel');
const app = require('../../app');

router.post('/signup', upload.single('bengkelImage'), (req, res, next) => {
    Bengkel.find({ nama_bengkel: req.body.nama_bengkel })
        .exec()
        .then(nambeng => {
            if (nambeng.length >= 1) {
                return res.status(409).json({
                    status: 409,
                    message: "Nama Bengkel Telah Dipakai!"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            status: 500,
                            message: err
                        })
                    } else {
                        const bengkel = new Bengkel({
                            _id: mongoose.Types.ObjectId(),
                            image_url: _.isEmpty(req.file) ? process.env.base_api + "uploads/bengkel.png" : process.env.base_api + req.file.path,
                            nama_bengkel: req.body.nama_bengkel,
                            nama_pemilik: req.body.nama_pemilik,
                            email: req.body.email,
                            nomor_telp: req.body.nomor_telp,
                            alamat: req.body.alamat,
                            password: hash,
                            location: {
                                type: "Point",
                                coordinates: [
                                    parseFloat(req.body.latitude),
                                    parseFloat(req.body.longitude),
                                ]
                            }
                        });
                        bengkel
                            .save()
                            .then(result => {
                                res.status(200).json({
                                    status: 200,
                                    message: `Berhasil mendaftar bengkel ${req.body.nama_bengkel}`
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
            }
        })
});

router.post('/login', (req, res) => {
    Bengkel.find({ email: req.body.email })
        .exec()
        .then(bengkel => {
            if (bengkel.length < 1) {
                return res.status(404).json({
                    status: 404,
                    message: "Email tidak ditemukan!"
                })
            }

            bcrypt.compare(req.body.password, bengkel[0].password, (err, result) => {
                if (err) {
                    return status(401).json({
                        status: 401,
                        message: "Username atau password salah!"
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: bengkel[0].email,
                        userId: bengkel[0]._id,
                    }, process.env.JWT_KEY,
                        {
                            expiresIn: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                        }
                    );
                    return res.status(200).json({
                        status: 200,
                        message: "Berhasil login!",
                        token: token,
                        data: bengkel[0],
                    })
                }
                res.status(401).json({
                    status: 401,
                    message: "Username atau password salah!"
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        });
})

router.patch('/:bengkelId', checkAuth, (req, res, next) => {
    const id = req.params.bengkelId;
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Bengkel.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: `Berhasil update data bengkel`,
                data: doc,
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.get('/', checkAuth, (req, res) => {
    Bengkel.find()
        .select('_id image_url nama_bengkel nama_pemilik email nomor_telp alamat location')
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                jumlah: doc.length,
                data: doc
            })
        }).catch(err => {
            res.status(500).json({
                status: 200,
                message: err
            })
        })
})

router.get('/:bengkelId', checkAuth, (req, res) => {
    Bengkel.findById(req.params.bengkelId)
        .select('_id image_url nama_bengkel nama_pemilik email nomor_telp alamat location')
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                data: doc
            })
        }).catch(err => {
            res.status(500).json({
                status: 200,
                message: err
            })
        })
})

router.delete('/:bengkelId', checkAuth, (req, res) => {
    Bengkel.remove({ _id: req.params.bengkelId })
        .exec()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: "Berhasil hapus bengkel",
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