import Ember from 'ember';

export default Ember.Controller.extend({
    model:Ember.computed(function(){
        return this.store.peekAll("message");
    }),
    createdDateSorting: ['created_date:asc'],
    createdDateSortingDesc: ['created_date:desc'],
    isToShowAll:false,
    topCount:10,
    pageCount:10,
    allArrangedResult: Ember.computed.sort('model', 'createdDateSortingDesc'),
    arrangedResult:Ember.computed("allArrangedResult.length","isToShowAll",function(){
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
    })
});
