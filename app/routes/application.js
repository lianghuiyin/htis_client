import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel(transition) {
        window.document.title = this.controllerFor("application").get("appTitle");
        let startupController = this.controllerFor("startup");
        let sessionController = this.controllerFor("session");
        if(!startupController.get("isStartupLoaded") && transition.targetName !== "startup"){
            sessionController.send("syncLocal","init");
            startupController.set("previousTransition",transition);
        }
    },
    model() {

    },
    setupController() {
    },
    actions:{
        logout(){
            this.send("unloadArchiveds");
            this.send("exitSide");
            let sessionController = this.controllerFor("session");
            sessionController.send("logout",true);
        },
        // loading: function() {
        //     return false;
        //     // var view = this.container.lookup('view:loading').append();
        //     // this.router.one('didTransition', view, 'destroy');
        // },
        error(reason) {
            Ember.Logger.error(reason);
            Ember.Logger.error(reason.stack);
            alert(reason.message);
        },
        goLogin(){
            this.transitionTo('login');
        },
        goIndex(){
            this.transitionTo('index');
        },
        goStart(){
            this.transitionTo('start');
        },
        goStartup(){
            this.transitionTo('startup');
        },
        goAccount(){
            this.transitionTo('account');
        },
        goAbout(){
            let controller = this.controller;
            controller.beginPropertyChanges();
            controller.set("isBellActive",false);
            controller.set("isAboutActive",true);
            controller.endPropertyChanges();
        },
        goBell(){
            let controller = this.controller;
            controller.beginPropertyChanges();
            controller.set("isAboutActive",false);
            controller.set("isBellActive",true);
            controller.endPropertyChanges();
        },
        exitSide(){
            let controller = this.controller;
            controller.beginPropertyChanges();
            controller.set("isAboutActive",false);
            controller.set("isBellActive",false);
            controller.endPropertyChanges();
            this.controllerFor("messages").set("isToShowAll",false);
        },
        goMessageTarget(message){
            //从通知消息链接导航到目标申请单
            let instance = message.get("instance");
            let car = instance.get("car");
            if(!car){
                return;
            }
            //启用（暂停）、禁用（恢复）及修改申请单没有通知
            if(car.get("isPending")){
                //审核通知
                this.transitionTo("manage.pendings.pending",car);
                Ember.run.next(()=>{
                    let controller = this.controllerFor("manage.pendings.pending");
                    controller.send("unfodeInstance",instance);
                });
            }
            else if(car.get("isReleased")){
                //核准通知
                this.transitionTo("manage.releases.release",car);
                Ember.run.next(()=>{
                    let controller = this.controllerFor("manage.releases.release");
                    controller.send("unfodeInstance",instance);
                });
            }
            else if(car.get("isUnused")){
                //驳回通知、取回通知、中止通知
                this.transitionTo("manage.unuseds.unused",car);
                Ember.run.next(()=>{
                    let controller = this.controllerFor("manage.unuseds.unused");
                    controller.send("unfodeInstance",instance);
                });
            }
            Ember.run.next(()=>{
                //手机上需要自动退出通知中心
                let controller = this.controllerFor("manage");
                if(controller.get("equipment.isXs")){
                    this.send("exitSide");
                }
            });
        },
        unloadArchiveds(){
            Ember.debug("unloadArchiveds");
            let store = this.store;
            store.peekAll("instance").forEach((instance)=>{
                if(instance.get("is_archived")){
                    instance.get("traces").forEach((trace)=>{
                        store.unloadRecord(trace);
                    });
                    store.unloadRecord(instance);
                }
            });
            store.peekAll("car").forEach((car)=>{
                if(car.get("is_archived")){
                    store.unloadRecord(car);
                }
            });
        },
        setRemoteDebugStatus(value){
            let controller = this.controller;
            controller.set("remoteDebugStatus",value);
        },
        fetchChangeset(){
            let controller = this.controllerFor("changeset");
            controller.send("tryFetch");
        }
    }
});
