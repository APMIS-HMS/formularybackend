/* eslint-disable no-unused-vars */
const jsend = require('jsend');

let format = require('date-fns/format');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
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
    const rxnconsoService = this.app.service('rxnconso');
    const rxnrelService = this.app.service('rxnrel');
    const productService = this.app.service('products');
    const matService = this.app.service('manufacturers');
    const imgProductUploadService = this.app.service('product-imgs');
    //Start Save SBD
    let consosObject = {
      "RXCUI": "",
      "SUI": "",
      "RXAUI": "",
      "SAUI": "",
      "SCUI": "",
      "TTY": "",
      "CODE": "",
      "STR": ""
    };
    const checkBN = await rxnconsoService.find({
      query: {
        'TTY': 'BN',
        'STR': data.BN
      }
    }).collation({
      locale: 'en',
      strength: 2
    });

    const checkMAT = await matService.find({
      query: {
        'MAT': data.MAT
      }
    }).collation({
      locale: 'en',
      strength: 2
    });

    if (checkMAT.data.length === 0) {
      await matService.create({'name':data.MAT});
    }

    let customRxcuiUniqueNo = generateAUI();
    let customRxauiSauiNo = generateAUI();
    consosObject.RXCUI = 'NIG' + customRxcuiUniqueNo;
    consosObject.SCUI = consosObject.RXCUI;
    consosObject.RXAUI = 'NIG' + customRxauiSauiNo;
    consosObject.SAUI = consosObject.RXAUI;
    consosObject.CODE = consosObject.RXCUI;
    consosObject.TTY = 'SBD';
    consosObject.STR = data.SCD.STR + '[' + data.BN + ']';
    consosBnObject.MAT = data.MAT;
    const savedRxnconsos = await rxnconsoService.create(consosObject);
    //End Save SBD

    //Start Save BN
    let consosBnObject = {
      "RXCUI": "",
      "SUI": "",
      "RXAUI": "",
      "SAUI": "",
      "SCUI": "",
      "TTY": "",
      "CODE": "",
      "STR": ""
    };
    let savedBnRxnconsos = {};
    if (checkBN.data.length === 0) {
      let customBnRxcuiUniqueNo = generateAUI();
      let customBnRxauiSauiNo = generateAUI();
      consosBnObject.RXCUI = 'NIG' + customBnRxcuiUniqueNo;
      consosBnObject.SCUI = consosBnObject.RXCUI;
      consosBnObject.RXAUI = 'NIG' + customBnRxauiSauiNo;
      consosBnObject.SAUI = consosObject.RXAUI;
      consosBnObject.CODE = consosObject.RXCUI;
      consosBnObject.TTY = 'BN';
      consosBnObject.STR = data.BN;
      consosBnObject.MAT = data.MAT;
      savedBnRxnconsos = await rxnconsoService.create(consosBnObject);
    } else {
      savedBnRxnconsos = checkBN.data[0];
    }


    //End Save BN
    let rxnrel_data = [];
    let rxnrel_data_item = {};
    
    //Create SCD and SBD
    let rexRelsObject = {
      "RXCUI1": "",
      "RXAUI1": "",
      "STYPE1": "",
      "REL": "",
      "RXCUI2": "",
      "RXAUI2": "",
      "STYPE2": "",
      "RELA": "",
      "RUI": "",
      "SRUI": "",
      "SAB": "",
      "SL": "",
      "DIR": "",
      "RG": "",
      "SUPPRESS": "",
      "CVF": ""
    };
    rexRelsObject.RXCUI1 = data.SCD.RXCUI;
    rexRelsObject.RXCUI2 = savedRxnconsos.RXCUI;
    rexRelsObject.RELA = 'quantified_form_of';
    rexRelsObject.SAB = 'NIG';
    rexRelsObject.STYPE1 = 'CUI';
    rexRelsObject.STYPE2 = 'CUI';
    rexRelsObject.REL = 'NIG';
    rexRelsObject.RUI = generateAUI();
    const saved_SCD_SBD_Rxnrel = await rxnrelService.create(rexRelsObject);
    rxnrel_data_item.SCD_SBD_Rxnrel = saved_SCD_SBD_Rxnrel;
    //Create SBD and SCD
    let rexRelsObject_2 = {
      "RXCUI1": "",
      "RXAUI1": "",
      "STYPE1": "",
      "REL": "",
      "RXCUI2": "",
      "RXAUI2": "",
      "STYPE2": "",
      "RELA": "",
      "RUI": "",
      "SRUI": "",
      "SAB": "",
      "SL": "",
      "DIR": "",
      "RG": "",
      "SUPPRESS": "",
      "CVF": ""
    };
    rexRelsObject_2.RXCUI1 = savedRxnconsos.RXCUI;
    rexRelsObject_2.RXCUI2 = data.SCD.RXCUI;
    rexRelsObject_2.RELA = 'has_quantified_form';
    rexRelsObject_2.SAB = 'NIG';
    rexRelsObject_2.STYPE1 = 'CUI';
    rexRelsObject_2.STYPE2 = 'CUI';
    rexRelsObject_2.REL = 'NIG';
    rexRelsObject_2.RUI = generateAUI();
    const saved_SBD_SCD_Rxnrel = await rxnrelService.create(rexRelsObject_2);
    rxnrel_data_item.SBD_SCD_Rxnrel = saved_SBD_SCD_Rxnrel;
    //Create BN and SBD
    let rexRelsObject_3 = {
      "RXCUI1": "",
      "RXAUI1": "",
      "STYPE1": "",
      "REL": "",
      "RXCUI2": "",
      "RXAUI2": "",
      "STYPE2": "",
      "RELA": "",
      "RUI": "",
      "SRUI": "",
      "SAB": "",
      "SL": "",
      "DIR": "",
      "RG": "",
      "SUPPRESS": "",
      "CVF": ""
    };
    rexRelsObject_3.RXCUI1 = savedBnRxnconsos.RXCUI;
    rexRelsObject_3.RXCUI2 = savedRxnconsos.RXCUI;
    rexRelsObject_3.RELA = 'tradename_of';
    rexRelsObject_3.SAB = 'NIG';
    rexRelsObject_3.STYPE1 = 'CUI';
    rexRelsObject_3.STYPE2 = 'CUI';
    rexRelsObject_3.REL = 'NIG';
    rexRelsObject_3.RUI = generateAUI();
    const saved_BN_SBD_Rxnrel = await rxnrelService.create(rexRelsObject_3);
    rxnrel_data_item.BN_SBD_Rxnrel = saved_BN_SBD_Rxnrel;
    //Create SBD and BN
    let rexRelsObject_4 = {
      "RXCUI1": "",
      "RXAUI1": "",
      "STYPE1": "",
      "REL": "",
      "RXCUI2": "",
      "RXAUI2": "",
      "STYPE2": "",
      "RELA": "",
      "RUI": "",
      "SRUI": "",
      "SAB": "",
      "SL": "",
      "DIR": "",
      "RG": "",
      "SUPPRESS": "",
      "CVF": ""
    };
    rexRelsObject_4.RXCUI1 = savedRxnconsos.RXCUI;
    rexRelsObject_4.RXCUI2 = savedBnRxnconsos.RXCUI;
    rexRelsObject_4.RELA = 'has_tradename';
    rexRelsObject_4.SAB = 'NIG';
    rexRelsObject_4.STYPE1 = 'CUI';
    rexRelsObject_4.STYPE2 = 'CUI';
    rexRelsObject_4.REL = 'NIG';
    rexRelsObject_4.RUI = generateAUI();
    const saved_SBD_BN_Rxnrel = await rxnrelService.create(rexRelsObject_4);
    rxnrel_data_item.SBD_BN_Rxnrel = saved_SBD_BN_Rxnrel;
    //Create BN and SCD
    let rexRelsObject_5 = {
      "RXCUI1": "",
      "RXAUI1": "",
      "STYPE1": "",
      "REL": "",
      "RXCUI2": "",
      "RXAUI2": "",
      "STYPE2": "",
      "RELA": "",
      "RUI": "",
      "SRUI": "",
      "SAB": "",
      "SL": "",
      "DIR": "",
      "RG": "",
      "SUPPRESS": "",
      "CVF": ""
    };
    rexRelsObject_5.RXCUI1 = savedBnRxnconsos.RXCUI;
    rexRelsObject_5.RXCUI2 = data.SCD.RXCUI;
    rexRelsObject_5.RELA = 'tradename_of';
    rexRelsObject_5.SAB = 'NIG';
    rexRelsObject_5.STYPE1 = 'CUI';
    rexRelsObject_5.STYPE2 = 'CUI';
    rexRelsObject_5.REL = 'NIG';
    rexRelsObject_5.RUI = generateAUI();
    const saved_BN_SCD_Rxnrel = await rxnrelService.create(rexRelsObject_5);
    rxnrel_data_item.BN_SCD_Rxnrel = saved_BN_SCD_Rxnrel;
    //Create SCD and BN
    let rexRelsObject_6 = {
      "RXCUI1": "",
      "RXAUI1": "",
      "STYPE1": "",
      "REL": "",
      "RXCUI2": "",
      "RXAUI2": "",
      "STYPE2": "",
      "RELA": "",
      "RUI": "",
      "SRUI": "",
      "SAB": "",
      "SL": "",
      "DIR": "",
      "RG": "",
      "SUPPRESS": "",
      "CVF": ""
    };
    rexRelsObject_6.RXCUI1 = savedBnRxnconsos.RXCUI;
    rexRelsObject_6.RXCUI2 = data.SCD.RXCUI;
    rexRelsObject_6.RELA = 'has_tradename';
    rexRelsObject_6.SAB = 'NIG';
    rexRelsObject_6.STYPE1 = 'CUI';
    rexRelsObject_6.STYPE2 = 'CUI';
    rexRelsObject_6.REL = 'NIG';
    rexRelsObject_6.RUI = generateAUI();
    const saved_SCD_BN_Rxnrel = await rxnrelService.create(rexRelsObject_6);
    rxnrel_data_item.SCD_BN_Rxnrel = saved_SCD_BN_Rxnrel;
    rxnrel_data.push(rxnrel_data_item);
    
    let new_NIG_rxn_product = {};
    let product = savedRxnconsos;
    delete product._id;
    const uploadedProductImg = await imgProductUploadService.create({'uri':data.BNBase64});
    product.MAT = data.MAT;
    product.URL = uploadedProductImg.uri;
    const savedProduct = await productService.create(product);
    savedRxnconsos.productId = savedProduct._id;
    new_NIG_rxn_product = {
      'BN': savedBnRxnconsos,
      'SBD': savedRxnconsos,
      'RXNRELs': rxnrel_data
    };
    return jsend.success(new_NIG_rxn_product);
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

}

function generateAUI() {
  var text = '';
  var possible = '0123456789';

  for (var i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
