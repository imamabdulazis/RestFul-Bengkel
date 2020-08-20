const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Servis = require('../models/servis');
const Antrian = require('../models/antrian');
const _ = require('lodash');



router.get('/', (req, res) => {
    Servis.find({ bengkel: req.body.bengkel_id })
        .then((result) => {
            var newArray = result.filter(function (el) {
                if (el.isService === false) {
                    return el;
                }
            });

            if (_.isEmpty(newArray)) {
                return res.status(404).json({
                    status: 404,
                    message: "Belum ada data servis!"
                })
            } else {
                let nomor = newArray.findIndex(x => x.user == req.body.user_id);
                if (nomor < 0) {
                    return res.status(404).json({
                        status: 404,
                        message: "Belum ada data servis!"
                    })
                } else {
                    res.status(200).json({
                        status: 200,
                        message: `Anda antrian nomor ${nomor}`,
                        jml_antrian: newArray.length,
                        nomor_antrian: nomor + 1,
                    })
                }
            }
        })
})

// router.post('/', (req, res) => {

// })


module.exports = router;