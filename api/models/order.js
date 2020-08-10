const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nama_keluhan: { type: String, required: true },
    merk_motor: { type: String, required: true },
    nomor_telp: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    bengkel: { type: mongoose.Schema.Types.ObjectId, ref: 'Bengkel', require: true },
})

module.exports = mongoose.model('Order', orderSchema);