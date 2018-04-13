const assert = require('assert');
const app = require('../../src/app');

describe('\'rxconsos\' service', () => {
  it('registered the service', () => {
    const service = app.service('rxconsos');

    assert.ok(service, 'Registered the service');
  });
});
