import Ember from 'ember';
import StandardDetailController from '../../../mixins/standard-detail/controller';
import InstanceListController from '../../../mixins/instance-list/controller';
import InstanceDetailController from '../../../mixins/instance-detail/controller';

export default Ember.Controller.extend(StandardDetailController,InstanceListController,InstanceDetailController,{
    routeName:"manage.archives.archive",
    modelTitle:"车辆",
    parentController:Ember.inject.controller('manage.archives'),
    parentRouteName:"manage.archives",
    isBaseFolded:true,
    isInstancesFolded:false,
    actions:{
    }
});
