import Ember from 'ember';
import FitPaneRoute from '../../mixins/fit-pane/route';

export default Ember.Mixin.create(FitPaneRoute,{
    modelName:"",//role
    controllerName: '',//setting.roles
    parentControllerName:"",//setting
    model(){
        return this.store.peekAll(this.modelName);
    },
    activate(){
        let p_controller = this.controllerFor(this.parentControllerName);
        p_controller.set('selection',`${this.modelName}s`);
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
        goNew(){
            this.transitionTo(`${this.controllerName}.new`);
        },
        goItem(item){
            this.transitionTo(`${this.controllerName}.${this.modelName}`,item);
        }
    }
});
