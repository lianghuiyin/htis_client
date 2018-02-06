import Ember from 'ember';
import StandardDetailRoute from '../../../mixins/standard-detail/route';

export default Ember.Route.extend(StandardDetailRoute,{
    modelName:"user",
    controllerName: 'setting.users.user',
    parentControllerName:"setting.users",
    isDeep:true,
    actions:{
        goResetpwd(){
            this.transitionTo(`${this.controllerName}.resetpwd`);
        }
    }
});