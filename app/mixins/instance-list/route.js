import Ember from 'ember';

export default Ember.Mixin.create({
	actions:{
	    willTransition(){
	        let controller = this.controller;
	        controller.set("isCloudList",false);
	        //加这段的原因是，刚归档（结束）一个申请单，如果不执行下面的操作，这个申请单将处理未unload的状态
	        //（原因归档操作的response及一次changeset都会让申请单从unload变成非unload状态），所以这里需要再执行一次
	        //以确保刚归档的申请单不会再次无故出现在申请单列表
	        controller.get("model").notifyPropertyChange("instances");
	        controller.send("unloadArchivedInstances");
	        return this._super();
	    }
	}
});
