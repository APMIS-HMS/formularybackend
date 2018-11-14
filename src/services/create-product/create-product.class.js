/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const consoService = this.app.service('rxnconso');
    const conditions = ['PIN', 'MIN'];
    let brands = await consoService.find({
      query: {
        TTY: {
          $in: conditions
        },
        SAB: 'RXNORM',
        STR: {
          $regex: params.query.search,
          $options: 'i'
        },
        $limit: params.query.$limit ? params.query.$limit : 10,
        $skip: params.query.$skip ? params.query.$skip : 0
      }
    });

    return brands;
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    const consoService = this.app.service('rxnconso');
    const conditions = ['PIN', 'MIN'];
    let pin = await consoService.get(data.pin);

    if (data.pinName !== undefined) {
      // create a new PIN object
      //check if pinName is existing //TODO
      let newPIN = Object.assign({}, pin);
      newPIN._id = mongoose.Types.ObjectId();
      newPIN.STR = data.pinName;
      newPIN.SAB = pin.SAB + ' NG';


      pin = await consoService.create(newPIN);
      pin = await consoService.get(newPIN._id);
    }

    // creates SCDC object
    let newSCDC = Object.assign({}, pin);
    newSCDC._id = mongoose.Types.ObjectId();
    newSCDC.STR = pin.STR + ' ' + data.strength;
    newSCDC.TTY = 'SCDC';
    newSCDC.RXCUI = this.getRxCUI().toString();
    newSCDC.SCUI = newSCDC.RXCUI;
    newSCDC.CODE = newSCDC.RXCUI;
    if (data.pinName == undefined) {
      newSCDC.SAB = newSCDC.SAB + ' NG';
    }
    await consoService.create(newSCDC);


    // creates SCD object
    let newSCD = Object.assign({}, newSCDC);
    newSCD._id = mongoose.Types.ObjectId();
    newSCD.STR = newSCD.STR + ' ' + data.drugForm;
    newSCD.TTY = 'SCD';
    newSCD.RXCUI = this.getRxCUI().toString();
    newSCD.SCUI = newSCD.RXCUI;
    newSCD.CODE = newSCD.RXCUI;
    await consoService.create(newSCD);

    // creates SBD object
    let newSBD = Object.assign({}, newSCD);
    newSBD._id = mongoose.Types.ObjectId();
    newSBD.STR = newSCD.STR + ' [' + data.brandName + ']';
    newSBD.TTY = 'SBD';
    newSBD.RXCUI = this.getRxCUI().toString();
    newSBD.SCUI = newSBD.RXCUI;
    newSBD.CODE = newSBD.RXCUI;
    await consoService.create(newSBD);

    // let brands = await consoService.find({
    //     query: {
    //         'TTY': {
    //             $in: conditions
    //         },
    //         'SAB': 'RXNORM',
    //         STR: {
    //             '$regex': params.query.search,
    //             '$options': 'i'
    //         },
    //         $limit: (params.query.$limit) ? params.query.$limit : 10
    //     }
    // });

    return {
      newSCDC,
      newSCD,
      newSBD
    };
  }

  getRxCUI() {
    var number = Math.floor(Math.random() * 999999) + 1;
    if (number.length == 6) {
      number = String('000000' + number).slice(-6);
    }

    return number;
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
