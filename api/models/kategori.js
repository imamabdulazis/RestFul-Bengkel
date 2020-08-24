const mongoose = require('mongoose');

const kategoriSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    nama_kategori: { type: String, require: true },
    bengkel: { type: mongoose.Schema.Types.ObjectId, ref: 'Bengkel', require: true }
})

kategoriSchema.pre('save', function (next) {
    now =  new Date().toISOString()
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
})

module.exports = mongoose.model('Kategori', kategoriSchema);