import Ember from 'ember';
import StandardListRoute from '../../mixins/standard-list/route';

export default Ember.Route.extend(StandardListRoute,{
    modelName:"disable",
    controllerName: 'manage.disables',
    parentControllerName:"manage",
    model(){
        return this.store.peekAll('car');
    },
    actions:{
        goNew(){
        	return true;
        }
    }
});
