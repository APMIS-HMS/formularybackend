// rxnconso-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const rxnconso = new Schema({
        RXCUI: { type: String, required: false },
        LAT: { type: String, required: false },
        TS: { type: String, required: false },
        LUI: { type: String, required: false },
        STT: { type: String, required: false },
        SUI: { type: String, required: false },
        ISPREF: { type: String, required: false },
        RXAUI: { type: String, required: false },
        SAUI: { type: String, required: false },
        SCUI: { type: String, required: false },
        SDUI: { type: String, required: false },
        SAB: { type: String, required: false },
        TTY: { type: String, required: false },
        CODE: { type: String, required: false },
        STR: { type: String, required: false },
        SRL: { type: String, required: false },
        SUPPRESS: { type: String, required: false },
        CVF: { type: String, required: false }
    });

    return mongooseClient.model('rxnconso', rxnconso);
};