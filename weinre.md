@@ -1,23 +0,0 @@
weinre：

sudo npm install weinre@latest
node_modules/weinre/weinre --httpPort 8080 --boundHost -all-

http://192.168.0.156:8080/



<script src="http://localhost:8080/target/target-script-min.js#anonymous"></script>

javascript:(function(e){e.setAttribute("src","http://192.168.0.160:8080/target/target-script-min.js#anonymous");document.getElementsByTagName("body")[0].appendChild(e);})(document.createElement("script"));void(0);

javascript:(function(e){
	e.setAttribute("src","http://192.168.0.160:8080/target/target-script-min.js#anonymous”);
	document.getElementsByTagName("body")[0].appendChild(e);
})(document.createElement("script"));void(0);

(function(e){
	var url = "http://192.168.0.160:8080/target/target-script-min.js#anonymous";
	e.setAttribute("src”,url);
	document.getElementsByTagName("body")[0].appendChild(e);
})(document.createElement("script"));