import Ember from 'ember';
import NavigablePaneRoute from '../mixins/navigable-pane/route';

export default Ember.Route.extend(NavigablePaneRoute,{
    controllerName: 'scanning',
	parentControllerName:"start",
    activate(){
        let controller = this.controllerFor(this.controllerName);
        let p_controller = this.controllerFor(this.parentControllerName);
        p_controller.set("isFolded",true);
    	controller.set("vinCode","");
        controller.set("isChecking",false);
        controller.set("isConfirming",false);
        return this._super();
    },
    actions:{
    	goFilling(){
            this.transitionTo(`${this.controllerName}.filling`);
    	},
        goBack(){
            //通知列表重新排序
            this.controllerFor("start").notifyPropertyChange("model");
            this._super();
        }
    }
});
