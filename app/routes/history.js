import Ember from 'ember';

export default Ember.Route.extend({
    activate(){
        let controller = this.controllerFor("history");
        controller.set("isActive",true);
        return this;
    },
    deactivate(){
        this.send("unloadArchiveds");
        let controller = this.controllerFor("history");
        controller.set("isActive",false);
        return this;
    },
    actions:{
        didTransition() {
            if(this.controller.get("equipment.isXs")){
                return;
            }
            //当发现没有选项时选中默认的roles
            if(!this.controller.get("selection")){
                this.replaceWith('history.bills');
            }
        },
        goHome(){
            this.transitionTo('start');
        },
        goBills(){
            this.transitionTo('history.bills');
        },
        goReports(){
            this.transitionTo('history.reports');
        }
    }
});
