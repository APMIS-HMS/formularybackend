/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        const consoService = this.app.service('rxnconso');
        let brands = await consoService.find({ query: { 'TTY': 'SCD', 'SAB': 'RXNORM', STR: { '$regex': params.query.search, '$options': 'i' }, $limit: (params.query.$limit) ? params.query.$limit : 10 } });
        const sub = brands.data.map(this.reFactorPrescriptionData);
        return jsend.success(sub);
    }

    async get(id, params) {
        const relService = this.app.service('rxnrel');
        const consoService = this.app.service('rxnconso');

        const awaitSelectedConsoService = await consoService.find({
            query: {
                'RXCUI': id,
                'TTY': 'SCD',
                'SAB': 'RXNORM'
            }
        });

        if (awaitSelectedConsoService.data.length > 0) {
            const awaitConstitutes = await relService.find({
                query: {
                    'RXCUI1': id,
                    $or: [
                        { 'RELA': 'constitutes' },
                        { 'RELA': 'dose_form_of' }
                    ],
                    'SAB': 'RXNORM'
                }
            });
            if (awaitConstitutes.data.length > 0) {

                let awaitConstitutesData = awaitConstitutes.data;
                const constituteIdList = [];
                const doseFormIdList = [];
                awaitConstitutesData.forEach(record => {
                    if (record.RELA == 'constitutes') {
                        constituteIdList.push(record.RXCUI2);
                    } else {
                        doseFormIdList.push(record.RXCUI2);
                    }

                });
                let awaitedConstituentList = await consoService.find({
                    query: {
                        RXCUI: { $in: constituteIdList },
                        $limit: false,
                        'SAB': 'RXNORM'
                    }
                });

                let awaitedDoseFormList = await consoService.find({
                    query: {
                        RXCUI: { $in: doseFormIdList },
                        $limit: false,
                        'SAB': 'RXNORM'
                    }
                });


                const sub = awaitedConstituentList.data.map(this.reFactorPrescriptionData);
                const sub2 = awaitedDoseFormList.data.map(this.reFactorPrescriptionData);
                const main = awaitSelectedConsoService.data.map(this.reFactorPrescriptionData);
                awaitSelectedConsoService.data = main;
                awaitSelectedConsoService.data.forEach(main => {
                    main.ingredient_strengths = sub;
                    main.dose_form = sub2;
                });
                return jsend.success(awaitSelectedConsoService.data[0]);
            } else {
                return jsend.fail({ validation: ['supplied code does not exist on APMIS FORMULARY'] });
            }
        } else {
            return jsend.fail({ validation: ['supplied code does not exist on APMIS FORMULARY'] });
        }
    }

    reFactorPrescriptionData(data) {
        return { id: data._id, name: data.STR, code: data.RXCUI };
    }

    create(data, params) {
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current)));
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
        return Promise.resolve({ id });
    }

    setup(app) {
        this.app = app;
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;