// Initializes the `search-ingredients` service on path `/search-ingredients`
const createService = require('./search-ingredients.class.js');
const hooks = require('./search-ingredients.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'search-ingredients',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/search-ingredients', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('search-ingredients');

    service.hooks(hooks);
};