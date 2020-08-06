const mongoose = require('mongoose');

const artikelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    image_url: { type: String, require: true },
    title: { type: String, require: true },
    content: String,
    bengkel: { type: mongoose.Schema.Types.ObjectId, ref: 'Bengkel', require: true }
})

artikelSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
})

module.exports = mongoose.model('Artikel', artikelSchema);