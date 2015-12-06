var express = require('express'),
  i18n = require("i18next"),
  yamlSync = require('i18next.yaml'),
  nconf = require('nconf');

/* nconf initialization */

nconf.argv()
    .env()
    .file({ file: 'config.json' });

/* i18n initialization */

var option = {
  lng: 'en',
  supportedLngs: ['en', 'fr'],
  preload: ['en', 'fr'],
  fallbackLng: 'en',
  detectLngFromPath: 0,
  ns: {
    namespaces: ['route', 'menu', 'home', 'footer']
  },
  resGetPath: 'locales/__lng__/__ns__.yml',
  keyseparator: '::',
  nsseparator: ':::',
  ignoreRoutes: ['css/', 'fonts/', 'img/', 'js/']
};

i18n.backend(yamlSync);

/* Express app initialization */

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(i18n.handle);
i18n.registerAppHelper(app);
app.locals.nconf = nconf;

app.use('/static', express.static(__dirname + '/public'));

/* Routes */

i18n.init(option, function(t) {
  // Add localizable routes
  i18n.addRoute('/:lng', ['en', 'fr'], app, 'get', function(req, res) {
    res.render('home');
  });
  i18n.addRoute('/:lng/route:::home', ['en', 'fr'], app, 'get', function(req, res) {
    res.render('home');
  });
});


app.get('/', function (req, res) {
  res.redirect('/' + req.locale);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
