const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

const User = require('../models/user');
const app = require('../../app');

router.post('/signup', upload.single('userImage'), (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    status: 409,
                    message: "Email telah tersedia"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            status: 500,
                            message: err
                        })
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            image_url: _.isEmpty(req.file) ? process.env.base_api + "uploads/user.jpg" : process.env.base_api + req.file.path,
                            nama: req.body.nama,
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
                        user
                            .save()
                            .then(result => {
                                res.status(200).json({
                                    status: 200,
                                    message: `Berhasil mendaftar ${req.body.email}`
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
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(404).json({
                    status: 404,
                    message: "Email tidak ditemukan!"
                })
            }

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return status(401).json({
                        status: 401,
                        message: "Username atau password salah!"
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id,
                    }, "secret",
                        {
                            expiresIn: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                        }
                    );
                    return res.status(200).json({
                        status: 200,
                        message: "Berhasil login!",
                        token: token,
                        data: user[0]
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

router.get('/', (req, res) => {
    User.find()
        .select('_id image_url nama email nomor_telp alamat location')
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

router.get('/:userId', (req, res) => {
    User.findById(req.params.userId)
        .select('_id image_url nama email nomor_telp alamat location')
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                data: {
                    _id: doc._id,
                    image_url: doc.image_url,
                    nama: doc.nama,
                    email: doc.email,
                    nomor_telp: doc.nomor_telp,
                    alamat: doc.alamat,
                    location: doc.location
                }
            })
        }).catch(err => {
            res.status(500).json({
                status: 200,
                message: err
            })
        })
})

router.delete('/:userId', (req, res) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: "Berhasil hapus user",
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