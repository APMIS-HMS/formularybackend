const assert = require('assert');
const app = require('../../src/app');

describe('\'search-products\' service', () => {
  it('registered the service', () => {
    const service = app.service('search-products');

    assert.ok(service, 'Registered the service');
  });
});
