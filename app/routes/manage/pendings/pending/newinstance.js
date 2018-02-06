import Ember from 'ember';
import InstanceNewRoute from '../../../../mixins/instance-detail/new-route';

export default Ember.Route.extend(InstanceNewRoute,{
    controllerName: 'manage.pendings.pending',
    statusName:'isPending'
});
