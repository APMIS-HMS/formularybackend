const assert = require('assert');
const app = require('../../src/app');

describe('\'product-imgs\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-imgs');

    assert.ok(service, 'Registered the service');
  });
});
