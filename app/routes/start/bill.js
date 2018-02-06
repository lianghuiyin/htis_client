import Ember from 'ember';
import NavigablePaneRoute from '../../mixins/navigable-pane/route';

export default Ember.Route.extend(NavigablePaneRoute,{
	modelName:"bill",
    controllerName: 'start.bill',
	parentControllerName:"start",
    model(params){
        var curId = params['id'];
        return this.store.peekRecord(this.modelName, curId);
    },
    afterModel(model, transition) {
        if(!model){
            transition.send("goBack");
        }
    },
    activate(){
        let p_controller = this.controllerFor(this.parentControllerName);
        p_controller.set("isFolded",true);
        return this._super();
    }
});
