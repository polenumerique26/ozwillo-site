var express = require('express'),
  i18n = require("i18next"),
  yamlSync = require('i18next.yaml');

/* i18n initialization */

var option = {
  lng: 'en',
  supportedLngs: ['en', 'fr'],
  preload: ['en', 'fr'],
  fallbackLng: 'en',
  detectLngFromPath: 0,
  ns: {
    namespaces: ['route', 'menu', 'home', 'co-construct', 'discover', 'legal-notices', 'projects', 'footer']
  },
  resGetPath: 'locales/__lng__/__ns__.yml',
  keyseparator: '::',
  nsseparator: ':::',
  ignoreRoutes: ['css/', 'fonts/', 'img/', 'js/', 'pdf/']
};

i18n.backend(yamlSync);
i18n.addPostProcessor("jade", function(val, key, opts) {
  return require("jade").compile(val, opts)();
});

/* Express app initialization */

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(i18n.handle);
i18n.registerAppHelper(app);

app.use('/static', express.static(__dirname + '/public'));

/* Routes */

i18n.init(option, function(t) {
  // Add localizable routes
  i18n.addRoute('/:lng', ['en', 'fr'], app, 'get', function(req, res) {
    // FIXME : this is verbose, find a way to declare it once for all routes
    res.locals.host = req.get('host');
    res.render('home');
  });
  i18n.addRoute('/:lng/route:::home', ['en', 'fr'], app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('home');
  });
  i18n.addRoute('/:lng/route:::discover', ['en', 'fr'], app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('discover');
  });
  i18n.addRoute('/:lng/route:::news', ['en', 'fr'], app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('news');
  });
  i18n.addRoute('/:lng/route:::co-construct', ['en', 'fr'], app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('co-construct');
  });
  i18n.addRoute('/:lng/route:::projects', ['en', 'fr'], app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('projects');
  });
  i18n.addRoute('/:lng/route:::contact', ['en', 'fr'], app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('contact');
  });
  i18n.addRoute('/:lng/route:::legal-notices', ['en', 'fr'], app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('legal-notices');
  });
  i18n.addRoute('/:lng/route:::terms', ['en', 'fr'], app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('terms');
  });
});


app.get('/', function (req, res) {
  res.redirect('/' + req.locale);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Ozwillo site listening at http://%s:%s', host, port);
});
