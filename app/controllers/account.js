// import Ember from 'ember';

// export default Ember.Controller.extend({
//     routeName:"account.index",
//     applicationController:Ember.inject.controller('application'),
// 	sessionController:Ember.inject.controller('session'),
// 	isActive:false,
// 	isBack:false,
//     modelTitle:"账户",
//     pannelTitle:"账户设置",
//     helpInfo:"帮助信息",
//     actions:{
//     }
// });

import Ember from 'ember';
import NavigablePaneController from '../mixins/navigable-pane/controller';

export default Ember.Controller.extend(NavigablePaneController,{
    routeName:"account.index",
    applicationController:Ember.inject.controller('application'),
    sessionController:Ember.inject.controller('session'),
    modelTitle:"账户",
    pannelTitle:"账户设置",
    helpInfo:"帮助信息",
    actions:{
    }
});
