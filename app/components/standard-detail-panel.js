import Ember from 'ember';

export default Ember.Component.extend({
	classNames:["panel"],
	model:null,
	isEditing:false,
	isLeftButtonNeeded:false,
	isRightButtonNeeded:true,
	backAction:"goBack",
	editAction:"edit",
	cancelAction:"cancel",
	saveAction:"save",
	deleteAction:"delete",
	pannelTitle:"",
	actions:{
        backAction(){
	        this.sendAction('backAction');
        },
        editAction(){
	        this.sendAction('editAction');
        },
        cancelAction(){
	        this.sendAction('cancelAction');
        },
        saveAction(){
	        this.sendAction('saveAction');
        },
        deleteAction(){
	        this.sendAction('deleteAction');
        }
	}
});
