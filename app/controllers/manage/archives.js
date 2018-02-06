import Ember from 'ember';
import StandardListController from '../../mixins/standard-list/controller';
import ManageCarsController from '../../mixins/manage-cars/controller';
import ArchiveCarsController from '../../mixins/archive-cars/controller';

export default Ember.Controller.extend(StandardListController,ManageCarsController,ArchiveCarsController,{
    modelName:"archive",
    routeName:"manage.archives",
    parentController:Ember.inject.controller('manage'),
    parentRouteName:"manage",
    pannelTitle:Ember.computed(function(){
        return "已闲置";
    }),
    allArrangedResult: Ember.computed.sort('pickedResult', 'modifiedDateSortingDesc'),
    pickedResult:Ember.computed("filteredResult.@each.is_archived","isFiltered",function(){
        let isFiltered = this.get("isFiltered");
        let results = this.get("filteredResult").filterBy("is_archived",true);
        if(isFiltered){
            return results.filterBy("isOwn",true);
        }
        else{
            return results;
        }
    })
});
