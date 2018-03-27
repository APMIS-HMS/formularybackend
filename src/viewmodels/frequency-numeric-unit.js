const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const frequencyNumericUnitSchema = new Schema({
    frequency: { type: String, required: true },
    numeric: [{ type: Number, required: false }],
    unit: { type: String, required: true }
}, {
    timestamps: true
});
module.exports = frequencyNumericUnitSchema;