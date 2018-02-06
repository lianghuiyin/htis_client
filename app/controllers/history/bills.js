import Ember from 'ember';
import DS from 'ember-data';
import StandardListController from '../../mixins/standard-list/controller';

export default Ember.Controller.extend(StandardListController,{
    modelName:"bill",
    routeName:"history.bills",
    modelTitle:"加油单",
    parentController:Ember.inject.controller('history'),
    parentRouteName:"history",
    pannelTitle:"加油单明细",
    allArrangedResult: Ember.computed.sort('filteredResult', 'createdDateSorting'),
    filterOption:null,
    lastId:0,
    errors:DS.Errors.create(),
    filterText:Ember.computed("filterOption",function(){
        let filterOption = this.get("filterOption");
        if(filterOption){
            let projectText = filterOption.get("project.name");
            let departmentText = filterOption.get("department.name");
            let results = [];
            if(projectText){
                results.push(projectText);
            }
            if(departmentText){
                results.push(departmentText);
            }
            results.push(`${filterOption.get("startDate").format('yyyy-MM-dd')}➡${filterOption.get("endDate").format('yyyy-MM-dd')}`);
            return results.join(",");
        }
        else{
            return "";
        }
    }),
    isFiltered:Ember.computed("filterOption",function(){
        return this.get("filterOption") !== null;
    }),
    filteredResult:Ember.computed("model.length","searchKey",function(){
        let searchKey = this.get("searchKey").toLowerCase();
        searchKey = searchKey.replace(/\\/g,"");
        let arrangedContent = this.get("model.arrangedContent");
        if(!arrangedContent){
            return [];
        }
        if(searchKey){
            return arrangedContent.mapBy("record").filterBy("id",searchKey);
        }
        else{
            return arrangedContent.mapBy("record");
        }
    }),
    actions:{
    	filter(){
    		this.send("goFilter");
    	},
        fetchNext(){
            this.get("errors").remove('server_side_error');
            this.set("isToShowAll",true);
            let filterOption = this.get("filterOption");
            let project = filterOption.get("project");
            let department = filterOption.get("department");
            let startDate = filterOption.get("startDate");
            let endDate = filterOption.get("endDate");
            this.set("isSearching",true);
            let pageCount = this.get("pageCount");
            let lastId = this.get("lastId");
            this.store.query('bill',{
                count:pageCount,
                project:project ? project.get("id") : null,
                department:department ? department.get("id") : null,
                startDate:startDate.format('yyyy-MM-dd hh:mm:ss'),
                endDate:endDate.format('yyyy-MM-dd hh:mm:ss'),
                lastId:lastId
            }).then((answer)=>{
                let bills = answer.toArray();
                if(bills.length > 0){
                    let minId = bills.mapBy("id").sort(function(a,b){
                        return parseInt(a)-parseInt(b);
                    }).get("firstObject");
                    this.set("lastId",minId);
                }
                if(bills.length < pageCount){
                    this.set("isMoreButtonNeeded",false);
                }
                else{
                    this.set("isMoreButtonNeeded",true);
                }
                this.set("isSearching",false);
            },(reason)=>{
                if(reason.errors){
                    let error = reason.errors.objectAt(0);
                    let errorMsg = error.detail;
                    let recordErrors = this.get("errors");
                    recordErrors.add(Ember.String.underscore("ServerSideError"), errorMsg);
                }
                this.set("isSearching",false);
            });
        },
        clearBills(){
            this.store.unloadAll("bill");
            this.store.unloadAll("signature");
        },
        enterSearch(searchKey){
            if(searchKey.length === 0){
                return;
            }
            if(this.store.peekRecord("bill",searchKey)){
                //本地存在则不重新请求
                return;
            }
            
            this.set("lastId",0);
            this.set("isMoreButtonNeeded",false);
            this.send("clearBills");
            this.get("errors").clear();
            this.set("filterOption",null);
            this.set("isSearching",true);
            this.store.find("bill",searchKey).then(()=>{
                this.set("isSearching",false);
            },(reason)=>{
                if(reason.errors){
                    let error = reason.errors.objectAt(0);
                    let errorMsg = error.detail;
                    let recordErrors = this.get("errors");
                    recordErrors.add(Ember.String.underscore("ServerSideError"), errorMsg);
                }
                this.set("isSearching",false);
            });
        }
    }
});
