import Ember from 'ember';

export default Ember.Service.extend({
	failCount:0,
	checkHiddenXsIsHidden:function(){
		let displayValue = Ember.$('.hidden-xs').eq(0).css("display");
		if(displayValue === undefined){
			let failCount = this.get("failCount");
			if(failCount > 2){
				//防止死循环的可能性（只有界面真的不存在hidden-xs样式类元素才会出现）
				return false;
			}
			Ember.run.next(()=>{
				this.set("failCount",failCount + 1);
				//有少部分界面会出来hidden-xs样式类元素还没有加载完成就进入该函数计算属性了，
				//比如，经测试进入权限缺失界面的时候一定会出现这种情况，
				//这会造成isXs属性值的误判，所以这里要增加延时通知重新计算的逻辑
				this.notifyPropertyChange("isXs");
			});
			return false;
		}
		else{
			return displayValue === "none";
		}
	},
	isXs:Ember.computed(function(){
		return this.checkHiddenXsIsHidden();
	}),
	isNotXs:Ember.computed.not("isXs")
});
