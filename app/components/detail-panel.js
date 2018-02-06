import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['detail-panel','panel'],
    pannelTitle:"标题",
    isLeftButtonNeeded:true,
    leftButtonTitle:"返回",
    leftButtonIcon:"glyphicon-arrow-left",
    leftButtonAction:"goBack",
    isRightButtonNeeded:false,
    rightButtonTitle:"下一步",
    rightButtonIcon:"glyphicon-arrow-right",
    rightButtonAction:"goNext",
	actions:{
        leftAction(){
	        this.sendAction('leftButtonAction');
        },
        rightAction(){
	        this.sendAction('rightButtonAction');
        }
	}
});
