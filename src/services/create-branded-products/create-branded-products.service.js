// Initializes the `create-branded-products` service on path `/create-branded-products`
const createService = require('./create-branded-products.class.js');
const hooks = require('./create-branded-products.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'create-branded-products',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/create-branded-products', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('create-branded-products');

  service.hooks(hooks);
};
