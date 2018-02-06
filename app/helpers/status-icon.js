import Ember from 'ember';

export function statusIcon([status]) {
	let icon;
	let color;
	let title;
	switch(status){
		case "recaptured":
			icon = "glyphicon-adjust";
			color = "text-info";
			title = "已取回";
			break;
		case "modified":
			icon = "glyphicon-edit";
			color = "text-muted";
			title = "已修改";
			break;
		case "pending":
			icon = "glyphicon-time";
			color = "text-warning";
			title = "待审核";
			break;
		case "approved":
			icon = "glyphicon-ok";
			color = "text-success";
			title = "已核准";
			break;
		case "rejected":
			icon = "glyphicon-remove";
			color = "text-danger";
			title = "已驳回";
			break;
		case "aborted":
			icon = "glyphicon-stop";
			color = "text-danger";
			title = "已中止";
			break;
		case "forbidden":
			icon = "glyphicon-ban-circle";
			color = "text-danger";
			title = "已暂停";
			break;
		case "enabled":
			icon = "glyphicon-ok-circle";
			color = "text-success";
			title = "已恢复";
			break;
	}
	return Ember.String.htmlSafe(`<span class='status-icon glyphicon ${icon} ${color}' title='${title}'></span>`);
}

export default Ember.Helper.helper(statusIcon);
