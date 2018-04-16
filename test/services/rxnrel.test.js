const assert = require('assert');
const app = require('../../src/app');

describe('\'rxnrel\' service', () => {
  it('registered the service', () => {
    const service = app.service('rxnrel');

    assert.ok(service, 'Registered the service');
  });
});
