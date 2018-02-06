import DS from 'ember-data';

export default DS.Model.extend({
    project: DS.belongsTo('project',{ async: true }),
    department: DS.belongsTo('department',{ async: true }),
    oil: DS.belongsTo('oil',{ async: true }),
    volume: DS.attr('number'),
    created_date: DS.attr('date')
});

