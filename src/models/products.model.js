const metadataSchema = require('../viewmodels/metadata');

module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const products = new Schema({
        name: { type: String, required: true },
        metadata: { metadataSchema, required: false },
        productType: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    }, {
        timestamps: true
    });

    return mongooseClient.model('products', products);
};