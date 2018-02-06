import Ember from 'ember';

export default Ember.Component.extend({
    classNames:["canvas-sign"],
	canvasContext:null,
    canvasData:{top:0,left:0,length:0},
    isDrawing:false,
    color:"#31708f",
    submitAction:"submit",
    resetAction:"reset",
    cancelAction:"cancel",
    abortAction:"abort",
    isSaving:false,
    isCanvas:true,
	didInsertElement(){
		let parentContainer = this.$().parent().parent();
		let canvas = this.$("canvas")[0];
        let canvasWidth = parentContainer.width();
        let canvasHeight = parentContainer.height() - 4;
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		let canvasContext = canvas.getContext('2d');
        canvasContext.lineWidth = 2;
        canvasContext.lineJons = 'round';
        canvasContext.lineCep = 'round';
        // canvasContext.fillStyle ="red";  
        // canvasContext.fillRect(0,0,canvasWidth,canvasHeight); 
        this.set("canvasContext",canvasContext);
		this.set("canvasWidth",canvasWidth);
        this.set("canvasHeight",canvasHeight);
        this.set("canvasData.length",0);
        return this._super();
	},
    eventManager:Ember.Object.create({
    	mouseDown(event, view, isTouch){
            if(!view.isCanvas){
                return;
            }
    		let offset = window.$(view.element).offset();
            let canvasData = view.get("canvasData");
            canvasData.left = offset.left;
    		canvasData.top = offset.top;
    		view.set("isDrawing",true);
    		let canvasContext = view.get("canvasContext");
    		canvasContext.strokeStyle = view.get("color");
            canvasContext.beginPath();
            let clientX = isTouch ? event.originalEvent.touches[0].clientX : event.clientX;
            let clientY = isTouch ? event.originalEvent.touches[0].clientY : event.clientY;
			offset = {left:clientX - offset.left,top:clientY - offset.top};
            canvasContext.moveTo(offset.left,offset.top);
    	},
        mouseUp(event, view){
            if(!view.isCanvas){
                return;
            }
    		view.set("isDrawing",false);
        },
        mouseMove(event, view, isTouch){
            event.preventDefault();
            let canvasContext = view.canvasContext;
            if(isTouch){
                let touch = event.originalEvent.touches[0];
                canvasContext.lineTo(touch.clientX,touch.clientY);
                canvasContext.stroke();
                view.canvasData.length++;
            }
            else{
                if(view.isDrawing){
                    let canvasData = view.canvasData;
                    canvasContext.lineTo(event.clientX - canvasData.left,event.clientY - canvasData.top);
                    canvasContext.stroke();
                    canvasData.length++;
                }
            }

    		// if(view.isDrawing){
	    	// 	let canvasContext = view.canvasContext;
	    	// 	let canvasData = view.canvasData;
      //           canvasData.length++;
      //           let clientX = isTouch ? event.originalEvent.touches[0].clientX : event.clientX;
      //           let clientY = isTouch ? event.originalEvent.touches[0].clientY : event.clientY;
      //           let offset = {left:clientX - canvasData.left,top:clientY - canvasData.top};
	     //        canvasContext.lineTo(offset.left,offset.top);
	     //        canvasContext.stroke();
    		// }
        },
        mouseLeave(event, view){
            this.mouseUp(event, view, true);
        },
        touchStart(event, view){
            this.mouseDown(event, view, true);
        },
        touchEnd(event, view){
            this.mouseUp(event, view, true);
        },
        touchMove(event, view){
            this.mouseMove(event, view, true);
        }
    }),
    actions:{
        submit(){
            let canvas = this.$("canvas")[0];
            let data = canvas.toDataURL('image/jpeg',0.1);
            let b64 = data.substring(23);//删除字符串前的提示信息 "data:image/png;base64," 如果是'image/jpeg'要改成23
            let dataLength = this.get("canvasData").length;
            this.sendAction('submitAction',b64,dataLength);
        },
        reset(){
            let canvasContext = this.get("canvasContext");
            this.set("canvasData.length",0);
            canvasContext.clearRect(0, 0, this.get("canvasWidth"), this.get("canvasHeight"));
            this.sendAction('resetAction');
        },
        cancel(){
            this.set("canvasData.length",0);
            this.sendAction('cancelAction');
        },
        abort(){
            this.sendAction('abortAction');
        }
    }
});
