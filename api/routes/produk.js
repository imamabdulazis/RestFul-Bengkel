const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Produk = require('../models/produk');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

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

router.get('/', checkAuth, (req, res, next) => {
    Produk.find()
        .select('nama harga stok kategori image_url _id')
        .exec()
        .then(doc => {
            const response = {
                status: 200,
                message: "Berhasil",
                jumlah: doc.length,
                produk: doc.map(doc => {
                    return {
                        _id: doc._id,
                        image_url: 'http://localhost:3000/' + doc.image_url,
                        nama: doc.nama,
                        harga: doc.harga,
                        stok: doc.stok,
                        kategori: doc.kategori,
                    }
                })
            }
            res.status(200).json(response)

        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.post('/', upload.single('produkImage'), checkAuth, (req, res, next) => {
    const produk = new Produk({
        _id: new mongoose.Types.ObjectId(),
        image_url: req.file.path,
        nama: req.body.nama,
        harga: req.body.harga,
        stok: req.body.stok,
        kategori: req.body.kategori
    });
    produk
        .save()
        .then(result => {
            res.status(200).json({
                status: 200,
                message: `Berhasil menambahkan produk ${produk.nama}`,
                data: result,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: err });
        });



})

router.patch('/:produkId', checkAuth, (req, res, next) => {
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
                message: `Berhasil update produk ${req.body.nama}`,
                data: doc,
            });
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.delete('/:produkId',checkAuth, (req, res, next) => {
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

router.get('/:produkId',checkAuth, (req, res, next) => {
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