import Ember from 'ember';

export default Ember.Mixin.create({
    activate(){
        let controller = this.controllerFor(this.controllerName);
        if(controller.get("isEmptyKeyFetchable")){
	        controller.send("fetchArchivedCars");
        }
        return this._super();
    },
    deactivate(){
        let controller = this.controllerFor(this.controllerName);
        controller.send("resetListOptions");
        return this._super();
    }
});
