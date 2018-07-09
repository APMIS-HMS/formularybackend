const assert = require('assert');
const app = require('../../src/app');

describe('\'create-branded-products\' service', () => {
  it('registered the service', () => {
    const service = app.service('create-branded-products');

    assert.ok(service, 'Registered the service');
  });
});
