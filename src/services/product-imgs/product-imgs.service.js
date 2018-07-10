// Initializes the `product-imgs` service on path `/product-imgs`
const createService = require('feathers-mongoose');
const createModel = require('../../models/product-imgs.model');
const hooks = require('./product-imgs.hooks');
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const blobStorage = fs('./public/img/products');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'product-imgs',
    Model,
    paginate
  };

  app.use('/product-imgs', blobService({ Model: blobStorage}));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('product-imgs');

  service.hooks(hooks);
};
