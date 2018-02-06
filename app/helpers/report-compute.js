import Ember from 'ember';

export function reportCompute([model],{project,oil,department}) {
	let reports = model.filter(function(n){
		return (!project || n.get("project.id")===project.get("id")) && (!oil || n.get("oil.id")===oil.get("id")) && (!department || n.get("department.id")===department.get("id"));
	});
	if(reports.length === 0){
		return "--";
	}
	let sum = 0;
	reports.forEach(function(n){
		sum += parseInt(n.get("volume"));
	});
	return sum;
}

export default Ember.Helper.helper(reportCompute);
