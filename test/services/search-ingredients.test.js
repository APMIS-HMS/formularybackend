const assert = require('assert');
const app = require('../../src/app');

describe('\'search-ingredients\' service', () => {
  it('registered the service', () => {
    const service = app.service('search-ingredients');

    assert.ok(service, 'Registered the service');
  });
});
