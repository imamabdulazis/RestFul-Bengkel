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

const multer = Multer({
    storage: Multer.memoryStorage(),
    // limits: {
    //     fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    // }
});

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
            } else if (req.body.oasswird < 6) {
                return res.status(409).json({
                    status: 409,
                    message: "Password terlalu sedikit"
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

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    UserAdmin.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: `Berhasil update admin`,
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.delete('/:userId', (req, res) => {
    UserAdmin.remove({ _id: req.params.userId })
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
});

router.patch('/image/:userId', multer.single('adminImage'), checkAuth, (req, res) => {
    const id = req.params.userId;

    let file = req.file;
    if (file) {
        uploadImageToStorage(file).then((success) => {
            UserAdmin.update({ _id: id }, { $set: { image_url: success } })
                .exec()
                .then(doc => {
                    res.status(200).json({
                        status: 200,
                        message: `Berhasil update image admin`
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



module.exports = router;