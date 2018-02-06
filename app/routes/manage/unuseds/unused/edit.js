import Ember from 'ember';
import StandardDetailEditRoute from '../../../../mixins/standard-detail/edit-route';

export default Ember.Route.extend(StandardDetailEditRoute,{
    controllerName: 'manage.unuseds.unused',
    activate(){
        let controller = this.controllerFor(this.controllerName);
        controller.set("isBaseFolded",false);
    	return this._super();
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
