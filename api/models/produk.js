const mongoose = require('mongoose');

const produkSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    kategori: { type: mongoose.Schema.Types.ObjectId, ref: 'Kategori', require: true },
    image_url: { type: String, required: true },
    nama: String,
    harga: { type: Number, required: true },
    stok: Number,
    status: String,
});

produkSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
})

module.exports = mongoose.model('Produk', produkSchema);