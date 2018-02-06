/*!
 * table2excel v1.0
 * Copyright 2016 Lit.Yin
 */

(function ($) {
    $.fn.table2excel = function (options) {
        var settings = {};
        (function(){
            //默认参数设置
            var defaultSettings = {
                sheetName:"worksheet",
                fileName: "table2excel",
                fileExt: ".xls"
            };
            if (typeof (options) == 'undefined') options = {};
            settings = defaultSettings;
            if (options) {
                $.extend(settings, options);
            };
        })();
        return table2excel.ini(settings,this);
        // return this.each(function(){
        //     table2excel.ini(settings,$(this));
        // });
    };
    var table2excel = {
        ini:function(settings,obj){
            if(this.valiSettings(settings)){
                console.log("table2excel");
                var tablesHtml = "";
                obj.each(function(index,tableItem){
                    tablesHtml += tableItem.outerHTML;
                });
                var uri = "data:application/vnd.ms-excel;base64,";
                uri += this.getBase64Content(settings.sheetName,tablesHtml);
                // location.href = uri;
                var linkStr = this.getLinkStr(uri,settings.fileName);
                var link = $(linkStr).appendTo("body");
                link[0].click();
                link.remove();
            }
        },
        getBase64Content:function(worksheet,tables){
            var content = this.getExcelContent(worksheet,tables);
            return this.base64(content);
        },
        getExcelContent:function(worksheet,tables){
            var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">\
              <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">\
              <head><!--[if gte mso 9]>\
                <xml>\
                  <x:ExcelWorkbook>\
                    <x:ExcelWorksheets>\
                      <x:ExcelWorksheet>\
                        <x:Name>%@</x:Name>\
                        <x:WorksheetOptions>\
                          <x:DisplayGridlines/>\
                        </x:WorksheetOptions>\
                      </x:ExcelWorksheet>\
                    </x:ExcelWorksheets>\
                  </x:ExcelWorkbook>\
                </xml><![endif]-->\
              </head>\
              <body>\
                %@\
              </body>\
            </html>';
            var params = [worksheet,tables];
            return this.stringFmt(template,params);
        },
        getLinkStr:function(uri,fileName){
            var template = '<a href = "%@" download = "%@">table2excel-link</a>';
            var params = [uri,fileName];
            return this.stringFmt(template,params);
        },
        base64:function(string) {
            if (window.btoa){
                return window.btoa(unescape(encodeURIComponent(string)));
            }
            else{
                return "";
            }
        },
        stringFmt:function(b, a) {
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
                });
        },
        valiSettings:function(settings){
            var errCount = 0;
            if(!settings.fileName.length){
                this.debug("settings.fileName can not be empty");
                errCount++;
            }
            if(!settings.fileExt.length){
                this.debug("settings.fileName can not be empty");
                errCount++;
            }
            return errCount > 0 ? false : true;
        },
        debug:function (msg) {
            if (window.console && window.console.log && typeof msg == "string"){
                window.console.log('$.fn.table2excel: ' + msg);
            }
        }
    }
})(jQuery);

