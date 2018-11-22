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

  async create(data, params) {
    const consoService = this.app.service('rxnconso');
    const relService = this.app.service('rxnrel');

    if (params.query.nameLabel !== undefined) {
      let newSCD;
      let newSCDC;
      let SCDCrecords = [];
      let RELArecords = [];

      // creates SCDC object
      newSCDC = Object.assign({});
      for (const ingredient of data.ingredients) {
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
        newSCDC.RXCUI = this.getRxCUI().toString();
        newSCDC.SCUI = newSCDC.RXCUI;
        newSCDC.CODE = newSCDC.RXCUI;
        newSCDC.SAB = 'RXNORM NG';
        const createdSCDC = await consoService.create(newSCDC);
        SCDCrecords.push(createdSCDC);
      }

      // creates SCD object
      newSCD = Object.assign({});
      newSCD._id = mongoose.Types.ObjectId();
      SCDCrecords.forEach((scdc, i) => {
        if (i === 0) {
          newSCD.STR = scdc.STR;
        } else {
          newSCD.STR = newSCD.STR + ' / ' + scdc.STR;
        }
      });
      newSCD.STR = params.query.nameLabel;
      newSCD.TTY = 'SCD';
      newSCD.RXCUI = this.getRxCUI().toString();
      newSCD.SCUI = newSCD.RXCUI;
      newSCD.CODE = newSCD.RXCUI;
      newSCD.SAB = 'RXNORM NG';
      const createdSCD = await consoService.create(newSCD);

      // create rela for dose_of
      let newRELA;
      let createdRela;

      const doseForme = await consoService.get(data.doseForm.id);
      newRELA = Object.assign({});
      newRELA._id = mongoose.Types.ObjectId();
      newRELA.RXCUI1 = newSCD.RXCUI;
      newRELA.RXCUI2 = doseForme.RXCUI;
      newRELA.SAB = 'RXNORM NG';
      newRELA.RELA = 'dose_form_of';

      createdRela = await relService.create(newRELA);
      RELArecords.push(createdRela);

      // // create rela for constittutes
      for (const scdc of SCDCrecords) {
        let newRELA;
        newRELA = Object.assign({});
        newRELA._id = mongoose.Types.ObjectId();
        newRELA.RXCUI1 = newSCD.RXCUI;
        newRELA.RXCUI2 = scdc.RXCUI;
        newRELA.SAB = 'RXNORM NG';
        newRELA.RELA = 'constitutes';
        newRELA.STYPE1 = 'CUI';

        let createdRela = await relService.create(newRELA);
        RELArecords.push(createdRela);
      }

      return {
        SCDCrecords,
        createdSCD,
        RELArecords
      };
    } else {
      // creates IN object
      let newIN = Object.assign({});
      newIN._id = mongoose.Types.ObjectId();
      newIN.STR = data.name;
      newIN.TTY = 'IN';
      newIN.RXCUI = this.getRxCUI().toString();
      newIN.SCUI = newIN.RXCUI;
      newIN.CODE = newIN.RXCUI;
      newIN.SAB = 'RXNORM NG';
      const createdIN = await consoService.create(newIN);
      return createdIN;
    }
  }

  async update(id, data, params) {
    const consoService = this.app.service('rxnconso');
    const relService = this.app.service('rxnrel');

    let newSCD;
    let newSCDC;
    let SCDCrecords = [];
    let RELArecords = [];

    const conditions = ['constitutes', 'dose_form_of'];
    let originalSCD = await consoService.get(id);
    const scdcRelData = await relService.find({
      query: {
        RXCUI1: originalSCD.RXCUI,
        RELA: {
          $in: conditions
        },
        SAB: 'RXNORM'
      }
    });

    let scdcRel;
    let originalSCDC;
    if (scdcRelData.data.length > 0) {
      for (const rel of scdcRelData.data.filter((rel) => rel.RELA === 'constitutes')) {
        scdcRel = rel;
        let scdcConsoData = await consoService.find({
          query: {
            RXCUI: scdcRel.RXCUI2,
            SAB: 'RXNORM',
            TTY: 'SCDC'
          }
        });
        if (scdcConsoData.data.length > 0) {
          originalSCDC = scdcConsoData.data[0];
        }

        // creates SCDC object
        newSCDC = Object.assign({}, originalSCD);
        for (const ingredient of data.ingredients.ingredients) {
          if (ingredient.code === originalSCDC.CODE) {
            newSCDC.STR = ingredient.ingName;
            newSCDC.OriginalRXCUI = originalSCDC.RXCUI;
            newSCDC.RXCUI = this.getRxCUI().toString();
            newSCDC.SCUI = newSCDC.RXCUI;
            newSCDC.CODE = newSCDC.RXCUI;
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
          } else {
            newSCDC.STR = ingredient.ingName;
            newSCDC.OriginalRXCUI = originalSCDC.RXCUI;
            newSCDC.RXCUI = this.getRxCUI().toString();
            newSCDC.SCUI = newSCDC.RXCUI;
            newSCDC.CODE = newSCDC.RXCUI;
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
          }

          newSCDC._id = mongoose.Types.ObjectId();
          newSCDC.TTY = 'SCDC';
          newSCDC.SAB = 'RXNORM NG';
          const createdSCDC = await consoService.create(newSCDC);
          SCDCrecords.push(createdSCDC);
        }
      }
    }

    // creates SCD object
    newSCD = Object.assign({}, originalSCD);
    newSCD._id = mongoose.Types.ObjectId();
    SCDCrecords.forEach((scdc, i) => {
      if (i === 0) {
        newSCD.STR = scdc.STR;
      } else {
        newSCD.STR = newSCD.STR + ' / ' + scdc.STR;
      }
    });
    newSCD.STR = params.query.nameLabel;
    // newSCD.STR = newSCD.STR; // + ' ' + data.ingredients.doseForm.name;
    newSCD.TTY = 'SCD';
    newSCD.OriginalRXCUI = originalSCD.RXCUI;
    newSCD.RXCUI = this.getRxCUI().toString();
    newSCD.SCUI = newSCD.RXCUI;
    newSCD.CODE = newSCD.RXCUI;



    newSCD.SAB = 'RXNORM NG';
    const createdSCD = await consoService.create(newSCD);

    // create rela for dose_of
    let newRELA;
    let createdRela;
    for (const rel of scdcRelData.data.filter((rela) => rela.RELA === 'dose_form_of')) {
      const doseForme = await consoService.get(data.ingredients.doseForm.id);
      newRELA = Object.assign({}, rel);
      newRELA._id = mongoose.Types.ObjectId();
      newRELA.RXCUI1 = newSCD.RXCUI;
      newRELA.RXCUI2 = doseForme.RXCUI;
      newRELA.SAB = 'RXNORM NG';

      createdRela = await relService.create(newRELA);
      RELArecords.push(createdRela);
    }

    // create rela for constittutes
    for (const rel of scdcRelData.data.filter((rela) => rela.RELA === 'constitutes')) {
      for (const scdc of SCDCrecords) {
        let newRELA;
        newRELA = Object.assign({}, rel);
        newRELA._id = mongoose.Types.ObjectId();
        newRELA.RXCUI1 = newSCD.RXCUI;
        newRELA.RXCUI2 = scdc.RXCUI;
        newRELA.SAB = 'RXNORM NG';

        let createdRela = await relService.create(newRELA);
        RELArecords.push(createdRela);
      }
    }

    return {
      SCDCrecords,
      createdSCD,
      RELArecords
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
