/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
	constructor(options) {
		this.options = options || {};
	}

	async find(params) {
		const consoService = this.app.service('rxnconso');
		const conditions = [ 'RXNORM', 'RXNORM NG' ];
		if (params.query.search_ingredient) {
			let brands = await consoService.find({
				query: {
					TTY: 'IN',
					SAB: {
						$in: conditions
					},
					STR: {
						$regex: params.query.search,
						$options: 'i'
					},
					$limit: params.query.$limit ? params.query.$limit : 10
				}
			});
			const sub = brands.data.map(this.reFactorPrescriptionData);
			return jsend.success(sub);
		} else {
			let brands = await consoService.find({
				query: {
					TTY: 'SCD',
					SAB: {
						$in: conditions
					},
					STR: {
						$regex: params.query.search,
						$options: 'i'
					},
					$limit: params.query.$limit ? params.query.$limit : 10
				}
			});
			const sub = brands.data.map(this.reFactorPrescriptionData);
			return jsend.success(sub);
		}
	}

	async get(id, params) {
		const relService = this.app.service('rxnrel');
		const consoService = this.app.service('rxnconso');
		let emptyConditions = [];
		if (params.query.sab !== undefined) {
			emptyConditions.push(params.query.sab);
		}

		const conditions = params.query.sab === undefined ? [ 'RXNORM NG' ] : emptyConditions;

		let awaitSelectedConsoService;
		if (params.query.id !== undefined) {
			awaitSelectedConsoService = await consoService.get(params.query.id, {});
		} else {
			awaitSelectedConsoService = await consoService.find({
				query: {
					RXCUI: id,
					TTY: 'SCD',
					SAB: {
						$in: conditions
					}
				}
			});
		}

		if (
			(awaitSelectedConsoService.data !== undefined && awaitSelectedConsoService.data.length > 0) ||
			awaitSelectedConsoService !== undefined
		) {
			const awaitConstitutes = await relService.find({
				query: {
					RXCUI1: id,
					$or: [
						{
							RELA: 'constitutes'
						},
						{
							RELA: 'dose_form_of'
						}
					],
					SAB: {
						$in: conditions
					}
				}
			});

			if (awaitConstitutes.data.length > 0) {
				let awaitConstitutesData = awaitConstitutes.data;
				const constituteIdList = [];
				const doseFormIdList = [];
				awaitConstitutesData.forEach((record) => {
					if (record.RELA == 'constitutes') {
						constituteIdList.push(record.RXCUI2);
					} else {
						doseFormIdList.push(record.RXCUI2);
					}
				});
				let awaitedConstituentList = await consoService.find({
					query: {
						RXCUI: {
							$in: constituteIdList
						},
						$limit: false,
						SAB: {
							$in: conditions
						}
					}
				});
				let awaitedDoseFormList = await consoService.find({
					query: {
						RXCUI: {
							$in: doseFormIdList
						},
						$limit: false,
						SAB: {
							$in: [ 'RXNORM' ]
						}
					}
				});
				const sub = awaitedConstituentList.data.map(this.reFactorPrescriptionData);
				const sub2 = awaitedDoseFormList.data.map(this.reFactorPrescriptionData);

				if (params.query.id !== undefined) {
					let refac = this.reFactorPrescriptionData(awaitSelectedConsoService);
					refac.ingredient_strengths = sub;
					refac.dose_form = sub2;
					if (params.query.include_details) {
						return jsend.success({
							result: refac,
							mainResult: awaitConstitutes
						});
					} else {
						return jsend.success(refac);
					}
				} else {
					const main = awaitSelectedConsoService.data.map(this.reFactorPrescriptionData);
					awaitSelectedConsoService.data = main;
					awaitSelectedConsoService.data.forEach((main) => {
						main.ingredient_strengths = sub;
						main.dose_form = sub2;
					});
					if (param.query.include_details) {
						return jsend.success({
							result: awaitSelectedConsoService.data[0],
							mainResult: awaitConstitutes
						});
					} else {
						return jsend.success(awaitSelectedConsoService.data[0]);
					}
				}
			} else {
				return jsend.fail({
					validation: [ 'supplied code does not exist on APMIS FORMULARY' ]
				});
			}
		} else {
			return jsend.fail({
				validation: [ 'supplied code does not exist on APMIS FORMULARY' ]
			});
		}
	}

	reFactorPrescriptionData(data) {
		if (data.numerator_unit === undefined || data.numerator_unit === null) {
			return {
				id: data._id,
				name: data.STR,
				code: data.RXCUI,
				sab: data.SAB
			};
		} else if (data.numerator_unit !== undefined && data.denominator_unit !== undefined) {
			return {
				id: data._id,
				name: data.STR,
				code: data.RXCUI,
				sab: data.SAB,
				numerator_unit: data.numerator_unit,
				numerator_value: data.numerator_value,
				denominator_unit: data.denominator_unit,
				denominator_value: data.denominator_value
			};
		} else if (data.numerator_unit !== undefined) {
			return {
				id: data._id,
				name: data.STR,
				code: data.RXCUI,
				sab: data.SAB,
				numerator_unit: data.numerator_unit,
				numerator_value: data.numerator_value
			};
		}
	}

	create(data, params) {
		if (Array.isArray(data)) {
			return Promise.all(data.map((current) => this.create(current)));
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
		return Promise.resolve({
			id
		});
	}

	setup(app) {
		this.app = app;
	}
}

module.exports = function(options) {
	return new Service(options);
};

module.exports.Service = Service;
