import Ember from 'ember';
import StandardListController from '../../mixins/standard-list/controller';

export default Ember.Controller.extend(StandardListController,{
    modelName:"oil",
    routeName:"setting.oils",
    modelTitle:"油品"
});
