import Ember from 'ember';

export function instanceMail([instance]) {
    if(instance.get("is_archived")){
        return "";
    }
    let lastTrace = instance.get("lastTrace");
    if(!lastTrace){
        Ember.Logger.error(`编号为${instance.get("id")}的申请单出现lastTrace为空的情况：
           可能是申请单没有归档但是其trace被归档了，造成本地没有trace的原因，
           也可能是出现了申请单的IsPending状态为true，但是其所有trace的is_finished都为true的不正常现象。`);
        return "";
    }
    let lastTraceStatus = lastTrace.get("status");
    let lastCreater = lastTrace.get("creater");//最后一个trace的创建人即申请人
    let lastModifier = lastTrace.get("modifier");//最后一个trace的修改人即审核人
    let mail = lastCreater.get("email");//要通知申请人
    let mailTip = "";
    let subject = "";
    let body = "";
    let modifiedDate = instance.get("modified_date");
    switch(lastTraceStatus){
        case "approved":
            //只通知48小时内的核准单子
            if(instance.get("isNeedToBellApprove")){
                subject = "核准通知";
                body = `审核人[${lastModifier.get("name")}]于[${modifiedDate.format("yyyy-MM-dd hh:mm:ss")}]核准了车辆[${instance.get("car.number")}]的申请单:\n`;
            }
            break;
        case "rejected":
            subject = "驳回通知";
            body = `审核人[${lastModifier.get("name")}]于[${modifiedDate.format("yyyy-MM-dd hh:mm:ss")}]驳回了车辆[${instance.get("car.number")}]的申请单:\n`;
            break;
        case "aborted":
            subject = "中止通知";
            body = `审核人[${lastModifier.get("name")}]于[${modifiedDate.format("yyyy-MM-dd hh:mm:ss")}]中止了车辆[${instance.get("car.number")}]的申请单:\n`;
            break;
    }
    if(mail){
    	mailTip = mail + `<span class="badge pull-right">${lastCreater.get("name")}</span>`;
    }
    else{
    	mailTip = `<span class="text-danger">申请人没有填写邮件地址</span>`;
    }
    if(instance.get("isFinishing")){
    	if(subject){
    		subject += "、过期通知";
    	}
    	else{
	        subject = "过期通知";
    	}
    	if(body){
	        if(instance.get("isFinished")){
	            body += `☆该申请单已于[${instance.get("end_date").format("yyyy-MM-dd")}]过期☆\n`;
	        }
	        else{
	            body += `☆该申请单将于[${instance.get("end_date").format("yyyy-MM-dd")}]过期☆\n`;
	        }
    	}
    	else{
	        if(instance.get("isFinished")){
	            body = `车辆[${instance.get("car.number")}]有一个申请单已于[${instance.get("end_date").format("yyyy-MM-dd")}]过期:\n`;
	        }
	        else{
	            body = `车辆[${instance.get("car.number")}]有一个申请单将于[${instance.get("end_date").format("yyyy-MM-dd")}]过期:\n`;
	        }
    	}
    }
    if(subject){
	    body += `◆VIN:${instance.get('car.vin')} \n◆所属项目:${instance.get('project.name')} \n◆使用部门:${instance.get('department.name')} \n◆使用人:${instance.get('user_name')}\n`;
	    body += `§网址:${window.location.href}`;
	    body = encodeURIComponent(body);
		return Ember.String.htmlSafe(`<a href='mailto:${mail}?subject=${subject}[${instance.get("car.number")}]--加油机信息系统&body=${body}' class = 'instance-mail list-group' title='点击发送通知邮件给申请人'>@邮件通知:${mailTip}</a>`);
    }
    else{
    	return "";
    }
}

export default Ember.Helper.helper(instanceMail);
