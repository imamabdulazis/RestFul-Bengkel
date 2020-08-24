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

const bengkelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    image_url: { type: String, required: true },
    nama_bengkel: { type: String, required: true },
    nama_pemilik: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    nomor_telp: { type: String, required: true },
    alamat: { type: String, required: true },
    password: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
})

bengkelSchema.pre('save', function (next) {
    now = new Date().toISOString()
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
})

module.exports = mongoose.model('Bengkel', bengkelSchema);