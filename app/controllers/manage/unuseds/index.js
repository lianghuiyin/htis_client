import Ember from 'ember';

export default Ember.Controller.extend({
    equipment: Ember.inject.service('equipment')
});
