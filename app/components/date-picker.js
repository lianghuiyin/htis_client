import Ember from 'ember';

export default Ember.Component.extend({
	classNames:["date-picker"],
	classNameBindings:['isAutoCenter:is-auto-center'],
	startDate:null,
	endDate:null,
	isResetNeeded:false,
	isAutoCenter:false,
	isResetNeededChange:Ember.observer("isResetNeeded",function(){
		let s = this.get("startDate");
		let e = this.get("endDate");
		let n = new Date();
		s = s ? s : n;
		e = e ? e : n;
		this.$().DatePickerSetDate([s.format('yyyy-MM-dd'),e.format('yyyy-MM-dd')],true);
	}),
	didInsertElement(){
		let s = this.get("startDate");
		let e = this.get("endDate");
		let n = new Date();
		s = s ? s : n;
		e = e ? e : n;
		let self = this;
		this.$().DatePicker({
			flat: true,
			date: [s.format('yyyy-MM-dd'),e.format('yyyy-MM-dd')],
			current: s.format('yyyy-MM-dd'),
			calendars: 3,
			mode: 'range',
			onChange(formated, dates){
				self.setAttr("startDate",dates[0]);
				self.setAttr("endDate",dates[1]);
			}
		});
	}
});
