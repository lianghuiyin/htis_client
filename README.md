打开outlook——工具——选项——邮件格式——国际选项——Internet协议（对mailto：协议启用UTF-8支持）复选框去除选中——点击确定就OK了。（outlook中文版默认是选中的，去除选中即可）
这样乱码问题就解决了。不过对于outlook可能得挨个设置了。




 先说一个通用的解决方法：

 首先要在outlook中设置一下，让outlook能都接收mailto方法传过来的值。过程如下：

 打开outlook——工具——选项——邮件格式——国际选项——Internet协议（对mailto：协议启用UTF-8支持）（这是outlook中文版的写法）复选框选中——点击确定就OK了。





"function (start, len) {

        if ('number' === typeof start) {



          if ((start < 0) || (start >= get(this, 'length'))) {

            throw new EmberError(OUT_OF_RANGE_EXCEPTION);

          }



          // fast case

          if (len === undefined) len = 1;

          this.replace(start, len, EMPTY);

        }



        return this;

      }”





"function (e,r,t){

var i;

if(r>0){

i=this.currentState.slice(e,e+r);

this.get("relationship").removeRecords(i)

}

if(t){

this.get("relationship").addRecords(t,e)

}

}"