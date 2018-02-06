import Ember from 'ember';
import StandardListController from '../../mixins/standard-list/controller';
import ManageCarsController from '../../mixins/manage-cars/controller';

export default Ember.Controller.extend(StandardListController,ManageCarsController,{
    modelName:"pending",
    routeName:"manage.pendings",
    parentController:Ember.inject.controller('manage'),
    parentRouteName:"manage",
    pannelTitle:Ember.computed(function(){
        return "待审核";
    }),
    allArrangedResult: Ember.computed.sort('pickedResult', 'modifiedDateSortingDesc'),
    pickedResult:Ember.computed("filteredResult.@each.isPending","isFiltered",function(){
        let isFiltered = this.get("isFiltered");
        let results = this.get("filteredResult").filterBy("isPending",true);
        if(isFiltered){
            return results.filterBy("isOwn",true);
        }
        else{
            return results;
        }
    })
});
