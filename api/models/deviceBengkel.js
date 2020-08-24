const mongoose = require('mongoose');

const deviceBengkelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    bengkel: { type: mongoose.Schema.Types.ObjectId, ref: 'Bengkel', require: true },
    fcm_token: { type: String, required: true },
    systemName: { type: String, required: true },
    systemVersion: { type: String, required: true },
    getManufacturer: { type: String, required: true },
})

deviceBengkelSchema.pre('save', function (next) {
    now = new Date().toISOString()
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
})

module.exports = mongoose.model('DeviceBengkel', deviceBengkelSchema);