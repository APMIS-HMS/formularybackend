// Initializes the `search-products` service on path `/search-products`
const createService = require('./search-products.class.js');
const hooks = require('./search-products.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'search-products',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/search-products', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('search-products');

  service.hooks(hooks);
};
