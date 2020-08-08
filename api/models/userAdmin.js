const mongoose = require('mongoose');


const userAdminSchem = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    image_url: { type: String, required: true },
    nama: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('userAdmin', userAdminSchem);