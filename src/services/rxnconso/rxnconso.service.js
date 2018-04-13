// Initializes the `rxnconso` service on path `/rxnconso`
const createService = require('feathers-mongoose');
const createModel = require('../../models/rxnconso.model');
const hooks = require('./rxnconso.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'rxnconso',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/rxnconso', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('rxnconso');

  service.hooks(hooks);
};
