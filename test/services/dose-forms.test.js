const assert = require('assert');
const app = require('../../src/app');

describe('\'dose-forms\' service', () => {
  it('registered the service', () => {
    const service = app.service('dose-forms');

    assert.ok(service, 'Registered the service');
  });
});
