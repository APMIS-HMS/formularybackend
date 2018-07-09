// Initializes the `rxcui-ids` service on path `/rxcui-ids`
const createService = require('./rxcui-ids.class.js');
const hooks = require('./rxcui-ids.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'rxcui-ids',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/rxcui-ids', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('rxcui-ids');

  service.hooks(hooks);
};
