import Ember from 'ember';
import StandardDetailRoute from '../../../mixins/standard-detail/route';

export default Ember.Route.extend(StandardDetailRoute,{
    modelName:"role",
    controllerName: 'setting.roles.role',
    parentControllerName:"setting.roles",
    isDeep:true
});
