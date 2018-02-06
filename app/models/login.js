import DS from 'ember-data';

export default DS.Model.extend({
	log_id: DS.attr('number'),
	log_name: DS.attr('string'),
	log_password: DS.attr('string'),
	is_passed:DS.attr('boolean', {defaultValue: false})
});
