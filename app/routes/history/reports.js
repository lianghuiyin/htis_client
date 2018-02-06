import Ember from 'ember';
import StandardListRoute from '../../mixins/standard-list/route';

export default Ember.Route.extend(StandardListRoute,{
    modelName:"report",
    controllerName: 'history.reports',
    parentControllerName:"history",
    activate(){
        let controller = this.controllerFor(this.controllerName);
        //进入加油单报表，需要清除所有加油单报表
        controller.send("clearReports");
        return this._super();
    },
    deactivate(){
        let controller = this.controller;
        controller.set("filterOption",null);
        controller.get("errors").clear();
        controller.send("clearReports");
        return this._super();
    },
    actions:{
    	goFilter(){
            this.transitionTo('history.reports.filter');
    	}
    }
});
