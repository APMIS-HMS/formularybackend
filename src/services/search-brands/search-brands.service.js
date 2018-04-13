// Initializes the `search-brands` service on path `/search-brands`
const createService = require('./search-brands.class.js');
const hooks = require('./search-brands.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'search-brands',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/search-brands', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('search-brands');

    service.hooks(hooks);
};