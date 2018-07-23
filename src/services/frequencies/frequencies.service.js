// Initializes the `frequencies` service on path `/frequencies`
const createService = require('feathers-mongoose');
const createModel = require('../../models/frequencies.model');
const hooks = require('./frequencies.hooks');

module.exports = function(app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/frequencies', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('frequencies');

    service.hooks(hooks);
};