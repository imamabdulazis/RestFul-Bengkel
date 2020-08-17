const mongoose = require('mongoose');


const reportSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    no_transaksi: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    bengkel: { type: mongoose.Schema.Types.ObjectId, ref: 'Bengkel', require: true },
    keterangan: { type: String, required: true },
    total_harga: { type: String, required: true },
    isDeleteUser: Boolean,
})

reportSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
})

module.exports = mongoose.model('Report', reportSchema);