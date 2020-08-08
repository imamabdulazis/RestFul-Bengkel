const express = require('express');
const router = express.Router();
const Bengkel = require('../models/bengkel');
const NearestCity = require('../../utils/locationBaseService');
const { get } = require('lodash');

router.post('/', (req, res) => {
    let latitude = req.body.latitude,
        longitude = req.body.longitude;

    Bengkel.find()
        .select('_id nama_bengkel latitude longitude')
        .exec()
        .then(doc => {
            if (doc.length > 1) {
                let data = doc.map(item => [item.nama_bengkel, item.latitude, item.longitude]);
                var near = NearestCity(latitude, longitude, data);

                res.status(200).json({
                    status: 200,
                    message: "Berhasil menemukan bengkel",
                    data: {
                        nama_bengkel: near[0],
                        latitude: near[1],
                        longitude: near[2],
                    }
                });
            } else {
                res.status(404).json({ status: 404, message: "Tidak ada lokasi" });
            }
        }).catch((err) => {
            res.status(500).json({ status: 500, message: err })
        })
});

router.get('/', (req, res) => {
    Bengkel.find()
        .select('_id nama_bengkel latitude longitude')
        .exec()
        .then((doc) => {
            if (doc.length > 1) {
                res.status(200).json({
                    status: 200,
                    data: doc
                })
            } else {
                res.status(404).json({ status: 404, message: "Tidak ada bengkel" })
            }
        }).catch((err) => {
            res.status(500).json({ status: 500, message: err });
        })
});

router.get('/:nama_bengkel', (req, res) => {
    Bengkel.find({ nama_bengkel: req.params.nama_bengkel })
        .select('_id image_url nama_bengkel nama_pemilik email nomor_telp alamat latitude longitude')
        .exec()
        .then((doc) => {
            if (doc.length > 0) {
                res.status(200).json({
                    status: 200,
                    data: doc
                })
            } else {
                res.status(404).json({
                    status: 404,
                    message: "Tidak ada bengkel",
                })
            }
        }).catch((err) => {
            res.status(500).json({ status: 500, message: err });
        })
})

module.exports = router;
