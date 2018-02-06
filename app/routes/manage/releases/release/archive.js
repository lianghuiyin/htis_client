import Ember from 'ember';
import InstanceArchiveCarRoute from '../../../../mixins/instance-detail/archive-car-route';

export default Ember.Route.extend(InstanceArchiveCarRoute,{
    controllerName: 'manage.releases.release',
    statusName:'isReleased'
});
