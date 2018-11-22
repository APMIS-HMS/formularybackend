const assert = require('assert');
const app = require('../../src/app');

describe('\'strength-units\' service', () => {
  it('registered the service', () => {
    const service = app.service('strength-units');

    assert.ok(service, 'Registered the service');
  });
});
