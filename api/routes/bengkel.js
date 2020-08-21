const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const _ = require('lodash');
const Multer = require('multer');
const { v4: uuid } = require('uuid');
const Bengkel = require('../models/bengkel');
const config = require('../../utils/config');
const { uploadImageToStorage } = require('../../utils/uploader');

const multer = Multer({
    storage: Multer.memoryStorage(),
    // limits: {
    //     fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    // }
});

router.post('/signup', (req, res) => {
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
                        let generatedToken = uuid();
                        const bengkel = new Bengkel({
                            _id: mongoose.Types.ObjectId(),
                            image_url: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/bengkel.png?alt=media&token=${generatedToken}`,
                            nama_bengkel: req.body.nama_bengkel,
                            nama_pemilik: req.body.nama_pemilik,
                            email: req.body.email,
                            nomor_telp: req.body.nomor_telp,
                            alamat: req.body.alamat,
                            password: hash,
                            latitude: req.body.latitude,
                            longitude: req.body.longitude,
                        });
                        bengkel
                            .save()
                            .then(result => {
                                res.status(200).json({
                                    status: 200,
                                    message: `Berhasil mendaftar bengkel ${req.body.nama_bengkel}`
                                })
                            })
                            .catch((err) => {
                                console.log(err)
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
    console.log(req.body)
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
                    return status(404).json({
                        status: 404,
                        message: "Email atau password salah!"
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: bengkel[0].email,
                        userId: bengkel[0]._id,
                    }, "secret",
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
                res.status(404).json({
                    status: 404,
                    message: "Email atau password salah!"
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
        .select('_id created_at image_url nama_bengkel nama_pemilik email nomor_telp alamat location')
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

router.get('/:bengkelId', (req, res) => {
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

router.delete('/:bengkelId', (req, res) => {
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

// update foto profil bengkel
router.patch('/image/:bengkelId', multer.single('bengkelImage'), (req, res) => {
    const id = req.params.bengkelId;

    let file = req.file;
    if (file) {
        uploadImageToStorage(file).then((success) => {
            Bengkel.update({ _id: id }, { $set: { image_url: success } })
                .exec()
                .then(doc => {
                    res.status(200).json({
                        status: 200,
                        message: `Berhasil update image bengkel`,
                    });
                })
                .catch(err => {
                    res.status(500).json({ status: 500, message: err });
                })
        }).catch((error) => {
            console.error(error);
            res.status(500).json({ status: 500, message: err });
        })
    } else {
        res.status(500).json({
            status: 500,
            message: "Tidak ada gambar"
        });
    }
})

router.put('/reset-password', (req, res) => {
    if (req.body.new_password != req.body.con_password) {
        res.status(409).json({
            status: 409,
            message: "Password tidak sama!"
        })
    } else {
        Bengkel.find({ email: req.body.email })
            .exec()
            .then(bengkel => {
                if (bengkel.length < 1) {
                    res.status(404).json({
                        status: 404,
                        message: "Email tidak ditemukan."
                    })
                } else {
                    bcrypt.compare(req.body.password, bengkel[0].password, (err, result) => {
                        if (err) {
                            return status(404).json({
                                status: 404,
                                message: "Email atau password salah!"
                            })
                        }
                        if (result) {
                            bcrypt.hash(req.body.new_password, 10, (err, hash) => {
                                Bengkel.update({ _id: bengkel[0]._id }, { $set: { password: hash } })
                                    .exec()
                                    .then(() => {
                                        res.status(200).json({
                                            status: 200,
                                            message: "Berhasil ubah password"
                                        })
                                    })
                                    .catch(err => {
                                        res.status(500).json({ status: 500, message: err });
                                    })
                            })
                        } else {
                            res.status(404).json({
                                status: 404,
                                message: "Email atau password salah!"
                            })
                        }
                    })
                }
            });
    }
})


module.exports = router;