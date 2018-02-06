import Ember from 'ember';

export default Ember.Component.extend({
	content:[],
	isObject:true,
	contentValueKey:"name",
	split:",",
	value:Ember.computed("content","content.[]",function(){
		let content = this.get("content");
		if(content){
			if(this.get("isObject")){
				return content.mapBy(this.get("contentValueKey")).join(this.get("split"));
			}
			else{
				return content.join(this.get("split"));
			}
		}
		else{
			return "";
		}
	})
});
