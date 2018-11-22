// Initializes the `dose-forms` service on path `/dose-forms`
const createService = require('./dose-forms.class.js');
const hooks = require('./dose-forms.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate,
    app
  };

  // Initialize our service with any options it requires
  app.use('/dose-forms', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('dose-forms');

  service.hooks(hooks);
};
