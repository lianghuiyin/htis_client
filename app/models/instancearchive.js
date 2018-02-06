import DS from 'ember-data';

export default DS.Model.extend({
    instance: DS.belongsTo('instance',{ async: false }),
    traces: DS.hasMany('trace',{ async: false }),
    car: DS.belongsTo('car',{ async: false }),
    creater: DS.belongsTo('user', { async: false })
});
