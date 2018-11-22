const assert = require('assert');
const app = require('../../src/app');

describe('\'create-scd\' service', () => {
  it('registered the service', () => {
    const service = app.service('create-scd');

    assert.ok(service, 'Registered the service');
  });
});
