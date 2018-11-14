/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return Promise.resolve(data);
  }

  async update(id, data, params) {
    // console.log('data --->:', data.ingredients);
    const consoService = this.app.service('rxnconso');
    const relService = this.app.service('rxnrel');
    // const conditions = ['PIN', 'MIN'];


    // if (data.pinName !== undefined) {
    //   // create a new PIN object
    //   //check if pinName is existing //TODO
    //   let newPIN = Object.assign({}, pin);
    //   newPIN._id = mongoose.Types.ObjectId();
    //   newPIN.STR = data.pinName;
    //   newPIN.SAB = pin.SAB + ' NG';

    //   pin = await consoService.create(newPIN);
    //   pin = await consoService.get(newPIN._id);
    // }


    // console.log('doseForm: --->', data.ingredients.doseForm);

    let newSCD;
    let newSCDC;
    // const start = async () => {
    await this.asyncForEach(data.ingredients.ingredients, async (ingredient) => {
      let originalSCD = await consoService.get(id);
      const scdcRelData = await relService.find({
        query: {
          'RXCUI1': originalSCD.RXCUI,
          'RELA': 'constitutes',
          "SAB": "RXNORM"
        }
      });
      let scdcRel;
      let originalSCDC;
      if (scdcRelData.data.length > 0) {
        scdcRel = scdcRelData.data[0];
        let scdcConsoData = await consoService.find({
          query: {
            'RXCUI': scdcRel.RXCUI2,
            'SAB': "RXNORM",
            "TTY": "SCDC"
          }
        });
        if (scdcConsoData.data.length > 0) {
          originalSCDC = scdcConsoData.data[0];
        }
      }



      // creates SCDC object
      newSCDC = Object.assign({}, originalSCD);
      newSCDC.STR = ingredient.ingName;
      ingredient.strengths.forEach((strength, i) => {

        if (i === 0) {
          newSCDC.STR = newSCDC.STR + ' ' + strength.numStrength + ' ' + strength.strengthUnit;
          newSCDC.numerator_unit = strength.strengthUnit;
          newSCDC.numerator_value = parseInt(strength.numStrength);
        } else if (i === 1) {
          newSCDC.STR = newSCDC.STR + '/';
          newSCDC.STR = newSCDC.STR + '' + strength.numStrength + ' ' + strength.strengthUnit;
          newSCDC.denominator_unit = strength.strengthUnit;
          newSCDC.denominator_value = parseInt(strength.numStrength);
        }
      });
      newSCDC._id = mongoose.Types.ObjectId();

      newSCDC.TTY = 'SCDC';
      newSCDC.RXCUI = originalSCDC.RXCUI; //this.getRxCUI().toString();
      newSCDC.SCUI = newSCDC.RXCUI;
      newSCDC.CODE = newSCDC.RXCUI;
      if (data.pinName == undefined) {
        newSCDC.SAB = newSCDC.SAB + ' NG';
      }


      // console.log("New SCDC: ", newSCDC);
      // await consoService.create(newSCDC);

      // creates SCD object
      newSCD = Object.assign({}, newSCDC);
      newSCD._id = mongoose.Types.ObjectId();
      newSCD.STR = newSCD.STR + ' ' + data.ingredients.doseForm.name;
      newSCD.TTY = 'SCD';
      newSCD.RXCUI = originalSCD.RXCUI;
      newSCD.SCUI = newSCD.RXCUI;
      newSCD.CODE = newSCD.RXCUI;
      // console.log("New SCD: ", newSCD);
      // await consoService.create(newSCD);

      // create rela for constitute



    });
    return {
      newSCDC,
      newSCD
    };
  }
  getRxCUI() {
    var number = Math.floor(Math.random() * 999999) + 1;
    if (number.length == 6) {
      number = String('000000' + number).slice(-6);
    }

    return number;
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

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
