import Ember from 'ember';
import StandardDetailRoute from '../../../mixins/standard-detail/route';

export default Ember.Route.extend(StandardDetailRoute,{
    modelName:"oil",
    controllerName: 'setting.oils.oil',
    parentControllerName:"setting.oils",
    isDeep:true
});
