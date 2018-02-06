import Ember from 'ember';

export default Ember.Route.extend({
    activate(){
        let controller = this.controllerFor("setting");
        controller.set("isActive",true);
        return this;
    },
    deactivate(){
        let controller = this.controllerFor("setting");
        controller.set("isActive",false);
        return this;
    },
    actions:{
        didTransition() {
            if(this.controller.get("equipment.isXs")){
                return;
            }
            //当发现没有选项时选中默认的roles
            if(!this.controller.get("selection")){
                this.replaceWith('setting.roles');
            }
        },
        goHome(){
            this.transitionTo('start');
        },
        goRoles(){
            this.transitionTo('setting.roles');
        },
        goUsers(){
            this.transitionTo('setting.users');
        },
        goProjects(){
            this.transitionTo('setting.projects');
        },
        goDepartments(){
            this.transitionTo('setting.departments');
        },
        goOils(){
            this.transitionTo('setting.oils');
        },
        goPreference(){
            this.transitionTo('setting.preference');
        }
    }
});
