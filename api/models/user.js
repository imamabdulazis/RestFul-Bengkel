const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: false
    },
    coordinates: {
        type: [Number],
        required: false
    }
});

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    image_url: { type: String, required: true },
    nama: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    nomor_telp: { type: String, required: true },
    alamat: { type: String, required: true },
    password: { type: String, required: true },
    location: {
        type: pointSchema,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema);