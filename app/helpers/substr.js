import Ember from 'ember';

export function substr([value],{start,end}) {
	if(value){
		return value.substr(start,end);
	}
	else{
		return "";
	}
}

export default Ember.Helper.helper(substr);
