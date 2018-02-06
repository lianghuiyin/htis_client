import DS from 'ember-data';

export default DS.Model.extend({
	all_cars_count: DS.attr('number',{ defaultValue: 0 }),
	archived_cars_count: DS.attr('number',{ defaultValue: 0 }),
	archived_instances_count: DS.attr('number',{ defaultValue: 0 }),
    creater: DS.belongsTo('user', { async: false,inverse: null }),
    created_date: DS.attr('date')
});
