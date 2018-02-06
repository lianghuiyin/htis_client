import Ember from 'ember';

export default Ember.Component.extend({
	routeName:"",
	isActive:false,
	isBack:false,
	isHide:false,
	routeClassName:Ember.computed('routeName',function(){
		return this.get('routeName').replace(/\./g,"-");
	}),
	classNames:["navigable-pane","trans-all-02"],
    classNameBindings: ['routeClassName','isActive:active:right','isBack:left','isHide:hide'],
    didInsertElement:function(){
    	Ember.run.next(()=>{
    		//这里要加later是因为部分浏览器（比如chrome）会出现因为运行太快没有动画的情况
	    	Ember.run.later(()=>{
	    		//这里加isDestroyed判断是因为在有些特别情况下，比如系统比较卡，这里会出现this被注销的情况
	    		if(!this.get("isDestroyed")){
	    			this.set("isActive",true);
	    		}
	    	},10);
    	});
    }
});
