import Ember from 'ember';
import StandardListController from '../../mixins/standard-list/controller';
import ManageCarsController from '../../mixins/manage-cars/controller';
import ArchiveCarsController from '../../mixins/archive-cars/controller';

export default Ember.Controller.extend(StandardListController,ManageCarsController,ArchiveCarsController,{
    modelName:"search",
    routeName:"manage.searchs",
    parentController:Ember.inject.controller('manage'),
    parentRouteName:"manage",
    isEmptyKeyFetchable:false,
    pannelTitle:Ember.computed(function(){
        return "搜索";
    }),
    allArrangedResult: Ember.computed.sort('pickedResult', 'modifiedDateSortingDesc'),
    pickedResult:Ember.computed("filteredResult","searchKey","isFiltered",function(){
        let isFiltered = this.get("isFiltered");
        let searchKey = this.get("searchKey");
        if(!searchKey){
            return [];
        }
        let results = this.get("filteredResult");
        if(isFiltered){
            return results.filterBy("isOwn",true);
        }
        else{
            return results;
        }
    })
});
