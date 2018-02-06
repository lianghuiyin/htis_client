import Ember from 'ember';
import StandardListRoute from '../../mixins/standard-list/route';

export default Ember.Route.extend(StandardListRoute,{
    modelName:"oil",
    controllerName: 'setting.oils',
    parentControllerName:"setting"
});
