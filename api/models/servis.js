const mongoose = require('mongoose');

const servisSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    bengkel: { type: mongoose.Schema.Types.ObjectId, ref: 'Bengkel', require: true },
    produk: { type: mongoose.Schema.Types.ObjectId, ref: 'Produk', require: true },
    jumlah_produk: { type: Number, default: 1 },
    jenis_servis: String,
    biaya_servis: Number,
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