const mongoose = require('mongoose');

const deviceUserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    fcm_token: { type: String, required: true },
    systemName: { type: String, required: true },
    systemVersion: { type: String, required: true },
    getManufacturer: { type: String, required: true },
})

deviceUserSchema.pre('save', function (next) {
    now =  new Date().toISOString()
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
})

module.exports = mongoose.model('DeviceUser', deviceUserSchema);