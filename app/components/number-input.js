import Ember from 'ember';

export default Ember.TextField.extend({
    dot:0,//小数点位数
    symbol:"+",//正负数，+/-/+-
    isNullable:false,
    classNames: ['number-input'],
    attributeBindings: ['number','placeholder'],
    placeholder:"",
    // type:"number",
    // type:"tel",//这里不能用number，因为在chrome下elm.selectionStart会报错，但是tel会让safari上没有小数点输入
    type:Ember.computed(function(){
        // window.navigator.userAgent.toLowerCase().indexOf("safari") > 0 ? "number"
        // return this.container.lookup("service:equipment").get("isXs") ? "number" : "text";
        var platform = window.navigator.platform.toLowerCase();
        if(platform.indexOf("mac") > -1 || platform.indexOf("win") > -1){
            //PC上上text
            return "text";
        }
        else{
            //手机及pad上用数值
            return "number";
        }
    }),
    eventManager: Ember.Object.create({
        getCursorLocation(elm) {  
            if(elm.createTextRange) { // IE               
                var range = document.selection.createRange();                 
                range.setEndPoint('StartToStart', elm.createTextRange());                 
                return range.text.length;  
            } else if(typeof elm.selectionStart === 'number') {  
                return elm.selectionStart;  
            }
        },
        keyPress(event, view) {
            var symbol = view.get("symbol"),
                dot = view.get("dot"),
                oldValue = view.element.value;
            var loc = this.getCursorLocation(view.element);
            if(event.keyCode === 13){
            	//回车触发focusOut从而同步值变化
            	view.$().trigger("blur");
            	return;
            }
            if (event.keyCode === 45) {
                if(symbol === "+-" || symbol === "-"){
                    if(loc === 0 && view.element.value.indexOf("-") === -1){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return false;
                }
            }
            else if (event.keyCode === 46) {
                if(dot === 0){
                    return false;
                }
                if (loc === 0 || view.element.value.indexOf(".") !== -1) {
                    return false;
                }
                if(loc < oldValue.length - dot){
                    return false;
                }
            } 
            else {
                if(event.keyCode >= 45 && event.keyCode <= 57){
                    if(dot > 0){
                        var indexOfDot = oldValue.lastIndexOf(".");
                        if(indexOfDot > 0 && loc > indexOfDot && (oldValue.length - indexOfDot) > dot){
                            return false;
                        }
                    }
                }
                else{
                    return false;
                }
            }
        },
        // focusOut(event, view) {
            // var oldValue = view.element.value,
            //     newValue = oldValue;
            // if (oldValue.lastIndexOf(".") === (oldValue.length - 1)) {
            //     newValue = newValue.substr(0,oldValue.length - 1);
            // }
            // if (/(0+$)/.test(newValue)) {
            //     if (newValue.lastIndexOf(".") >= 0) {
            //         newValue = newValue.replace(/(0*$)/g, "");
            //         newValue = newValue.replace(/(\.*$)/g, "");
            //     }
            // }
            // if (/(^0+)/.test(newValue)) {
            //     newValue = newValue.replace(/^0*/g, '0');
            //     if (/(^[0]{1}[1-9]{1,})/.test(newValue)) {
            //         newValue = newValue.replace(/^0*/g, '');
            //     }
            // }
            // if (isNaN(newValue)) {
            //     newValue = "0";
            // }
            // view.element.value = newValue;
            // view.set("value",parseFloat(newValue));
        // },
        change(event, view) {

            var oldValue = view.element.value,
                newValue = oldValue;
            if (oldValue.lastIndexOf(".") === (oldValue.length - 1)) {
                newValue = newValue ? newValue.substr(0,oldValue.length - 1) : newValue;
            }
            if (/(0+$)/.test(newValue)) {
                if (newValue.lastIndexOf(".") >= 0) {
                    newValue = newValue.replace(/(0*$)/g, "");
                    newValue = newValue.replace(/(\.*$)/g, "");
                }
            }
            if (/(^0+)/.test(newValue)) {
                newValue = newValue.replace(/^0*/g, '0');
                if (/(^[0]{1}[1-9]{1,})/.test(newValue)) {
                    newValue = newValue.replace(/^0*/g, '');
                }
            }
            newValue = parseFloat(newValue);
            if (isNaN(newValue)) {
                newValue = 0;
            }
            if(view.get("isNullable") && newValue === 0){
                view.element.value = "";
                view.set("value",null);
            }
            else{
                view.element.value = newValue;
                view.set("value",newValue);
            }

            // var newValue = view.element.value.replace(/[^0-9\.-]/g,"");
            // view.element.value = newValue;
            // view.set("value",parseFloat(newValue));
        }
    })
});
