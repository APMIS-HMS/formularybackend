/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const consoService = this.app.service('rxnconso');
    const conditions = ['DF'];
    let drugForms = await consoService.find({
      query: {
        TTY: {
          $in: conditions
        },
        SAB: 'RXNORM',
        $select: ['STR'],
        $limit: false
      }
    });

    return drugForms;
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return Promise.resolve(data);
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({
      id
    });
  }

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
