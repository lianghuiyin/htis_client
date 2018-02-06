import Ember from 'ember';
import DS from 'ember-data';
import Startup from '../models/startup';

export default Ember.Route.extend({
    unloadAllRecord(){
        this.store.unloadAll("startup");
    },
    model() {
        var prom = this.store.createRecord("startup").save();
        prom.then(()=>{
            this.unloadAllRecord();
        },(reason)=>{
            //这里请求失败时整个model没有了要重新构建，并且返回到setupController函数后需要手动设置其model为返回值
            if(reason instanceof DS.InvalidError){
                var errors = new DS.Errors();
                Object.keys(reason.errors).forEach(function (key) {
                    errors.add(Ember.String.underscore(key), reason.errors[key]);
                });
                return {
                    errors:errors
                };
            }
            this.unloadAllRecord();
        });
        return prom;
    },
    setupController(controller, model) {
        if(!(model instanceof Startup) && model.errors){
            controller.set("model",model);
        }
        else{
            controller.set("isStartupLoaded",true);
            let sessionController = this.controllerFor("session");
            sessionController.send("syncUser");
            controller.send("doSchedules");
            controller.fixScrollBug();
            var previousTransition = controller.get("previousTransition");
            if(previousTransition){
                controller.set("previousTransition",null);
                Ember.run.next(this,function(){
                    previousTransition.retry();
                });
            }
            else{
                this.send("goIndex");
            }
        }
    }
});
