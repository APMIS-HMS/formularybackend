// Initializes the `create-product` service on path `/create-product`
const createService = require('./create-product.class.js');
const hooks = require('./create-product.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/create-product', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('create-product');

    service.hooks(hooks);
};