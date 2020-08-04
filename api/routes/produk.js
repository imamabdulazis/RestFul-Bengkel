const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Kategori = require('../models/kategori');
const Produk = require('../models/produk');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const BusBoy = require('busboy');
const { v4: uuid } = require('uuid');
const { admin } = require('../../utils/admin');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: function (req, file, cb) {
//         console.log("FILE :", file)
//         cb(null, file.originalname);
//     }
// })
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }
// const upload = multer({
//     storage: storage,
//     // limits: {
//     //     fileSize: 1024 * 1024 * 5
//     // },
//     // fileFilter: fileFilter
// });

router.get('/', (req, res, next) => {
    Produk.find()
        .select('nama harga stok bengkel kategori image_url _id')
        .populate('bengkel', 'nama_bengkel')
        .populate('kategori', 'nama_kategori')
        .exec()
        .then(doc => {
            const response = {
                status: 200,
                message: "Berhasil",
                jumlah: doc.length,
                data: doc,
            }
            res.status(200).json(response)

        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.post('/', (req, res, next) => {
    // Kategori.findById(req.body.kategoriId)
    //     .then(kategori => {
    //         if (!kategori) {
    //             res.status(404).json({
    //                 status: 404,
    //                 message: "Kategori tidak ditemukan"
    //             })
    //         }
    //         const produk = new Produk({
    //             _id: new mongoose.Types.ObjectId(),
    //             created_at: new Date().toISOString(),
    //             bengkel: req.body.bengkelId,
    //             kategori: req.body.kategoriId,
    //             image_url: process.env.base_api + req.file.path,
    //             nama: req.body.nama,
    //             harga: req.body.harga,
    //             stok: req.body.stok,
    //             status: req.body.status
    //         })
    //         console.log(req.file);
    //         return produk.save();
    //     })
    //     .then(result => {
    //         res.status(200).json({
    //             status: 200,
    //             message: `Berhasil menambahkan produk`,
    //             data: result,
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: err });
    //     })
    const busboy = new BusBoy({ headers: req.headers });
    const path = require("path");
    const os = require("os");
    const fs = require("fs");
    let imageToBeUploaded = {};
    let imageFileName;
    let generatedToken = uuid();

    let data = []

    busboy.on("field", (key, value) => {
        data.push(value);
    });

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        // console.log(fieldname, file, filename, encoding, mimetype);
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            return res.status(400).json({
                status: 400,
                message: "File format salah!"
            });
        }
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        // 32756238461724837.png
        imageFileName = `${Math.round(
            Math.random() * 1000000000000
        ).toString()}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype };
        file.pipe(fs.createWriteStream(filepath));
        console.log(imageFileName)
    });

    busboy.on('finish', () => {
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype,
                        firebaseStorageDownloadTokens: generatedToken,
                    },
                },
            })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media&token=${generatedToken}`;

                const produk = new Produk({
                    _id: new mongoose.Types.ObjectId(),
                    created_at: new Date().toISOString(),
                    bengkel: req.body.bengkelId,
                    kategori: req.body.kategoriId,
                    image_url: imageUrl,
                    nama: req.body.nama,
                    harga: req.body.harga,
                    stok: req.body.stok,
                    status: req.body.status
                })
                produk.save()
                    .then(result => {
                        res.status(200).json({
                            status: 200,
                            message: `Berhasil menambahkan produk`,
                            data: result,
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ status: 500, message: err });
                    })
            })
    })
    busboy.end(req.rawBody);
})

router.patch('/:produkId', (req, res, next) => {
    const id = req.params.produkId;
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Produk.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: `Berhasil update produk`,
                data: doc,
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.delete('/:produkId', (req, res, next) => {
    const id = req.params.produkId;

    Produk.remove({ _id: id })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: "Berhasil menghapus produk",
            })
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.get('/:produkId', (req, res, next) => {
    const id = req.params.produkId;

    Produk.findById(id)
        .select('nama harga _id')
        .exec()
        .then(doc => {
            if (doc === null) {
                res.status(404).json({
                    status: 404,
                    message: "Data tidak ditemukan",
                });
            } else {
                res.status(200).json({
                    status: 200,
                    message: "Berhasil retrive data",
                    data: doc
                });
            }
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
            console.log(err)
        });
})


module.exports = router;