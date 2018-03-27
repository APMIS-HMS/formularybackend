const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const frequencyNumericUnitSchema = require('./frequency-numeric-unit');

const metadataSchema = new Schema({
    brand: { type: String, required: true },
    ingredientstrength: [{ type: String, required: false }],
    frequencynumericunit: [frequencyNumericUnitSchema],
    form: { type: String, required: true },
    route: { type: String, required: true }
}, {
    timestamps: true
});
module.exports = metadataSchema;