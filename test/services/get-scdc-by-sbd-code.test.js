const assert = require('assert');
const app = require('../../src/app');

describe('\'get-scdc-by-sbd-code\' service', () => {
  it('registered the service', () => {
    const service = app.service('get-scdc-by-sbd-code');

    assert.ok(service, 'Registered the service');
  });
});
