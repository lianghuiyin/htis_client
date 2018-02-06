// import Ember from 'ember';

// export default Ember.Controller.extend({
//     sessionController:Ember.inject.controller('session'),
// 	isActive:false,
// 	isBack:false,
//     isEditing:false,
//     modelTitle:"账户",
//     pannelTitle:Ember.computed('isEditing','isNew',function(){
//         if(this.get('isEditing')){
//             return `修改${this.get("modelTitle")}信息`;
//         }
//         else{
//             return `${this.get("modelTitle")}信息`;
//         }
//     }),
//     helpInfo:"帮助信息",
//     actions:{
//         edit() {
//             this.send("goEdit");
//         },
//         save(){
//             let currentUser = this.get("sessionController.user");
//             this.set("model.modifier",currentUser);
//             this.get('model').save().then(()=>{
//                 this.send("goIndex");
//             }, ()=>{
//             });
//         },
//         cancel(){
//             this.send("goIndex");
//         }
//     }
// });

import Ember from 'ember';
import NavigablePaneController from '../../mixins/navigable-pane/controller';

export default Ember.Controller.extend(NavigablePaneController,{
    routeName:"account.info",
    sessionController:Ember.inject.controller('session'),
    isEditing:false,
    modelTitle:"账户",
    pannelTitle:Ember.computed('isEditing','isNew',function(){
        if(this.get('isEditing')){
            return `修改${this.get("modelTitle")}信息`;
        }
        else{
            return `${this.get("modelTitle")}信息`;
        }
    }),
    helpInfo:"帮助信息",
    actions:{
        edit() {
            this.send("goEdit");
        },
        save(){
            let currentUser = this.get("sessionController.user");
            this.set("model.modifier",currentUser);
            this.get('model').save().then(()=>{
                this.send("goIndex");
            }, ()=>{
            });
        },
        cancel(){
            this.send("goIndex");
        }
    }
});

