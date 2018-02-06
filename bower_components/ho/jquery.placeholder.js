/***
不支持html5的placeholder功能的浏览器需要增加插件支持类似功能
 ***/

(function($) {
    var Placeholder = {
        //默认参数设置
        defaultSettings: {
            tipClass: "placeholder"
        },
        ini: function(settings, obj) {
            if (obj.val().length == 0) {
                obj.addClass(settings.tipClass);
                obj.val(obj.attr("placeholder"));
            }
            obj.bind("focus", function() {
                obj.removeClass(settings.tipClass);
                if ($(this).val() == obj.attr("placeholder")) {
                    $(this).val("");
                } else {}
            }).bind("blur", function() {
                if ($(this).val() == "") {
                    $(this).val(obj.attr("placeholder"));
                    obj.addClass(settings.tipClass);
                } else {}
            });
        },
        support: function() {
            return 'placeholder' in document.createElement('input');
        }
    }
    if (Placeholder.support()) {
        Placeholder = null;
        $.fn.placeholder = function() {
            return null;
        };
        $.fn.placeholder.support = true;
        return;
    }
    $.fn.placeholder = function(options) {
        if (typeof(options) == 'undefined') options = {};
        var settings = Placeholder.defaultSettings;
        if (options) {
            $.extend(settings, options);
        };
        return $(this).filter("[placeholder]").each(function(i, n) {
            Placeholder.ini(settings, $(n));
        });
    };
})(jQuery)