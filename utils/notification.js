const express = require('express');
const admin = require('./admin');
const router = express.Router();

const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

//register device

router.post('/', (req, res) => {
    var payload = {
        notification: {
            title: req.body.title,
            body: req.body.body,
        }
    };
    const registrationToken = req.body.fcmToken;

    admin.messaging().sendToDevice(registrationToken, payload, options)
        .then(response => {
            res.status(200).send("Notification sent successfully" + response)
        })
        .catch(error => {
            console.log(error);
        });
})

module.exports = router;