import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    if(!serialized){
        return null;
    }
    if(typeof serialized === "string"){
        if(/Date/.test(serialized)){
            //"/Date(1419573609360+0800)/";
            //注意这里要把+0800去掉
            let time = serialized.match(/\d+/)[0];
            let date = new Date(parseInt(time));
            return date;
            // let timezone = date.getTimezoneOffset();
            // return date.addMinutes(timezone);
        }
        else{
            //'2015-10-04T15:58:29.31','2015-10-10T17:46:15.9586905Z'
            //由于ie下不支持毫秒解析（带毫秒会解析失败），所以只能正则匹配出所有数值
            // '2015-10-04T15:58:29.31'.match(/\d+/g)
            // ["2015", "10", "04", "15", "58", "29", "31"]
            let [y,M,d,h,m,s,f] = serialized.match(/\d+/g);
            f = f ? f.substr(0,2) : 0;//只取毫秒的前两位
            let date = new Date(y,M - 1,d,h,m,s,f);
            return date;
            // let timezone = date.getTimezoneOffset();
            // return date.addMinutes(timezone);
        }
    }
    else{
        return serialized;
    }
  },

  serialize(deserialized) {
    // return "/Date(1419573609360+0800)/";
    // deserialized.addMinutes(-deserialized.getTimezoneOffset());
    //这里需要拼出+0800这样的字符串，而不能用上述addMinutes函数
    //其原因是这里序列化的目标是为了给服务器使用（时区标记8小时），
    //它只是服务器的一个时区标记，而不是时间值真的添加了480分钟
    //如果这里在客户端添加8小时，当遇到服务器端执行失败的情况时就要去手动减去8小时还原。
    //所以应该在返回的服务器的字符串的处理时区问题，而不是在客户端直接处理时间值。
    if(!deserialized){
        return null;
    }
    return deserialized.format('yyyy-MM-dd hh:mm:ss');
    // var timezone = -deserialized.getTimezoneOffset()/60;
    // return "/Date(%@+%@)/".fmt(deserialized.getTime(),timezone.toString() + "00");
  }
});
