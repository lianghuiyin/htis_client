/*jshint node:true*/

// To use it create some files under `mocks/`
// e.g. `server/mocks/ember-hamsters.js`
//
// module.exports = function(app) {
//   app.get('/ember-hamsters', function(req, res) {
//     res.send('hello');
//   });
// };

module.exports = function(app) {
	var globSync   = require('glob').sync;
	var mocks      = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
	var proxies    = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require);

	var bodyParser = require('body-parser');
	//app.user(bodyParser());--这种写法对新版本的Express已过时
	// parse application/x-www-form-urlencoded  
	app.use(bodyParser.urlencoded({ extended: false }));
	// parse application/json  
	app.use(bodyParser.json());

	// Log proxy requests
	var morgan  = require('morgan');
	app.use(morgan('dev'));

	mocks.forEach(function(route) { route(app); });
	proxies.forEach(function(route) { route(app); });

};
