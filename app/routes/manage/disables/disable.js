import Ember from 'ember';
import StandardDetailRoute from '../../../mixins/standard-detail/route';
import InstanceListRoute from '../../../mixins/instance-list/route';
import InstanceDetailRoute from '../../../mixins/instance-detail/route';

export default Ember.Route.extend(StandardDetailRoute,InstanceListRoute,InstanceDetailRoute,{
    modelName:"car",
    controllerName: 'manage.disables.disable',
    parentControllerName:"manage.disables",
    actions:{
	    didTransition() {
        	let controller = this.controller;
	    	if(controller.get("model.isDisable")){
	    		return this._super();
	    	}
	    	else{
	    		this.send("goBack");
	    	}
	    }
	}
});
