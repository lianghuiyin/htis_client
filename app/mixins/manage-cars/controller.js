import Ember from 'ember';

export default Ember.Mixin.create({
	isFiltered:false,
	actions:{
    	filter(){
            this.toggleProperty("isFiltered");
    	}
	}
});
