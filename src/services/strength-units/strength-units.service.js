// Initializes the `strength-units` service on path `/strength-units`
const createService = require('feathers-mongoose');
const createModel = require('../../models/strength-units.model');
const hooks = require('./strength-units.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/strength-units', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('strength-units');

  service.hooks(hooks);
};
