// import Ember from 'ember';

// export default Ember.Route.extend({
//     activate(){
//         let controller = this.controllerFor("account.info");
//         let p_controller = this.controllerFor("account");
//         if(Ember.$.support.transition){
//             Ember.run.next(()=>{
//             	//这里要加later的原因是有时next执行得太快没有动画效果
//     	        // Ember.run.later(()=>{
//     	            controller.set("isActive",true);
//     		        p_controller.set("isBack",true);
//     	        // },100);
//             });
//         }
//         else{
//             controller.set("isActive",true);
//             p_controller.set("isBack",true);
//         }
//         return this;
//     },
//     deactivate(){
//         let controller = this.controllerFor("account.info");
//         let p_controller = this.controllerFor("account");
//         controller.set("isActive",false);
//         p_controller.set("isBack",false);
//         return this;
//     },
// 	actions:{
// 		goBack(){
//             this.transitionTo('account');
// 		}
// 	}
// });

import Ember from 'ember';
import NavigablePaneRoute from '../../mixins/navigable-pane/route';

export default Ember.Route.extend(NavigablePaneRoute,{
    controllerName: 'account.info',
    parentControllerName:"account"
});
