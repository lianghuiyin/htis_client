import DS from 'ember-data';

export default DS.Model.extend({
    car: DS.belongsTo('car',{ async: false }),
    creater: DS.belongsTo('user', { async: false }),
	created_date: DS.attr('date')
});
