/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const productService = this.app.service('products');
    const relService = this.app.service('rxnrel');
    const consoService = this.app.service('rxnconso');
    const conditions = ['RXNORM', 'RXNORM NG'];
    const result = await productService.find({
      query: {
        $skip: params.query.skip === undefined ? 0 : params.query.skip,
        $limit: params.query.limit === undefined ? 10 : params.query.skip,
        TTY: 'SBD',
        $select: ['STR', 'RXCUI']
      }
    });
    const codes = result.data.map(r => r.RXCUI);

    // 'RXCUI1': id,
    // $or: [{
    //       'RELA': 'constitutes'
    //     },
    //     {
    //       'RELA': 'dose_form_of'
    //     }
    //   ],
    //   SAB: {
    //     $in: conditions
    //   },
    console.log('codes', codes.length);

    const scdcRelData = await relService.find({
      query: {
        RXCUI1: {
          $in: codes
        },
        $or: [{
            'RELA': 'constitutes'
          },
          {
            'RELA': 'dose_form_of'
          }
        ],

        SAB: {
          $in: conditions
        },
        $limit: false
      }
    });

    const rxcuiList = scdcRelData.data.map(x => x.RXCUI2);
    console.log('rxcuiList', rxcuiList.length);
    const consoData = await consoService.find({
      query: {
        RXCUI: {
          $in: rxcuiList
        },
        TTY: {
          $in: ['SCDC', 'DF']
        },
        SAB: {
          $in: conditions
        },
        $limit: false
      }
    });

    result.data.forEach(conso => {
      console.log(conso);
    });


    return {
      scdcRelData,
      consoData
    };
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
