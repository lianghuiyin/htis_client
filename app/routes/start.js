import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel(transition) {
        var sessionController = this.controllerFor("session");
        sessionController.checkSession(transition);
    },
    model(){
        return this.store.peekAll("bill");
    },
    actions:{
    	goSetting(){
            this.transitionTo('setting');
    	},
        goManage(){
            this.transitionTo('manage');
        },
        goHistory(){
            this.transitionTo('history');
        },
        goShortcut(){
            this.transitionTo('shortcut');
        },
        goValids(){
            // this.transitionTo('valids');
        },
        goOnline(){
            this.transitionTo('online');
        },
        goScanning(){
            this.transitionTo('scanning');
        },
        goBill(bill){
            this.transitionTo('start.bill',bill);
        }
    }
});
