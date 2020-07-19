const mongoose = require('mongoose');

const produkSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    kategori: { type: mongoose.Schema.Types.ObjectId, ref: 'Kategori', require: true },
    image_url: { type: String, required: true },
    nama: String,
    harga: { type: Number, required: true },
    stok: Number,
    kategori: String,
})

module.exports = mongoose.model('Produk', produkSchema);