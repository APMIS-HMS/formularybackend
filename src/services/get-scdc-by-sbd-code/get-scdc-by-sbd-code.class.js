/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    return Promise.resolve([]);
  }

  async get(id, params) {
    const relService = this.app.service('rxnrel');
    const consoService = this.app.service('rxnconso');

    if (!!params.query.fromSCD) {
      const awaitConstitutes = await relService.find({
        query: {
          RXCUI2: id,
          RELA: 'consists_of'
        }
      });

      const constituteList = awaitConstitutes.data.map((rel) => rel.RXCUI1);

      let awaitedConstituentList = await consoService.find({
        query: {
          RXCUI: {
            $in: constituteList
          },
          $limit: false,
          TTY: 'SCDC'
        }
      });

      const rxCUIList = awaitedConstituentList.data.map((con) => con.RXCUI);

      const awaitedIngredients = await relService.find({
        query: {
          RXCUI1: {
            $in: rxCUIList
          },
          $or: [{
              RELA: 'precise_ingredient_of'
            },
            {
              RELA: 'ingredient_of'
            }
          ]
        }
      });

      // first get those with prescice_ingredient_of to avoid duplicate
      const _withPresciceIngredients = awaitedIngredients.data.filter((con) => con.RELA === 'precise_ingredient_of');
      const _withIngredient = awaitedIngredients.data.filter((con) => con.RELA === 'ingredient_of');
      _withIngredient.forEach(_with => {
        if (_withPresciceIngredients.filter(_pre => _pre.RXCUI1 === _with.RXCUI1).length === 0) {
          _withPresciceIngredients.push(_with);
        }
      })


      const ingredientList = _withPresciceIngredients.map((con) => con.RXCUI2);

      let conditions = ['RXNORM', 'RXNORM NG']
      let awaitedIngredientList = await consoService.find({
        query: {
          RXCUI: {
            $in: ingredientList
          },
          $limit: false,
          $or: [{
              TTY: 'PIN'
            },
            {
              TTY: 'MIN'
            },
            {
              TTY: 'IN'
            }
          ],
          SAB: {
            $in: conditions
          }
        }
      });

      return awaitedIngredientList.data.length > 0 ? awaitedIngredientList.data : [];
    } else {
      const awaitConstitutes = await relService.find({
        query: {
          RXCUI1: id,
          $or: [{
            RELA: 'constitutes'
          }]
        }
      });

      const constituteList = awaitConstitutes.data.map((rel) => rel.RXCUI2);

      let awaitedConstituentList = await consoService.find({
        query: {
          RXCUI: {
            $in: constituteList
          },
          $limit: false,
          TTY: 'SCDC'
        }
      });

      const rxCUIList = awaitedConstituentList.data.map((con) => con.RXCUI);

      const awaitedIngredients = await relService.find({
        query: {
          RXCUI1: {
            $in: rxCUIList
          },
          $or: [{
              RELA: 'precise_ingredient_of'
            },
            {
              RELA: 'ingredient_of'
            }
          ]
        }
      });

      // const ingredientList = awaitedIngredients.data.map((con) => con.RXCUI2);
      // first get those with prescice_ingredient_of to avoid duplicate
      const _withPresciceIngredients = awaitedIngredients.data.filter((con) => con.RELA === 'precise_ingredient_of');
      const _withIngredient = awaitedIngredients.data.filter((con) => con.RELA === 'ingredient_of');
      _withIngredient.forEach(_with => {
        if (_withPresciceIngredients.filter(_pre => _pre.RXCUI1 === _with.RXCUI1).length === 0) {
          _withPresciceIngredients.push(_with);
        }
      })


      const ingredientList = _withPresciceIngredients.map((con) => con.RXCUI2);
      let conditions = ['RXNORM', 'RXNORM NG']
      let awaitedIngredientList = await consoService.find({
        query: {
          RXCUI: {
            $in: ingredientList
          },
          $limit: false,
          $or: [{
              TTY: 'PIN'
            },
            {
              TTY: 'MIN'
            },
            {
              TTY: 'IN'
            }
          ],
          SAB: {
            $in: conditions
          }
        }
      });

      return awaitedIngredientList.data.length > 0 ? awaitedIngredientList.data : [];
    }


  }

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
