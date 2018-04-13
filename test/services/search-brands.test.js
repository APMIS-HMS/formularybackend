const assert = require('assert');
const app = require('../../src/app');

describe('\'search-brands\' service', () => {
  it('registered the service', () => {
    const service = app.service('search-brands');

    assert.ok(service, 'Registered the service');
  });
});
