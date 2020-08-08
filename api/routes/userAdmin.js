const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const _ = require('lodash');

const UserAdmin = require('../models/userAdmin');
const app = require('../../app');
const config = require('../../utils/config');
const { uploadImageToStorage } = require('../../utils/uploader');

router.post('/signup', (req, res, next) => {
    let generatedToken = uuid();
    UserAdmin.find({ email: req.body.email })
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
                        const user = new UserAdmin({
                            _id: mongoose.Types.ObjectId(),
                            image_url: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/no-img.png?alt=media&token=${generatedToken}`,
                            nama: req.body.nama,
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
    UserAdmin.find({ email: req.body.email })
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

router.get('/', checkAuth, (req, res) => {
    UserAdmin.find()
        .select('_id image_url nama email')
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

module.exports = router;