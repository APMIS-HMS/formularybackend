/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        const consoService = this.app.service('products');
        let brands = await consoService.find({ query: { STR: { '$regex': params.query.search, '$options': 'i' }, $limit: (params.query.$limit) ? params.query.$limit : 10 } });
        const sub = brands.data.map(this.reFactorPrescriptionData);
        return jsend.success(sub);
    }
    reFactorPrescriptionData(data) {
        return { id: data._id, name: data.STR, code: data.RXCUI };
    }
    async get(id, params) {
        const consoService = this.app.service('products');
        let brands = await consoService.get(id);
        const sub = this.reFactorPrescriptionData(brands);
        return jsend.success(sub);
    }

    create(data, params) {
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current)));
        }

        return Promise.resolve(data);
    }

    update(id, data, params) {
        return Promise.resolve(data);
    }

    patch(id, data, params) {
        return Promise.resolve(data);
    }

    remove(id, params) {
        return Promise.resolve({ id });
    }

    setup(app) {
        this.app = app;
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;