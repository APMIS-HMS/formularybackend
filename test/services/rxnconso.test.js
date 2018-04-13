const assert = require('assert');
const app = require('../../src/app');

describe('\'rxnconso\' service', () => {
  it('registered the service', () => {
    const service = app.service('rxnconso');

    assert.ok(service, 'Registered the service');
  });
});
