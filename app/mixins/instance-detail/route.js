import Ember from 'ember';

export default Ember.Mixin.create({
    actions:{
        willTransition(transition) {
            let controller = this.controller;
            controller.set("confirmCancelTransition",null);
            if(controller.get("isConfirmed")){
                controller.set("isConfirmed",false);
                if(controller.get("isCreatingTrace")){
                    controller.send("cancelCreatingTrace");
                }
                else if(controller.get("isRecapturing")){
                    controller.send("cancelRecapturingTrace");
                }
                else if(controller.get("isChecking")){
                    controller.send("cancelChecking");
                }
                else if(controller.get("isForbidding")){
                    controller.send("cancelForbidding");
                }
                else if(controller.get("isEnabling")){
                    controller.send("cancelEnabling");
                }
                else if(controller.get("isAborting")){
                    controller.send("cancelAborting");
                }
                else if(controller.get("isArchiving")){
                    controller.send("cancelArchivingInstance");
                }
                controller.set("isConfirmingCancel",false);
                return this._super();
            }
            else if(controller.get("isCreatingTrace") || controller.get("isRecapturing") || controller.get("isChecking") || controller.get("isForbidding") || controller.get("isEnabling") || controller.get("isAborting") || controller.get("isArchiving")){
                controller.send("showCancelConfirm",transition);
                transition.abort();
            }
            else{
	        	return this._super();
            }
        },
        goCarArchive(){
            let routeName = this.controller.get("routeName");
            this.transitionTo(`${routeName}.archive`);
        },
        goCarRestore(){
            let routeName = this.controller.get("routeName");
            this.transitionTo(`${routeName}.restore`);
        },
        goNewInstance(){
            let routeName = this.controller.get("routeName");
            this.transitionTo(`${routeName}.newinstance`);
        }
    }
});
