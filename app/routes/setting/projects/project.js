import Ember from 'ember';
import StandardDetailRoute from '../../../mixins/standard-detail/route';

export default Ember.Route.extend(StandardDetailRoute,{
    modelName:"project",
    controllerName: 'setting.projects.project',
    parentControllerName:"setting.projects",
    isDeep:true
});
