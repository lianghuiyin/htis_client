import Ember from 'ember';
import StandardListRoute from '../../mixins/standard-list/route';

export default Ember.Route.extend(StandardListRoute,{
    modelName:"bill",
    controllerName: 'history.bills',
    parentControllerName:"history",
    activate(){
        let c_controller = this.controllerFor("changeset");
        //进入加油单列表，需要暂停changeset抓取
        c_controller.set("isPaused",true);
        let controller = this.controllerFor(this.controllerName);
        //进入加油单列表，需要清除所有加油单
        controller.send("clearBills");
        return this._super();
    },
    deactivate(){
        let c_controller = this.controllerFor("changeset");
        //离开加油单列表，需要恢复changeset抓取
        c_controller.set("isPaused",false);
        let controller = this.controller;
        controller.set("isMoreButtonNeeded",false);
        controller.set("filterOption",null);
        controller.set("searchKey","");
        controller.set("lastId",0);
        controller.get("errors").clear();
        //这里要加run.next的原因是如果立刻执行会触发history.bills.bill.controller的afterRecordIsDeleted函数，造成无法正常退出当前route的问题
        Ember.run.next(()=>{
            //离开加油单列表，需要清除所有加油单
            controller.send("clearBills");
        });
        return this._super();
    },
    actions:{
    	goFilter(){
            this.transitionTo('history.bills.filter');
    	}
    }
});
