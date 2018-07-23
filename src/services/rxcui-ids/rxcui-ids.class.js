/* eslint-disable no-unused-vars */
class Service {
    constructor(options) {
        this.options = options || {};
    }

    find(params) {
        return Promise.resolve([]);
    }

    async get(id, params) {

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
}

function generateAUI() {
    let text = '';
    let possible = '0123456789';

    for (let i = 0; i < 6; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;