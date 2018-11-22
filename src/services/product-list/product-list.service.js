// Initializes the `product-list` service on path `/product-list`
const createService = require('./product-list.class.js');
const hooks = require('./product-list.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/product-list', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('product-list');

  service.hooks(hooks);
};
