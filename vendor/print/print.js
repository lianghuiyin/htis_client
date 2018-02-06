$(function(){
	var content = window.opener.$(".print-content").clone()
        .find(".hidden-print").remove().end();
        $(".print-title").after(content.prop("outerHTML"));
    document.title = content.find(".panel-title").text() + "--" + document.title;
});