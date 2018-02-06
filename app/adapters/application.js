import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    // host:"http://192.168.0.99:86",
	// namespace: 'server/api',
	namespace: 'api',
    shouldBackgroundReloadRecord: function () {
        return false;
    },
    headers: function() {
    	let token = this.container.lookup("controller:session").genrateToken();
    	if(window.sessionStorage){
            sessionStorage.setItem("token", token);
    	}
		return {
			"Token": token
		};
    }.property().volatile(),
    handleResponse: function (status, headers, payload) {
        if(status === 0){
            //status为0表示网络断开或服务器繁忙
            return new DS.InvalidError({
                ServerSideError:"网络断开或服务器繁忙"
            });
        }
        else{
            return this._super(status, headers, payload);
        }
    }
});
