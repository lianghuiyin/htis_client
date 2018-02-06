import Ember from 'ember';

export default Ember.Mixin.create({
    // controllerName: 'manage.archives.archive',
    actions:{
        didTransition() {
        	let controller = this.controller;
	    	if(controller.get("model.is_archived")){
	            controller.send("enterRestoreCar");
	            return true;
	    	}
	    	else{
	    		this.send("goBack");
	    	}
        },
        willTransition(transition) {
        	let controller = this.controller;
            controller.set("confirmCancelTransition",null);
            controller.set("isConfirmingCancel",false);
            if(controller.get("isConfirmed")){
                controller.set("isConfirmed",false);
                controller.send("cancelRestoringCar");
                return true;
            }
            else if(controller.get("restoringCar.isNew")){
                this.controller.send("showCancelConfirm",transition);
                transition.abort();
            }
            else{
                controller.send("cancelRestoringCar");
                return true;
            }
        },
        goBack(){
            this.transitionTo(this.controllerName);
        }
    }
});
