var HOJS = {
    version:0.1
};

/*
    在命名空间HOJS下定义一个公共函数库，这些函数将实现与具体应用无关的非常基础的功能
*/
HOJS.lib = {
    testReg:function(reg,valiValue){
        function testRegFun(){
            if(reg.test(valiValue)){
                return true;
            }
            else{
                return false;
            }
        }
        
        if(typeof reg == "string")
        {
            reg = new RegExp(reg);
            return testRegFun();
        }
        else if(reg instanceof RegExp){
            return testRegFun();
        }
        else{
            console.debug("testReg error:reg must be a string type or reg must be instanceof RegExp");
            return false;
        }
    },
    valiEmailValue:function(valiValue){
        var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return this.testReg(reg,valiValue);
    },
    valiPasswordValue:function(valiValue){
        var reg = /^[a-zA-Z]\w{5,15}$/;//以字母开头，长度在6~16之间，只能包含字符、数字和下划线
        return this.testReg(reg,valiValue);
    },
    /**
     * [判断字符item是否在以strSplit分隔的字符中]
     * @param  {[string]} item             [要判断的字符]
     * @param  {[string]} strSplits        [以strSplit分隔的字符串]
     * @param  {[string]} strSplit         [strSplits中的分隔符号，比较逗号]
     * 通过正则来判断，大大提高执行效率，比如如果strSplit为逗号，下面的表达式会判断出逗号分隔的strSplits中是否存在item子项
     * new RegExp(',%@,'.fmt(item)).test(",%@,".fmt(strSplits))
     * @return {[boolean]}                 [字符item是否在以strSplit分隔的字符中]
     */
    checkItemInSplitStr:function(item,strSplits,strSplit){
        if(!strSplit){
            strSplit = ",";
        }
        //判断字符item是否在以strSplit分隔的字符中
        return new RegExp('%@%@%@'.fmt(strSplit,item,strSplit)).test("%@%@%@".fmt(strSplit,strSplits,strSplit));
    },
    /**
     * [checkTimeDiffForStartEnd 校验开始结束时间跨度是否在指定范围内]
     * @param  {[string]} startTime        [第一条数据时间]
     * @param  {[string]} endTime          [第二条数据时间]
     * @param  {[int]} maxDiff             [时间跨度临界值]
     * @param  {[string]} interval         [时间跨度单位，默认为H，即小时]
        interval ：D表示查询精确到天数的之差
        interval ：H表示查询精确到小时之差
        interval ：M表示查询精确到分钟之差
        interval ：S表示查询精确到秒之差
        interval ：T表示查询精确到毫秒之差
     * @return {[boolean]}                 [是否通过校验，通过为true，反之为False]
     */
    checkTimeDiffForStartEnd:function(startTime,endTime,maxDiff,interval){
        if (maxDiff > 0) {
            interval = interval ? interval : "H";
            var timeDiff = HOJS.lib.dateDiff(interval, startTime, endTime);
            if (Math.abs(timeDiff) > maxDiff) {
                console.warn("timeout");
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    },
    /**
     * [parseMillisecondsToDate 把毫秒数转成时间]
     * @param  {[float]} f [要转换的毫秒数]
     * @param  {[string]} start [起始时间，系统默认为1970-01-01，可定制]
     * @return {[Date]}       [输出时间值，可通过format转成格式化字符串，比如：re.format("yyyy-MM-dd hh:mm:ss.S")]
     */
    parseMillisecondsToDate:function(f,start){
        if(start){
            //江铃升级用的是winCE系统时间值，起始时间是1904-01-01
            //这里要注意时区的影响new Date().getTimezoneOffset() * 60 * 1000对北京时间表示8小时
            return new Date(f + new Date(start.replace(/-/g,"\/")).getTime() - new Date().getTimezoneOffset() * 60 * 1000);
        }
        else{
            return new Date(f);
        }
    },
    copy: function(object, deep) {
        var ret = object,
            idx;

        // fast paths
        if (object) {
            if (object.isCopyable) return object.copy(deep);
        }

        switch ($.type(object)) {
            case "array":
                ret = object.slice();

                if (deep) {
                    idx = ret.length;
                    while (idx--) {
                        ret[idx] = HOJS.lib.copy(ret[idx], true);
                    }
                }
                break;

            case "object":
                ret = {};
                for (var key in object) {
                    ret[key] = deep ? HOJS.lib.copy(object[key], true) : object[key];
                }
        }

        return ret;
    },
    getUrlAnchor: function () {
        var re = "";
        var href = top.location.href;
        var index = href.indexOf("#");
        if (index > 0) {
            re = href.substring(index + 1);
        }
        return re;
    },
    arraySort: function(array, type, str) {
        /*  
            一维数组的排序
             type 参数 
             0 字母顺序（默认） 
             1 大小 比较适合数字数组排序
             2 拼音 适合中文数组
             3 乱序 有些时候要故意打乱顺序，呵呵
             4 带搜索 str 为要搜索的字符串 匹配的元素排在前面
         */
        switch (type) {
            case 0:
                array.sort();
                break;
            case 1:
                array.sort(function(a, b) {
                    return a - b;
                });
                break;
            case 2:
                array.sort(function(a, b) {
                    return a.localeCompare(b)
                });
                break;
            case 3:
                array.sort(function() {
                    return Math.random() > 0.5 ? -1 : 1;
                });
                break;
            case 4:
                array.sort(function(a, b) {
                    return a.indexOf(str) == -1 ? 1 : -1;
                });
                break;
            default:
                array.sort();
        }
    },
    deci: function(num, v) {
        /*
            十进制浮点数转换，
            num表示要四舍五入的数，
            v表示要保留的小数位数。
        */
        var vv = Math.pow(10, v);
        return Math.round(num * vv) / vv;
    },
    dateDiff: function(interval, date1, date2) {
        /*
            计算两个时间之差
            interval ：D表示查询精确到天数的之差
            interval ：H表示查询精确到小时之差
            interval ：M表示查询精确到分钟之差
            interval ：S表示查询精确到秒之差
            interval ：T表示查询精确到毫秒之差
            使用方法:
            alert(dateDiff('D', '2007-4-1', '2007/04/19'))；
        */
        if (interval && date1 && date2) {
            var objInterval = {
                'D': 1000 * 60 * 60 * 24,
                'H': 1000 * 60 * 60,
                'M': 1000 * 60,
                'S': 1000,
                'T': 1
            };
            var dt1 = (date1 instanceof Date) ? date1 : new Date(Date.parse(date1.replace(/-/g, '/')));
            var dt2 = (date2 instanceof Date) ? date2 : new Date(Date.parse(date2.replace(/-/g, '/')));
            try {
                return Math.round((dt2.getTime() - dt1.getTime()) / eval('objInterval.' + interval));
            } catch (e) {
                return -1;
            }
        } else {
            return -2;
        }
    },
    compareTime: function(startTime, endTime, isNotEnableEqual) {
        if (isNotEnableEqual) {
            return HOJS.lib.parseDate(endTime, true).getTime() - HOJS.lib.parseDate(startTime, true).getTime() > 0;
        } else {
            return HOJS.lib.parseDate(endTime, true).getTime() - HOJS.lib.parseDate(startTime, true).getTime() >= 0;
        }
    },
    parseDate: function(date, isForce) {
        if (typeof date == "string") {
            date = date.trim().replace(/-/g, '/');
            if (isForce) {
                date = date == "" ? new Date() : new Date(date);
                date = date instanceof Date ? date : new Date();
            } else {
                date = date == "" ? null : new Date(date);
                date = date instanceof Date ? date : null;
            }
        } else if (!(date instanceof Date)) {
            if (isForce) {
                date = new Date();
            } else {
                date = null;
            }
        }
        return date;
    },
    trim: function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    lTrim: function(str) {
        return str.replace(/(^\s*)/g, "");
    },
    rTrim: function(str) {
        return str.replace(/(\s*$)/g, "");
    },
    mult: function(str, count, noJoin) {
        //返回count个str
        if (typeof count !== "number" || count < 1) {
            return "";
        }
        var reStrs = [];
        for (var i = 0; i < count; i++) {
            reStrs.push(str);
        }
        if (noJoin) {
            return reStrs;
        } else {
            return reStrs.join("");
        }
    },
    /**
     * [parseHexsFromString description]
     * 把若干ASCII字符串解析成字节组成的16进制字符串
     * @param  {[string]} str [若干字符串]
     * @return {[hexs]}     [若干16进制串]
     */
    parseHexsFromString: function(str) {
        //然后把数组中每个16进制字符串分别解析成ASCII字符串
        //最后把解析后的ASCII字符数组连成串
        var reStrs = [],
            tempHex;
        for (var i = 0; i < str.length; i++) {
            tempHex = str.charCodeAt(i).toString(16);
            // reStrs.push(tempHex.length < 2 ? (0+tempHex) : tempHex);
            reStrs.push(tempHex);
        }
        return reStrs.join("").toUpperCase();
    },
    /**
     * [parseStringFromHex description]
     * 把若干字节组成的16进制字符串解析成ASCII字符串
     * 英文为单字节，中文为双字节，假设传入的都是英文
     * 比如传入参数"5354415254"将返回"START"
     * @param  {[type]}  hexs      [若干字节组成的16进制字符串]
     * @return {[type]}           [解析后的字符串]
     */
    parseStringFromHexs: function(hexs) {
        //正则match把hexs转换成字节数组，即把"5354415254"转成["53", "54", "41", "52", "54"]
        //然后把数组中每个16进制字符串分别解析成ASCII字符串
        //最后把解析后的ASCII字符数组连成串
        return hexs.match(/(\d|[a-fA-F]){2}/g).map(function(n) {
            return HOJS.lib.parseStringFromHex(n);
        }).join("");
    },
    /**
     * [parseStringFromHex description]
     * 把一个或两个字节16进制字符解析成ASCII字符串
     * 英文为单字节，中文为双字节，如果传入一个单字节肯定是英文反之肯定是中文
     * @param  {[type]}  hex      [一个16进制字符]
     * @return {[type]}           [解析后的字符串]
     */
    parseStringFromHex: function(hex) {
        return String.fromCharCode("0x" + hex);
    },
    /**
     * [decodeENotation 把科学计数法字串转成正常数值格式的字串]
     * 
     * @param  {[string]} str
     * @return {[string]}
     */
    decodeENotation:function(str){
        var regForTest,
            regForNum,
            regForCount;
        /**
         * [regForTest 验证数值串是否为科学计数法的正则]
         * @type {RegExp}
         */
        regForTest = /e/i;
        /**
         * [regForNum 匹配符号e前面的数值串的正则]
         * @type {RegExp}
         */
        regForNum = /\d(?:\.\d+)*/;
        /**
         * [regForCount 匹配符号e后面的数值的正则]
         * @type {RegExp}
         */
        regForCount = /[+|-]\d+/;
        if(regForTest.test(str)){
            var num = str.match(regForNum)[0];
            var count = parseInt(str.match(regForCount)[0]);
            return num.replace(".","") + HOJS.lib.mult("0",count - num.length + 2);
        }
        else{
            return str;
        }
    },
    /**
     * [parseFloatFromHex description]
     * 把16进制转成十进制浮点数，支持整数，单精度及双精度浮点数
     * 转换前要先把16进制转成2进制格式，转换后其2进制特点如下表格所示：
     * ////////////////////////////////////////////////////////////////////////////////////////
     * 类型                     存储位数                                       偏置值
     *                          数符(S)     阶码(E)     尾数(M)     总位数     2进制     十进制
     * 短浮点数(Single，float） 1位         8位         23位        32位       7FH       +127=(2^(8-1)-1)
     * 长浮点数(Double)         1位         11位        52位        64位       3FFH      +1023=(2^(11-1)-1)
     * /////////////////////////////////////////////////////////////////////////////////////////
     * 计算公式：
     * ////////////////////////////////////////////////////////////////////////////////////////
     * F=1.M(二进制)
     * 在单精度时：
     * V=(-1)^s*2^(E-127)*F
     * 在双精度时：
     * V=(-1)^s*2^(E-1023)*F
     * /////////////////////////////////////////////////////////////////////////////////////////
     * 上述公式中:
     * s代表正负符号位（但其并不真实代表浮点数最后的正负号）
     * E代表指数指数值（转换成10进制后的值）
     * F代表最后的尾数值，其中M代表最初的尾数值，而且F不是绝对等于1.M
     * 当E的二进制各位为全'0'时，E=1-127（或1023）= 1-(2^(8-1)-1)（或(2^(11-1)-1)），F=0.M
     * 当E的二进制各位不为全'0'且不为全'1'时，E=E-127（或1023）= E-(2^(8-1)-1)（或(2^(11-1)-1)），F=1.M
     * /////////////////////////////////////////////////////////////////////////////////////////
     * 上述公式合并（单精度与双精度）后为：
     * 当E的二进制各位为全'0'时，V=(-1)^s*2^(1-(2^(e-1)-1))*0.M
     * 当E的二进制各位不为全'0'且不为全'1'时，V=(-1)^s*2^(E-(2^(e-1)-1))*1.M
     * 其中s为符号位值，十进制0或1，e为阶码(E)的位数，单精度为8，双精度为11，E为阶码(E)的十进制值，M为最初的尾数的十进制值
     * /////////////////////////////////////////////////////////////////////////////////////////
     * @param  {[type]}  hex   [16进制串]
     * @param  {Boolean} isDouble [是否是双精度]
     * @return {[number]}           [转换后的浮点值]
     */
    parseFloatFromHex: function(hex, isDouble) {
        var e = 8;
        if (isDouble) {
            e = 11;
        }
        //参数hex为16进制字符串，如"C1480000"
        var twoStr = parseInt(hex, 16).toString(2); //16进制转2进制串，11000001010010000000000000000000
        twoStr = HOJS.lib.decodeENotation(twoStr);//因ie浏览器在数值很大时会出现科学计数表示法的值，所以需要把其值解码为正常数值串
        //twoStr=100000001000111000101011111010010000111111111001011100000000000
        var needLength = 32, //2进制的位数，单精度时为32位，双精度为64
            curLength = twoStr.length;
        //curLength=63
        if (isDouble) {
            needLength = 64;
        }
        var needPadding = needLength - curLength; //根据精度及当前2进制实际有多少位数，获得2进制需要在前面补多少个零
        if (needPadding) {
            //当需要补零时，在原来的基本上把零补上
            twoStr = HOJS.lib.mult("0", needPadding) + twoStr;
            //twoStr=0100000001000111000101011111010010000111111111001011100000000000
        }
        var signStr = twoStr.charAt(0); //首位表示正负号,1表示负号，为0表示正号，但并不表示最后数值的正负号
        var sign = parseInt(signStr); //注意正负号的值分别为0和1，而不是1和-1
        //sign=0
        var powerStr = twoStr.substr(1, e), //第二位开始，长度为8的串表示指数10000010
            power, //指数值
            tailStr = twoStr.substr(e + 1), //尾数是后面的二进制数10010000000000000000000
            tail = 0, //尾数值
            tailPrefix; //尾数前缀值,最后实际的尾数值需要加上这个前缀值，1.M时为1,0.M时为0。
        //powerStr=10000000100
        //tailStr=0111000101011111010010000111111111001011100000000000
        if (!powerStr) {
            return 0.0;
        }

        if (powerStr == HOJS.lib.mult("0", e)) {
            //当指数串为全零时，指数为1-(2^(e-1)-1)，尾数为0.M
            power = 1 - (Math.pow(2, e - 1) - 1);
            tailPrefix = 0;
        } else {
            //当指数串不为全零时，指数为E-(2^(e-1)-1)，尾数为1.M
            power = parseInt(powerStr, 2) - (Math.pow(2, e - 1) - 1); //3
            tailPrefix = 1;
            //power=5
        }

        var tempChar = "";
        //计数尾数值，即计算二进制0.M或1.M中的M值
        //比如M=10010000000000000000000时
        //应该计算为1*2^(-1)+0*2^(-2)++0*2^(-3)+1*2^(-4)+0*2^(-5)+...
        for (var len = tailStr.length, i = len - 1; i >= 0; i--) {
            tempChar = tailStr.charAt(i);
            if (tempChar == "1") {
                tail += 1 * Math.pow(2, -1 * (i + 1));
            }
        }
        //tail这时为0.5625
        //尾数要加上前缀值，即要加上0.M中的0或1.M中的1
        tail += tailPrefix; //1.5625
        //tail=0.44286015624993524,sign=0
        //执行公式后返回计算结果
        return Math.pow(-1, sign) * Math.pow(2, power) * tail; //-12.5
    }
}

/*
    在命名空间HOJS.lib下定义一个StringBuilder类
*/
HOJS.lib.StringBuilder = function(iniStr) {
    this._stringArray = new Array();
    if (typeof iniStr == "string") {
        this._stringArray.push(iniStr);
    }
}
HOJS.lib.StringBuilder.prototype = {
    append: function(str) {
        this._stringArray.push(str);
    },
    toString: function(split) {
        if (typeof split == "string") {
            return this._stringArray.join(split);
        } else {
            return this._stringArray.join("");
        }
    }
}
/*
    把类StringBuilder的构造函数指向正确的函数，
    以便以后能被其他子类正确的继承，
    如果不重定向的话，类StringBuilder的构造函数将指向系统函数Object。
*/
HOJS.lib.StringBuilder.prototype.constructor = HOJS.lib.StringBuilder;


HOJS.lib.stringFmt = function(b, a) {
    var c = 0,
        d = undefined,
        e;
    if (a) {
        d = a[0]
    }
    return b.replace(/%\{(.*?)\}/g,
        function(f, g) {
            e = YES;
            if (!d) {
                throw "Cannot use named parameters with `fmt` without a data hash. String: '" + b + "'"
            }
            return SC.String._scs_valueForKey(g, d, b)
        }).replace(/%@([0-9]+)?/g,
        function(g, f) {
            if (e) {
                throw "Invalid attempt to use both named parameters and indexed parameters. String: '" + b + "'"
            }
            f = f ? parseInt(f, 10) - 1 : c++;
            if (a[f] !== undefined) {
                return a[f]
            } else {
                return ""
            }
        })
}



String.prototype.endWith = function(s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substring(this.length - s.length) == s)
        return true;
    else
        return false;
    return true;
}

String.prototype.startWith = function(s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substr(0, s.length) == s)
        return true;
    else
        return false;
    return true;
}
Function.prototype.switchScope = function() {
    if (arguments.length < 2 && typeof arguments[0] == "undefined") return this;
    var __method = this,
        args = jQuery.makeArray(arguments),
        object = args.shift();
    return function() {
        return __method.apply(object, args.concat(jQuery.makeArray(arguments)));
    }
}
String.prototype.fmt = function() {
    return HOJS.lib.stringFmt(this, arguments)
}


