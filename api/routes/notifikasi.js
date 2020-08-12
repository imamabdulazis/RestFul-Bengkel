const express = require('express');
const admin = require('../../utils/admin');
const router = express.Router();
const DeviceUser = require('../models/deviceUser');
const _ = require('lodash');

const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

router.post('/user/:id', (req, res) => {

    DeviceUser.find({ user: req.params.id })
        .populate('user', 'nama nomor_telp')
        .then(doc => {
            if (_.isEmpty(doc)) {
                res.status(404).json({
                    status: 404,
                    message: "Belum ada data device!"
                })
            } else {
                var payload = {
                    notification: {
                        title: req.body.nama_bengkel,
                        body: req.body.body,
                    }
                };
                admin.messaging().sendToDevice(doc[0].fcm_token, payload, options)
                    .then(response => {
                        res.status(200).json({
                            status: 200,
                            data: doc[0],
                        })
                    })
                    .catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: error,
                        })
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

module.exports = router;