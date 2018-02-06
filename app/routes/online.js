import Ember from 'ember';

export default Ember.Route.extend({
	parentControllerName:"start",
    beforeModel(transition) {
        var sessionController = this.controllerFor("session");
        sessionController.checkSession(transition);
    },
    model(){
        return this.store.peekAll("bill");
    },
    actions:{
        goBack(){
            this.transitionTo(this.parentControllerName);
        }
    }
});
