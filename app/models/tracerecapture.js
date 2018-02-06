import DS from 'ember-data';

export default DS.Model.extend({
    trace: DS.belongsTo('trace',{ async: false }),
    instance: DS.belongsTo('instance',{ async: false }),
    car: DS.belongsTo('car',{ async: false }),
    end_info: DS.attr('string'),
    creater: DS.belongsTo('user', { async: false }),
	created_date: DS.attr('date')
});
