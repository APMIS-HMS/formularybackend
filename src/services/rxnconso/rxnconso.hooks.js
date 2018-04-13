const { authenticate } = require('@feathersjs/authentication').hooks;
const CacheMap = require('@feathers-plus/cache');
const { cache } = require('feathers-hooks-common');
cacheMap = CacheMap({ max: 100 });
module.exports = {
    before: {
        all: [cache(cacheMap)],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [cache(cacheMap)],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};