const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const app = require('../../app');

router.post('/signup', (req, res, next) => {
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
                            email: req.body.email,
                            password: hash,
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
                    }, process.env.JWT_KEY,
                        {
                            expiresIn: '2 days'
                        }
                    );
                    return res.status(200).json({
                        status: 200,
                        message: "Berhasil login!",
                        token: token
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
        .select('_id email password')
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
        .select('_id email password')
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












// const user = new User({
//     _id: mongoose.Types.ObjectId,
//     nama: req.body.nama,
//     email: req.body.email,
//     // nomor_telp: req.body.nomor_telp,
//     // alamat: req.body.alamat,
//     // password: req.body.password,
//     // location: {
//     //     latitude: req.body.latitude,
//     //     longitude: req.body.longitude,
//     // }
// })