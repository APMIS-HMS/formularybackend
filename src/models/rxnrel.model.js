// rxnrel-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const rxnrel = new Schema({
        RXCUI1: { type: String, required: false },
        RXAUI1: { type: String, required: false },
        STYPE1: { type: String, required: false },
        REL: { type: String, required: false },
        RXCUI2: { type: String, required: false },
        RXAUI2: { type: String, required: false },
        STYPE2: { type: String, required: false },
        RELA: { type: String, required: false },
        RUI: { type: String, required: false },
        SRUI: { type: String, required: false },
        SAB: { type: String, required: false },
        SL: { type: String, required: false },
        DIR: { type: String, required: false },
        RG: { type: String, required: false },
        SUPPRESS: { type: String, required: false },
        CVF: { type: String, required: false }
    }, {
        timestamps: true
    });

    return mongooseClient.model('rxnrel', rxnrel);
};