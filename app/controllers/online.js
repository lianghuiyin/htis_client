import Ember from 'ember';

export default Ember.Controller.extend({
	applicationController:Ember.inject.controller('application'),
    sessionController:Ember.inject.controller('session'),
    routeName:"online",
    pannelTitle:"打印同步",
    createdDateSorting: ['created_date:asc','id'],
    modifiedDateSortingDesc: ['modified_date:desc'],
    arrangedResult: Ember.computed.sort('model', 'modifiedDateSortingDesc')
});
