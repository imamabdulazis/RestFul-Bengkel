const mongoose = require('mongoose');

const servisSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    produk: { type: mongoose.Schema.Types.ObjectId, ref: 'Produk', require: true },
    jumlah_produk: { type: Number, default: 1 },
    jenis_servis: String,
    total_bayar: Number,
    keterangan: String,

})

module.exports = mongoose.model('Servis', servisSchema);