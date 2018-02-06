import DS from 'ember-data';

export default DS.Model.extend({
	instance: DS.belongsTo('instance',{ async: false,inverse: null }),
    // type: DS.attr('string',{ defaultValue: '' }),//审核通知[check]、核准通知[approve]、驳回通知[reject]、过期通知[finish]、普通通知[normal]
    // is_archived:DS.attr('boolean', {defaultValue: false}),
    title: DS.attr('string',{ defaultValue: '' }),
    icon: DS.attr('string',{ defaultValue: '' }),
    color: DS.attr('string',{ defaultValue: '' }),
    text: DS.attr('string',{ defaultValue: '' }),
    // href: DS.attr('string',{ defaultValue: '' }),
    // creater: DS.belongsTo('user', { async: false,inverse: null }),
    created_date: DS.attr('date'),
    // modifier: DS.belongsTo('user', { async: false,inverse: null }),
    // modified_date: DS.attr('date')
});
