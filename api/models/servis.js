const mongoose = require('mongoose');

const servisSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    produk: { type: mongoose.Schema.Types.ObjectId, ref: 'Produk', require: true },
    jumlah_produk: { type: Number, default: 1 },
    jenis_servis: String,
    total_bayar: Number,
    keterangan: String,

})

servisSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
})

module.exports = mongoose.model('Servis', servisSchema);