import Ember from 'ember';
import StandardListController from '../../mixins/standard-list/controller';

export default Ember.Controller.extend(StandardListController,{
    modelName:"role",
    routeName:"setting.roles",
    modelTitle:"角色"
});
