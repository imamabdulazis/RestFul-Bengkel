const mongoose = require('mongoose');

const kategoriSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nama_kategori: { type: String, require: true }
})

module.exports = mongoose.model('Kategori', kategoriSchema);