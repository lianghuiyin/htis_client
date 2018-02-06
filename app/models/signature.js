import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string',{ defaultValue: "" }),
	sign: DS.attr('string',{ defaultValue: "" }),
	creater: DS.belongsTo('user', { async: false,inverse: null }),
	created_date: DS.attr('date')
});
