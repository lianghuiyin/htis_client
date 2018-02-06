import DS from 'ember-data';

export default DS.Model.extend({
    length: DS.attr('number'),
    total: DS.attr('number'),
    last_id: DS.attr('number')
  
});
