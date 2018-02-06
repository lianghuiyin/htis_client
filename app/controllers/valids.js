import Ember from 'ember';

export default Ember.Controller.extend({
    routeName:"valids",
    departments:Ember.computed(function(){
        return this.store.peekAll("department");
    })

});
