const assert = require('assert');
const app = require('../../src/app');

describe('\'rxcui-ids\' service', () => {
  it('registered the service', () => {
    const service = app.service('rxcui-ids');

    assert.ok(service, 'Registered the service');
  });
});
