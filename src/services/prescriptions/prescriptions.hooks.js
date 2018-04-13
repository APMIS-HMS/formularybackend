const { authenticate } = require('@feathersjs/authentication').hooks;
const CacheMap = require('@feathers-plus/cache');
const { cache } = require('feathers-hooks-common');
cacheMap = CacheMap({ max: 100 }); // Keep the 100 most recently used.
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