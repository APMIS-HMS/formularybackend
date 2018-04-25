/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        if (params.query.search == undefined || params.query.search.length >= 4) {
            const consoService = this.app.service('rxnconso');
            const awaitConsoService = await consoService.find({
                query: {
                    STR: {
                        $regex: params.query.search,
                        '$options': 'i'
                    },
                    'SAB': 'RXNORM',
                    'TTY': 'SCD'
                }
            });
            console.log(params.query.search);
            console.log(awaitConsoService);
            const data = awaitConsoService.data.map(this.reFactorPrescriptionData);
            awaitConsoService.data = data;
            return jsend.success(awaitConsoService);
        } else {
            return jsend.fail({ validation: ['search is required and must be more than 3 characters!!!'] });
        }
    }

    reFactorPrescriptionData(data) {
        return { id: data._id, name: data.STR, code: data.RXCUI };
    }

    async get(id, params) {
        const relService = this.app.service('rxnrel');
        const consoService = this.app.service('rxnconso');

        const awaitSelectedConsoService = await consoService.find({
            query: {
                'RXCUI': id,
                'SAB': 'RXNORM',
                'TTY': 'SCD'
            }
        });

        if (awaitSelectedConsoService.data.length > 0) {
            const awaitDoseForm = await relService.find({
                query: {
                    'RXCUI1': id,
                    'RELA': 'dose_form_of'
                }
            });
            if (awaitDoseForm.data.length > 0) {
                const rela = awaitDoseForm.data[0];
                const relaCUI = rela.RXCUI2;


                const awaitConsoService = await consoService.find({
                    query: {
                        'RXCUI': relaCUI,
                        'SAB': 'RXNORM'
                    }
                });
                const sub = awaitConsoService.data.map(this.reFactorPrescriptionData);
                const main = awaitSelectedConsoService.data.map(this.reFactorPrescriptionData);
                awaitSelectedConsoService.data = main;
                awaitSelectedConsoService.data.forEach(main => {
                    main.dose_form = sub;
                });
                return jsend.success(awaitSelectedConsoService);
            } else {
                return jsend.fail({ validation: ['supplied code does not exist on APMIS FORMULARY'] });
            }
        } else {
            return jsend.fail({ validation: ['supplied code does not exist on APMIS FORMULARY'] });
        }



    }
    reFactorPrescriptionWithDoseFormData(conso) {
        let main = { id: conso._id, name: conso.STR, code: conso.RXCUI, dose_form: null };
        return main;
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