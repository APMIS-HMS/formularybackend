// Initializes the `get-scdc-by-sbd-code` service on path `/get-scdc-by-sbd-code`
const createService = require('./get-scdc-by-sbd-code.class.js');
const hooks = require('./get-scdc-by-sbd-code.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/get-scdc-by-sbd-code', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('get-scdc-by-sbd-code');

  service.hooks(hooks);
};
