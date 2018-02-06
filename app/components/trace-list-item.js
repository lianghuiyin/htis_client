import Ember from 'ember';

export default Ember.Component.extend({
	content:null,
	compareto:null,
	text:"",
	color:"",
	icon:"",
	createrTag:"",
	modifierTag:"",
	isModifierNeeded:true,
	tagName:"li",
	classNames:['trace-list-item'],
    classNameBindings: ['isChecked:active','color'],
	statuasdfsDidChange:Ember.on('init',Ember.observer("content.status",function(){
        let status = this.get("content.status");
		let text;
		let icon;
		let color;
		let isModifierNeeded = true;
		let createrTag = "";
		let modifierTag = "";
		switch(status){
			case "recaptured":
				text = "已取回";
				icon = "glyphicon-adjust";
				color = "text-info";
				createrTag = "申请";
				modifierTag = "取回";
				break;
			case "modified":
				text = "已修改";
				icon = "glyphicon-edit";
				color = "text-muted";
				createrTag = "申请";
				modifierTag = "修改";
				break;
			case "pending":
				text = "待审核";
				icon = "glyphicon-time";
				color = "text-warning";
				isModifierNeeded = false;
				createrTag = "申请";
				break;
			case "approved":
				text = "已核准";
				icon = "glyphicon-ok";
				color = "text-success";
				createrTag = "申请";
				modifierTag = "核准";
				break;
			case "rejected":
				text = "已驳回";
				icon = "glyphicon-remove";
				color = "text-danger";
				createrTag = "申请";
				modifierTag = "驳回";
				break;
			case "aborted":
				text = "已中止";
				icon = "glyphicon-stop";
				color = "text-danger";
				isModifierNeeded = false;
				createrTag = "中止";
				break;
			case "forbidden":
				text = "已暂停";
				icon = "glyphicon-ban-circle";
				color = "text-danger";
				isModifierNeeded = false;
				createrTag = "暂停";
				break;
			case "enabled":
				text = "已恢复";
				icon = "glyphicon-ok-circle";
				color = "text-success";
				isModifierNeeded = false;
				createrTag = "恢复";
				break;
		}
		this.beginPropertyChanges();
		this.set("text",text);
		this.set("icon",icon);
		this.set("color",color);
		this.set("isModifierNeeded",isModifierNeeded);
		this.set("createrTag",createrTag);
		if(isModifierNeeded){
			this.set("modifierTag",modifierTag);
		}
		this.endPropertyChanges();
    })),
	isChecked:false,
    click:function(){
    	this.toggleProperty("isChecked");
    }
});
