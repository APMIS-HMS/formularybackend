// products-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const products = new Schema({
        name: { type: String, required: true },
        metadata: { type: Schema.Types.Mixed, required: false },
        productType: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    }, {
        timestamps: true
    });

    return mongooseClient.model('products', products);
};