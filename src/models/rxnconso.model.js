// rxnconso-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {
    Schema
  } = mongooseClient;
  const rxnconso = new Schema({
    RXCUI: {
      type: String,
      required: false
    },
    LAT: {
      type: String,
      required: false,
      'default': 'ENG',
      select: false
    },
    TS: {
      type: String,
      required: false,
      'default': '',
      select: false
    },
    LUI: {
      type: String,
      required: false,
      'default': '',
      select: false
    },
    STT: {
      type: String,
      required: false,
      'default': '',
      select: false
    },
    SUI: {
      type: String,
      required: false,
      'default': '',
      select: false
    },
    ISPREF: {
      type: String,
      required: false,
      'default': '',
      select: false
    },
    RXAUI: {
      type: String,
      required: false,
      'default': '',
      select: false
    },
    SAUI: {
      type: String,
      required: false,
      'default': '',
      select: false
    },
    SCUI: {
      type: String,
      required: false,
      'default': ''
    },
    SDUI: {
      type: String,
      required: false,
      'default': '',
      select: false
    },
    SAB: {
      type: String,
      required: false,
      'default': 'NIG'
    },
    TTY: {
      type: String,
      required: false,
      'default': ''
    },
    CODE: {
      type: String,
      required: false,
      'default': ''
    },
    STR: {
      type: String,
      required: false,
      'default': ''
    },
    SRL: {
      type: String,
      required: false,
      'default': '',
      select: false
    },
    SUPPRESS: {
      type: String,
      required: false,
      'default': '',
      select: false
    },
    CVF: {
      type: String,
      required: false,
      'default': '',
      select: false
    },
    MAT: {
      type: String,
      required: false
    }, //Product Manufacturer
    URL: {
      type: String,
      required: false
    }, //Product Brand Image URL
    REGIMENS: [{
      type: Schema.Types.Mixed,
      required: false
    }] //Product Regimen
  });

  return mongooseClient.model('rxnconso', rxnconso);
};
