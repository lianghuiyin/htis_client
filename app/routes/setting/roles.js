import Ember from 'ember';
import StandardListRoute from '../../mixins/standard-list/route';

export default Ember.Route.extend(StandardListRoute,{
    modelName:"role",
    controllerName: 'setting.roles',
    parentControllerName:"setting"
});
