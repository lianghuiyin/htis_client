import Ember from 'ember';
import StandardListController from '../../mixins/standard-list/controller';
import ManageCarsController from '../../mixins/manage-cars/controller';

export default Ember.Controller.extend(StandardListController,ManageCarsController,{
    modelName:"unused",
    routeName:"manage.unuseds",
    parentController:Ember.inject.controller('manage'),
    parentRouteName:"manage",
    pannelTitle:Ember.computed(function(){
        return "待处理";
    }),
    allArrangedResult: Ember.computed.sort('pickedResult', 'modifiedDateSortingDesc'),
    pickedResult:Ember.computed("filteredResult.@each.isUnused","isFiltered",function(){
        let isFiltered = this.get("isFiltered");
        let results = this.get("filteredResult").filterBy("isUnused",true);
        if(isFiltered){
            return results.filterBy("isOwn",true);
        }
        else{
            return results;
        }
    })
});
