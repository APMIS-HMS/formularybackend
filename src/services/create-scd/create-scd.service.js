// Initializes the `create-scd` service on path `/create-scd`
const createService = require('./create-scd.class.js');
const hooks = require('./create-scd.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/create-scd', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('create-scd');

  service.hooks(hooks);
};
