const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    nama_keluhan: { type: String, required: true },
    merk_motor: { type: String, required: true },
    nomor_telp: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    bengkel: { type: mongoose.Schema.Types.ObjectId, ref: 'Bengkel', require: true },
})

orderSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
})

module.exports = mongoose.model('Order', orderSchema);