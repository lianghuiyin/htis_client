import Ember from 'ember';
import StandardListController from '../../mixins/standard-list/controller';

export default Ember.Controller.extend(StandardListController,{
    modelName:"department",
    routeName:"setting.departments",
    modelTitle:"部门"
});
