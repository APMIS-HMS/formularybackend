const assert = require('assert');
const app = require('../../src/app');

describe('\'prescriptions\' service', () => {
  it('registered the service', () => {
    const service = app.service('prescriptions');

    assert.ok(service, 'Registered the service');
  });
});
