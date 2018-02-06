import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Mixin.create({
	isEmptyKeyFetchable:true,
    isEnterSearchable:true,
    isSearchkeyEntered:false,//是否searchKey用于服务器端搜索
    errors:DS.Errors.create(),
    lastId:0,
    applicationController:Ember.inject.controller('application'),
    searchKeyDidChange:Ember.observer("searchKey",function(){
        if(this.get("isSearchkeyEntered")){
            //如果searchKey用于服务器端搜索，变更searchKey的时候要重置所有参数
            this.send("resetListOptions",true);
        }
    }),
    actions:{
        resetListOptions(isUnloadAtFirstTime){
            if(isUnloadAtFirstTime){
                this.send("unloadArchivedCars");                
            }
            else{
                //这里如果不加next，会出现选中一个闲置后的车辆明细后，再切换到左侧其他导航栏时中间栏变成空的问题（其实不是route跳转失败）
                //比如不加next的话，从已闲置栏，选中一个车辆进入车辆明细后，再切换到可加油栏会出现中间栏变空
                Ember.run.next(()=>{
                    //如果是从搜索栏切换到已闲置栏，则不能执行unloadArchivedCars，因为会造成本来加载成功的闲置车辆被unload了
                    if(!(this.routeName === "manage.searchs" && this.get("applicationController.currentRouteName") === "manage.archives.index")){
                        this.send("unloadArchivedCars");
                    }
                });
            }
            this.set("isToShowAll",false);
            this.set("lastId",0);
            this.set("isMoreButtonNeeded",false);
            this.get("errors").clear();
            this.set("isSearchkeyEntered",false);
        },
        unloadArchivedCars(){
            let store = this.store;
            this.get("model").filterBy("is_archived",true).forEach((car)=>{
                store.unloadRecord(car);
            });
        },
        fetchArchivedCars(searchKey){
            if(!searchKey){
                searchKey = "";
            }
            let pageCount = this.get("pageCount");
            let lastId = this.get("lastId");
            this.get("errors").remove('server_side_error');
            this.set("isSearching",true);
            this.store.query('car',{
                key:searchKey,
                count:pageCount,
                lastId:lastId
            }).then((answer)=>{
                let cars = answer.toArray();
                if(cars.length > 0){
                    let minId = cars.mapBy("id").sort(function(a,b){
                        return parseInt(a) - parseInt(b);
                    }).get("firstObject");
                    this.set("lastId",minId);
                }
                if(cars.length < pageCount){
                    this.set("isMoreButtonNeeded",false);
                }
                else{
                    this.set("isMoreButtonNeeded",true);
                }
                this.set("isSearching",false);
            },(reason)=>{
                let error = reason.errors.objectAt(0);
                let errorMsg = "";
                if(reason.errors){
                    errorMsg = error.detail;
                }
                else{
                    errorMsg = "该资源不存在或网络繁忙，请稍候再试";
                }
                let recordErrors = this.get("errors");
                recordErrors.add(Ember.String.underscore("ServerSideError"), errorMsg);
                this.set("isSearching",false);
            });

        },
        fetchNext(){
            this.set("isToShowAll",true);
            //如果searchKey用于服务器端搜索，则searchKey参与搜索，反之搜索时忽略searchKey
            if(this.get("isSearchkeyEntered")){
                this.send("fetchArchivedCars",this.get("searchKey"));
            }
            else{
                this.send("fetchArchivedCars");
            }
        },
        enterSearch(searchKey){
            //每次回车搜索，则searchKey参与搜索，除非searchKey为空，isSearchkeyEntered才被标识为否，即不参与搜索
            this.send("resetListOptions",true);
            if(searchKey.length > 0){
                this.set("isSearchkeyEntered",true);
            }
            if(this.get("isEmptyKeyFetchable")){
	            this.send("fetchArchivedCars",searchKey);
            }
            else if(searchKey.length > 0){
	            this.send("fetchArchivedCars",searchKey);
            }
        }
    }
});
