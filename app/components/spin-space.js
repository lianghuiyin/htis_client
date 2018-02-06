import Ember from 'ember';

export default Ember.Component.extend({
    classNames:["spin-space"],
    spinner:null,
    radius:4,
    length:4,
    width:2,
	didInsertElement(){
		let radius = this.get("radius");
		let length = this.get("length");
		let width = this.get("width");
		var spinner = new window.Spinner({radius:radius,length:length,width:width}).spin(this.$()[0]);
		this.set("spinner",spinner);
        return this._super();
	},
	willDestroyElement(){
		let spinner = this.get("spinner");
		if(spinner){
			spinner.stop();
			this.set("spinner",null);
		}
	}
});
