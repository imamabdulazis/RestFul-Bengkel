const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Artikel = require('../models/artikel');
const checkAuth = require('../middleware/check-auth');
const Multer = require('multer');
const { uploadImageToStorage } = require('../../utils/uploader');

const multer = Multer({
    storage: Multer.memoryStorage(),
})

router.get('/', (req, res, next) => {
    Artikel.find()
        .select('_id image_url title content created_at updated_at')
        .exec()
        .then(doc => {
            if (doc.length < 1) {
                res.status(404).json({
                    status: 404,
                    message: 'Data artikel tidak ada!',
                });
            } else {
                res.status(200).json({
                    status: 200,
                    message: 'Berhasil retrieve data artikel',
                    jumlah: doc.length,
                    data: doc
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
})

router.post('/', multer.single('image_url'), (req, res, next) => {
    Artikel.find({ title: req.body.title })
        .then(result => {
            if (!result) {
                res.status(409).json({
                    status: 409,
                    message: "Judul sudah tersedia pernah ditulis sebelumnya"
                })
            }
            let file = req.file;
            if (file) {
                uploadImageToStorage(file).then((success) => {
                    const artikel = new Artikel({
                        _id: mongoose.Types.ObjectId(),
                        image_url: success,
                        title: req.body.title,
                        content: req.body.content,
                    })
                    return artikel.save();
                }).catch((err) => {
                    console.error(err);
                    res.status(500).json({ status: 500, message: err })
                })
            }
        })
        .then(result => {
            console.log(result);
            res.status(200).json({
                status: 200,
                message: "Berhasil menambah artikel!",
                data: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: err });
        })
})

router.patch('/:kategoriId', (req, res, next) => {
    const id = req.params.kategoriId;
    const updateOps = {}

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Artikel.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                message: `Berhasil update data artikel`,
                data: doc,
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.delete('/:artikelId', (req, res, next) => {
    Artikel.remove({ _id: req.params.artikelId })
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
                message: "Artikel Berhasil di hapus"
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })

});

router.get('/:artikelId', (req, res, next) => {
    Artikel.findById(req.params.artikelId)
        .select('_id title content created_at')
        .populate('bengkel', 'nama_bengkel nomor_telp')
        .exec()
        .then(doc => {
            res.status(200).json({
                status: 200,
                data: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: err
            })
        })
})

router.patch('/image/:artikelId', multer.single('artikelImage'), checkAuth, (req, res) => {
    const id = req.params.artikelId;

    let file = req.file;
    if (file) {
        uploadImageToStorage(file).then((success) => {
            Artikel.update({ _id: id }, { $set: { image_url: success } })
                .exec()
                .then(doc => {
                    res.status(200).json({
                        status: 200,
                        message: `Berhasil update image produk`,
                        data: doc,
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