const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    produk: { type: mongoose.Schema.Types.ObjectId, ref: 'Produk', require: true },
    quantity: { type: Number, default: 1 },
})

module.exports = mongoose.model('Order', orderSchema);