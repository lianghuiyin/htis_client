import Ember from 'ember';
import NavigablePaneController from '../../mixins/navigable-pane/controller';

export default Ember.Controller.extend(NavigablePaneController,{
    applicationController:Ember.inject.controller('application'),
    sessionController:Ember.inject.controller('session'),
    modelName:"scanning",
    routeName:"start.scanning",
    modelTitle:"加油单",
    pannelTitle:"加油单详情",
    actions:{
    }
});
