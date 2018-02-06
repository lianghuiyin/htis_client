import Ember from 'ember';
import StandardDetailNewRoute from '../../../mixins/standard-detail/new-route';

export default Ember.Route.extend(StandardDetailNewRoute,{
    controllerName: 'setting.oils.oil',
    parentControllerName:"setting.oils",
    isDeep:true,
    actions:{
        willTransition(transition) {
            if(this.controllerFor("setting").get("isPowered")){
                return this._super(transition);
            }
            else{
                //在没有权限，比如退出系统时，不需要也不可以做弹出confirm框确认，因为弹出框会被none-power框替代
                return true;
            }
        }
    }
});
