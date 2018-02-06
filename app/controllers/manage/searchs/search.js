import Ember from 'ember';
import StandardDetailController from '../../../mixins/standard-detail/controller';
import InstanceListController from '../../../mixins/instance-list/controller';
import InstanceDetailController from '../../../mixins/instance-detail/controller';

export default Ember.Controller.extend(StandardDetailController,InstanceListController,InstanceDetailController,{
    routeName:"manage.searchs.search",
    modelTitle:"车辆",
    parentController:Ember.inject.controller('manage.searchs'),
    parentRouteName:"manage.searchs",
    isBaseFolded:true,
    isInstancesFolded:false,
    actions:{
    }
});