if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return HOJS.lib.trim(this);
    }
}
// if (!Array.prototype.map) {
//     Array.prototype.map = function(fun) {
//         //fun中参数为item,index
//         return $.map(this, fun);
//     }
// }
// if (!Array.prototype.forEach) {
//     Array.prototype.forEach = function(fun) {
//         return $.each(this, function(index, item) {
//             return fun(item, index, this);
//         });
//     }
// }
// if (!Array.prototype.filter) {
//     Array.prototype.filter = function(fun) {
//         //fun中参数为item,index
//         return $.grep(this, fun);
//     }
// }
if (!Array.prototype.distinct) {
    Array.prototype.distinct=function(){
        var a=[],b=[],dt;
        for(var prop in this){
            var d = this[prop];
            if (d===a[prop]) continue; //防止循环到prototype
            dt = d + typeof(d);//增加类型判断
            if (b[dt]!=1){
                a.push(d);
                b[dt]=1;
           }
        }
        return a;
    }
}


//根据是否为debug模式及浏览器是否支持console函数做相应设置
//如果不支持console函数则定义一个空函数以保证不会报错
//如果非debug模式，则也要定义一个空函数以让其不输出值到控制台
if (!window.console) {
    /**
     * [console description]
     * 注意log/info/debug/warn/error支持printf风格的占位符功能
     * 占位符的种类比较少，只支持字符（%s）、整数（%d或%i）、浮点数（%f）和对象（%o）四种。
     * 比如，
     * console.log("%d年%d月%d日", 2011, 3, 26);
     * console.log("圆周率是%f", 3.1415926);
     * %o占位符，可以用来查看一个对象内部情况。比如，有这样一个对象：
     * var dog = {} ;
     * dog.name = "大毛" ;
     * dog.color = "黄色";
     * console.log("%o",dog);//输出{name:"大毛",color:"黄色"}
     */
    window.console = {
        /**
         * [log description]
         * @return {[type]} [description]
         */
        log: function() {

        },
        info: function() {

        },
        debug: function() {

        },
        warn: function() {

        },
        error: function() {

        },
        /**
         * [group description]
         * 如果信息太多，可以分组显示，用到的方法是console.group()和console.groupEnd()。
         * console.group("第一组信息");
         * console.log("第一组第一条");
         * console.log("第一组第二条");
         * console.groupEnd();
         * console.group("第二组信息");
         * console.log("第二组第一条");
         * console.log("第二组第二条");
         * console.groupEnd();
         */
        group: function() {

        },
        groupEnd: function() {

        },
        /**
         * [dir description]
         * 可以显示一个对象所有的属性和方法。
         */
        dir: function() {

        },
        /**
         * [dirxml description]
         * 用来显示网页的某个节点（node）所包含的html/xml代码。
         */
        dirxml: function() {

        },
        /**
         * [assert description]
         * 用来判断一个表达式或变量是否为真。如果结果为否，
         * 则在控制台输出一条相应信息，并且抛出一个异常。
         * var result = 0;
         * console.assert( result );
         * var year = 2000;
         * console.assert(year == 2011);
         */
        assert: function() {

        },
        /**
         * [trace description]
         * 用来追踪函数的调用轨迹。
         * 比如一个加法函数中调用console.trace
         * function add(a,b){console.trace();return a+b;}
         * 当任何函数调用add函数时，都会在控制台输出相关记录
         */
        trace: function() {

        },
        /**
         * [time description]
         * console.time()和console.timeEnd()，用来显示代码的运行时间。
         * console.time("计时器一");
         * for(var i=0;i<1000;i++){
         *     for(var j=0;j<1000;j++){}
         * }
         * console.timeEnd("计时器一");
         */
        time: function() {

        },
        timeEnd: function() {

        },
        /**
         * [profile description]
         * 性能分析（Profiler）就是分析程序各个部分的运行时间，找出瓶颈所在
         * console.profile('性能分析器一');
         * Foo();
         * console.profileEnd();
         */
        profile: function() {

        },
        profileEnd: function() {

        }
    }
}

