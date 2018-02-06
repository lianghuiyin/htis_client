import Ember from 'ember';
import FitPaneController from '../../mixins/fit-pane/controller';

export default Ember.Mixin.create(FitPaneController,{
    modelName:"",//role
    routeName:"",//setting.roles
    modelTitle:"",//角色
    sessionController:Ember.inject.controller('session'),
    parentController:Ember.inject.controller('setting'),
    parentRouteName:"setting",
    selection:null,
    pannelTitle:Ember.computed(function(){
        return `${this.modelTitle}管理`;
    }),
    // sortProperties: ['created_date','id'],
    // sortAscending: true,
    createdDateSorting: ['created_date:asc','id'],
    createdDateSortingDesc: ['created_date:desc','id'],
    modifiedDateSortingDesc: ['modified_date:desc'],
    isSearching:false,
    isMoreButtonNeeded:false,
    isToShowAll:false,
    topCount:20,
    pageCount:20,
    allArrangedResult: Ember.computed.sort('filteredResult', 'createdDateSorting'),
    arrangedResult:Ember.computed("allArrangedResult","isToShowAll",function(){
        let allArrangedResult = this.get("allArrangedResult"),
            isToShowAll = this.get("isToShowAll");
        if(isToShowAll){
            return allArrangedResult;
        }
        else{
            let topCount = this.get("topCount");
            return allArrangedResult.filter(function(item, index){
                return index < topCount;
            });
        }
    }),
    isTopButtonNeeded:Ember.computed("isToShowAll","allArrangedResult.length",function(){
        //只要列表个数超过topCount则需要切换按钮
        return this.get("allArrangedResult.length") > this.get("topCount");
    }),
    searchKey:"",
    filteredResult:Ember.computed("model.@each.searchKeys","searchKey",function(){
        // this.set("isToShowAll",false);//搜索关键字变更后要重置isToShowAll值，以默认只显示最新topCount个记录
        let searchKey = this.get("searchKey").toLowerCase();
        searchKey = searchKey.replace(/\\/g,"");
        let arrangedContent = this.get("model.arrangedContent");
        if(!arrangedContent){
            return [];
        }
        if(searchKey){
            return arrangedContent.mapBy("record").filter((item)=>{
                return item.get("searchKeys").find((key)=>{
                    return key.search(searchKey) >= 0;
                });
            });
        }
        else{
            return arrangedContent.mapBy("record");
        }
    }),
    createRecord(){
        let currentUser = this.get("sessionController.user");
        let car = this.store.createRecord(this.modelName, {
            name: `新${this.modelTitle}`,
            description: '',
            creater: currentUser,
            created_date: new Date(),
            modifier: currentUser,
            modified_date: new Date()
        });
        return car;
    },
    actions:{
    }
});
