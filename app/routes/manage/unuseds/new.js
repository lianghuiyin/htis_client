import Ember from 'ember';
import StandardDetailNewRoute from '../../../mixins/standard-detail/new-route';

export default Ember.Route.extend(StandardDetailNewRoute,{
    controllerName: 'manage.unuseds.unused',
    parentControllerName:"manage.unuseds",
    activate(){
        let controller = this.controllerFor(this.controllerName);
        controller.set("isBaseFolded",false);
    	return this._super();
    },
    model(){
    	return this.controllerFor("manage").createRecord();
    },
    actions:{
        willTransition(transition) {
            if(this.controllerFor("manage").get("isPowered")){
                return this._super(transition);
            }
            else{
                //在没有权限，比如退出系统时，不需要也不可以做弹出confirm框确认，因为弹出框会被none-power框替代
                return true;
            }
        }
    }
});
