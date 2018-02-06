// import Ember from 'ember';

// export default Ember.Route.extend({
//     model(){
//         let user = this.controllerFor("session").get("user");
//         return this.store.createRecord('accountpwd',{
//             user: user
//         });
//     },
//     activate(){
//         let controller = this.controllerFor("account/pwd");
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
//         let controller = this.controllerFor("account/pwd");
//         let p_controller = this.controllerFor("account");
//         controller.set("isActive",false);
//         p_controller.set("isBack",false);
//         controller.send("unloadRecord");
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
    controllerName: 'account.pwd',
    parentControllerName:"account",
    model(){
        let user = this.controllerFor("session").get("user");
        return this.store.createRecord('accountpwd',{
            user: user
        });
    },
    deactivate(){
        this._super();
        this.controller.send("unloadRecord");
        return this;
    }
});


