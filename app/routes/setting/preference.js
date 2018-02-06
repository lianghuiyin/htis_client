import Ember from 'ember';
import FitPaneRoute from '../../mixins/fit-pane/route';

export default Ember.Route.extend(FitPaneRoute,{
    modelName:"preference",
    controllerName: 'setting.preference',
    parentControllerName:"setting",
    model(){
        return this.store.peekAll(this.modelName).get("firstObject");
    },
    activate(){
        let p_controller = this.controllerFor(this.parentControllerName);
        p_controller.set('selection',`${this.modelName}`);
        return this._super();
    },
    deactivate(){
        let p_controller = this.controllerFor(this.parentControllerName);
        p_controller.set('selection',null);
        return this._super();
    },
    actions:{
        goBack(){
            this.transitionTo(this.parentControllerName);
        },
        goEdit(){
            this.transitionTo(`${this.controllerName}.edit`);
        }
    }
});
