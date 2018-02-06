import Ember from 'ember';

export default Ember.Mixin.create({
    // controllerName: 'manage.releases.release',
    // statusName:'isReleased',
    actions:{
        didTransition() {
            let controller = this.controller;
            if(this.statusName === "isSearch" || controller.get(`model.${this.statusName}`)){
                controller.send("enterArchivingCar");
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
                controller.send("cancelArchivingCar");
                return true;
            }
            else if(controller.get("archivingCar.isNew")){
                this.controller.send("showCancelConfirm",transition);
                transition.abort();
            }
            else{
                controller.send("cancelArchivingCar");
                return true;
            }
        },
        goBack(){
            this.transitionTo(this.controllerName);
        }
    }
});
