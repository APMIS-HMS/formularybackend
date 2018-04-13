// Initializes the `prescriptions` service on path `/prescriptions`
const createService = require('./prescriptions.class.js');
const hooks = require('./prescriptions.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'prescriptions',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/prescriptions', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('prescriptions');

    service.hooks(hooks);
};