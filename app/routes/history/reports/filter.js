import Ember from 'ember';
import NavigablePaneRoute from '../../../mixins/navigable-pane/route';

export default Ember.Route.extend(NavigablePaneRoute,{
    controllerName: 'history.reports.filter',
	parentControllerName:"history.reports",
    activate(){
        let controller = this.controllerFor(this.controllerName);
        controller.set("isConfirmingCancel",false);
        let p_controller = this.controllerFor(this.parentControllerName);
        controller.send("syncOption",p_controller.get("filterOption"));
        return this._super();
    },
    deactivate(){
        return this._super();
    },
    actions:{
        willTransition() {
            this.set("controller.confirmCancelTransition",null);
            if(this.get("controller.isConfirmed")){
                this.set("controller.isConfirmed",false);
                return true;
            }
            else{
                return true;
            }
            return true;
        }
    }
});
