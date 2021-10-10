const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    date: { type: String, required: true},
    content: { type: String, },
    mount: { type: Number ,required:true },
    type: { type: String, ref: 'User', required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);