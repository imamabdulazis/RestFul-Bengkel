const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Kategori = require('../models/kategori');
const Produk = require('../models/produk');
const Multer = require('multer');
const { uploadImageToStorage } = require('../../utils/uploader');


const multer = Multer({
    storage: Multer.memoryStorage(),
    // limits: {
    //     fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    // }
});

router.get('/', (req, res) => {
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

router.post('/', multer.single('produkImage'), (req, res) => {
    Kategori.findById(req.body.kategoriId)
        .then(kategori => {
            if (!kategori) {
                res.status(404).json({
                    status: 404,
                    message: "Kategori tidak ditemukan"
                })
            }
            let file = req.file;
            if (file) {
                uploadImageToStorage(file).then((success) => {
                    const produk = new Produk({
                        _id: new mongoose.Types.ObjectId(),
                        created_at: new Date().toISOString(),
                        bengkel: req.body.bengkelId,
                        kategori: req.body.kategoriId,
                        image_url: success,
                        nama: req.body.nama,
                        harga: req.body.harga,
                        stok: req.body.stok,
                        status: req.body.status
                    })
                    return produk.save();
                }).catch((error) => {
                    console.error(error);
                    res.status(500).json({ status: 500, message: err });
                });
            } else {
                res.status(500).json({
                    status: 500,
                    message: "Tidak ada gambar"
                });
            }

        })
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

router.patch('/:produkId', (req, res) => {
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

router.patch('/image/:produkId', multer.single('produkImage'), (req, res) => {
    const id = req.params.produkId;

    let file = req.file;
    if (file) {
        uploadImageToStorage(file).then((success) => {
            Produk.update({ _id: id }, { $set: { image_url: success } })
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

router.delete('/:produkId', (req, res) => {
    const id = req.params.produkId;

    Produk.remove({ _id: id })
        .exec()
        .then(() => {
            res.status(200).json({
                status: 200,
                message: "Berhasil menghapus produk",
            })
        })
        .catch(err => {
            res.status(500).json({ status: 500, message: err });
        })
})

router.get('/:produkId', (req, res) => {
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