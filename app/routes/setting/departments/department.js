import Ember from 'ember';
import StandardDetailRoute from '../../../mixins/standard-detail/route';

export default Ember.Route.extend(StandardDetailRoute,{
    modelName:"department",
    controllerName: 'setting.departments.department',
    parentControllerName:"setting.departments",
    isDeep:true
});
