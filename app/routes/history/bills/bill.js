import Ember from 'ember';
import StandardDetailRoute from '../../../mixins/standard-detail/route';

export default Ember.Route.extend(StandardDetailRoute,{
    modelName:"bill",
    controllerName: 'history.bills.bill',
    parentControllerName:"history.bills",
    isDeep:true,
    model(params){
        var curId = params['id'];
        var record = this.store.peekRecord(this.modelName, curId);
        if(!record && curId.indexOf("fixture") === 0){
            //如果没有找到记录，并且是fixture开头的新记录则创建一个新记录来匹配
            return this.controllerFor(this.parentControllerName).createRecord();
        }
        else{
            //注意，这里如果没有找到记录，并且不是fixture开头的新记录，将返回null
            return record;
        }
    },
    afterModel(model, transition) {
        if(!model){
            transition.send("goBack");
        }
    }
});