/*给日期对象原型增加常用函数*/
Date.prototype.format = function(fmt) 
{
    //author: meizz 
    var o =
     { 
        "M+" : this.getMonth() + 1, //月份 
        "d+" : this.getDate(), //日 
        "h+" : this.getHours(), //小时 
        "m+" : this.getMinutes(), //分 
        "s+" : this.getSeconds(), //秒 
        "q+" : Math.floor((this.getMonth() + 3) / 3), //季度 
        "S" : this.getMilliseconds() //毫秒 
     }; 
    if (/(y+)/.test(fmt)) {
         fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); 
     }
    for (var k in o) {
        if(!o.hasOwnProperty(k)){
            //防止循环到prototype
            continue;
        }
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); 
        }
    }
    return fmt; 
}

Date.prototype.addHours = function(h)
{
    this.setHours(this.getHours() + h);
    return this;
};

Date.prototype.addMinutes = function(m)
{
    this.setMinutes(this.getMinutes() + m);
    return this;
};

Date.prototype.addSeconds = function(s)
{
    this.setSeconds(this.getSeconds() + s);
    return this;
};

Date.prototype.addDays = function(d)
{
    this.setDate(this.getDate() + d);
    return this;
};

Date.prototype.addWeeks = function(w)
{
    this.addDays(w * 7);
    return this;
};

Date.prototype.addMonths= function(m)
{
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);
    if (this.getDate() < d)
        this.setDate(0);
    return this;
};

Date.prototype.addYears = function(y)
{
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);
    if (m < this.getMonth()) 
    {
        this.setDate(0);
    }
    return this;
};


/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
HOJS.lib.accAdd = function(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function (arg) {
    return HOJS.lib.accAdd(arg, this);
};

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
HOJS.lib.accSub = function (arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 给Number类型增加一个sub方法，调用起来更加方便。
Number.prototype.sub = function (arg) {
    return HOJS.lib.accSub(arg, this);
};

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
HOJS.lib.accMul = function (arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

// 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function (arg) {
    return HOJS.lib.accMul(arg, this);
};


/** 
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
HOJS.lib.accDiv = function (arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

//给Number类型增加一个div方法，调用起来更加方便。
Number.prototype.div = function (arg) {
    return HOJS.lib.accDiv(this, arg);
};




