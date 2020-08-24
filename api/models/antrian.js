const mongoose = require('mongoose');

const antrianSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    nomor_antrian: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
})

antrianSchema.pre('save', function (next) {
    now = new Date().toISOString();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
})

module.exports = mongoose.model('Antrian', antrianSchema);