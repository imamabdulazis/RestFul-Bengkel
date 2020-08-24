const mongoose = require('mongoose');


const userAdminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date },
    updated_at: { type: Date },
    image_url: { type: String, required: true },
    nama: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

userAdminSchema.pre('save', function (next) {
    now =  new Date().toISOString()
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
})

module.exports = mongoose.model('userAdmin', userAdminSchema);