import Ember from 'ember';
import StandardDetailController from '../../../mixins/standard-detail/controller';

export default Ember.Controller.extend(StandardDetailController,{
    routeName:"setting.oils.oil",
    modelTitle:"油品"
});
