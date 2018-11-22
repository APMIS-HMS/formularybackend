const assert = require('assert');
const app = require('../../src/app');

describe('\'create-product\' service', () => {
  it('registered the service', () => {
    const service = app.service('create-product');

    assert.ok(service, 'Registered the service');
  });
});
