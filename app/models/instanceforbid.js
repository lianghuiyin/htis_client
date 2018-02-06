import DS from 'ember-data';

export default DS.Model.extend({
    trace: DS.belongsTo('trace',{ async: false }),
    instance: DS.belongsTo('instance',{ async: false }),
    car: DS.belongsTo('car',{ async: false }),
    status: DS.attr('string'),
    start_info: DS.attr('string',{ defaultValue: '' }),
    creater: DS.belongsTo('user', { async: false,inverse: null }),
	created_date: DS.attr('date')
});
