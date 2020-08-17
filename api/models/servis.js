const mongoose = require('mongoose');

const servisSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    bengkel: { type: mongoose.Schema.Types.ObjectId, ref: 'Bengkel', require: true },
    produk: { type: mongoose.Schema.Types.ObjectId, ref: 'Produk' },
    jumlah_produk: { type: Number, default: 1 },
    jenis_servis: String,
    nomor_telp: String,
    merk_motor: String,
    keterangan_user: String,
    keterangan_bengkel: String,
    biaya_servis: Number,
    isService: Boolean,

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