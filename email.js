var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');

var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

smtpTransport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: 'ariyae31@gmail.com',
        pass: 'KMZWAY87AA'
    }
}));

router.post('/send', (req, res) => {
    if (req.body.email) {
        readHTMLFile(__dirname + '/public/email.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                username: "John Doe"
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'ariyae31@email.com',
                to: req.body.email,
                subject: 'Pendaftaran BengkelTA',
                html: htmlToSend
            };
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    return res.status(500).json({
                        status: 500,
                        message: error
                    })
                } else {
                    return res.status(200).json({
                        status: 200,
                        email: req.body.email,
                        message: response.response
                    })
                }
            });
        });
    } else {
        res.status(500).json({
            status: 200,
            message: "Email belum ada!"
        })
    }
});

module.exports = router;
