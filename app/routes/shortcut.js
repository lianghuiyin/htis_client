import Ember from 'ember';

export default Ember.Route.extend({
	parentControllerName:"start",
    controllerName:"shortcut",
    beforeModel(transition) {
        var sessionController = this.controllerFor("session");
        sessionController.checkSession(transition);
    },
    activate(){
        this.send("unloadArchiveds");
        let c_controller = this.controllerFor("changeset");
        //进入加油单列表，需要暂停changeset抓取
        c_controller.set("isPaused",true);
        let controller = this.controllerFor(this.controllerName);
        //进入加油单列表，需要清除所有加油单
        controller.send("clearReportsAndBills");
        controller.send("loadData");
        return true;
    },
    deactivate(){
        let controller = this.controller;
        controller.send("clearReportsAndBills");
        controller.get("errorsForReports").clear();
        controller.get("errorsForBills").clear();
        controller.set("totalCount",0);
        //离开加油单列表，需要恢复changeset抓取
        let c_controller = this.controllerFor("changeset");
        c_controller.set("isPaused",false);
        return true;
    },
    actions:{
        goPreference(){
            this.transitionTo("shortcut.preference");
        },
        goBack(){
            this.transitionTo(this.parentControllerName);
        }
    }
});
