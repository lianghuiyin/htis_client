import Ember from 'ember';

export function boolean([tag]) {
    var text = tag ? "是" : "否";
    return '%@'.fmt(text);
}

export default Ember.Helper.helper(boolean);