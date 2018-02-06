import Ember from 'ember';

export function timefmt([value,format]) {
	format = format ? format : "yyyy-MM-dd hh:mm:ss";
    if(value instanceof Date){
        return value.format(format);
    }
    else{
        var date = window.HOJS.lib.parseDate(value);
        return date ? date.format(format) : "";
    }
}

export default Ember.Helper.helper(timefmt);
