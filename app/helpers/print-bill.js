import Ember from 'ember';

export function printBill([bill,firmName,appShortTitle,isPrinter]) {
	let format = "yyyy-MM-dd hh:mm:ss";
	let created_date_value = "";
	let time_value = "";
	created_date_value = bill.get("created_date").format(format);
	time_value = bill.get("time").format(format);

	if(isPrinter){
		let content = `
		　　　　　　加油单
		单　　号:${bill.get("id")}
		车辆编号:${bill.get("car.number")}
		VIN　　 :${bill.get("car.vin")}
		所属项目:${bill.get("project.name")}
		使用部门:${bill.get("department.name")}
		油　　品:${bill.get("oil.name")}
		加油量　:${bill.get("volume")}
		里程数　:${bill.get("mileage")}
		油　　耗:${bill.get("rate")}
		加油工　:${bill.get("oiler.name")}
		加油时间:${time_value}`;
		content = content + `
		-------------------------------
		　　　　　${firmName}
		　　　 ${appShortTitle}
		-------------------------------
		`;
		return Ember.String.htmlSafe(content);
	}
	else{
		let content = `
		<div style="text-align:center">加油单</div>
		单　　号:${bill.get("id")}<br/>
		车辆编号:${bill.get("car.number")}<br/>
		VIN　　 :${bill.get("car.vin")}<br/>
		所属项目:${bill.get("project.name")}<br/>
		使用部门:${bill.get("department.name")}<br/>
		油　　品:${bill.get("oil.name")}<br/>
		加油量　:${bill.get("volume")}<br/>
		里程数　:${bill.get("mileage")}<br/>
		油　　耗:${bill.get("rate")}<br/>
		加油工　:${bill.get("oiler.name")}<br/>
		加油时间:${time_value}<br/>`;
		content = content + `
		<div style="border:dotted 2px #999;height:1px;margin:6px;"></div>
		<div style="text-align:center">
			${firmName}<br/>
			${appShortTitle}
		</div>
		<div style="border:dotted 2px #999;height:1px;margin:6px;"></div>
		`;
		return Ember.String.htmlSafe(content);
	}
}

export default Ember.Helper.helper(printBill);
