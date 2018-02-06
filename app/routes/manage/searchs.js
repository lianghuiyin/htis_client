import Ember from 'ember';
import StandardListRoute from '../../mixins/standard-list/route';
import ArchiveCarsRoute from '../../mixins/archive-cars/route';

export default Ember.Route.extend(StandardListRoute,ArchiveCarsRoute,{
    modelName:"search",
    controllerName: 'manage.searchs',
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
