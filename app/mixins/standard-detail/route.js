import Ember from 'ember';
import FitPaneRoute from '../../mixins/fit-pane/route';

export default Ember.Mixin.create(FitPaneRoute,{
    modelName:"",//role
    controllerName: '',//setting.roles.role
    parentControllerName:"",//setting.roles
    model(params){
        var curId = params['id'];
        var record = this.store.peekRecord(this.modelName, curId);
        if(!record && curId.indexOf("fixture") === 0){
            //如果没有找到记录，并且是fixture开头的新记录则创建一个新记录来匹配
            return this.controllerFor(this.parentControllerName).createRecord();
        }
        else{
            //注意，这里如果没有找到记录，并且不是fixture开头的新记录，将返回null
            return record;
        }
    },
    afterModel(model, transition) {
        if(!model){
            transition.send("goBack");
        }
    },
    activate(){
        return this._super();
    },
    deactivate(){
        let controller = this.controller;
        controller.set("isConfirmingDelete",false);
        controller.set("isConfirmingCancel",false);
        controller.set("isPickingError",false);
        controller.set("isPickingCustomizedMsg",false);
        return this._super();
    },
    actions:{
        didTransition() {
            let controller = this.controller;
            let p_controller = this.controllerFor(this.parentControllerName);
            p_controller.set("selection",controller.get("model"));
        },
        willTransition() {
            let p_controller = this.controllerFor(this.parentControllerName);
            p_controller.set("selection",null);
            let controller = this.controller;
            //删除数据失败需要还原
            let model = controller.get("model");
            if(model){
                model.rollbackAttributes();
            }
        },
        goBack(){
            this.transitionTo(this.parentControllerName);
        },
        goEdit(){
            this.transitionTo(`${this.controllerName}.edit`);
        }
    }
});
