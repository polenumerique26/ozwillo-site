var express = require('express'),
  i18n = require("i18next"),
  yamlSync = require('i18next.yaml'),
  bodyParser = require('body-parser'),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport');

/* i18n initialization */

var allLanguages = ['bg', 'ca', 'en', 'es', 'fr', 'it', 'tr'];
var option = {
  supportedLngs: allLanguages,
  preload: allLanguages,
  fallbackLng: 'en',
  detectLngFromPath: 0,
  ns: {
    namespaces: ['route', 'menu', 'home', 'co-construct', 'discover', 'news', 'projects', 'legal-notices', 'contact', 'terms', 'footer']
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

/* Body parser initialization */

var contactFormParser = bodyParser.urlencoded({ extended: false });

/* Mailer initialization */

var transporter = nodemailer.createTransport(smtpTransport({
  host: 'your.smtp.host',
  port: 465,
  secure: true,
  ignoreTLS: true,
  auth: {
    user: 'user',
    pass: 'pass'
  }
}));

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
  i18n.addRoute('/:lng', allLanguages, app, 'get', function(req, res) {
    // FIXME : this is verbose, find a way to declare it once for all routes
    res.locals.host = req.get('host');
    res.render('home');
  });
  i18n.addRoute('/:lng/route:::home', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('home');
  });
  i18n.addRoute('/:lng/route:::discover', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('discover');
  });
  i18n.addRoute('/:lng/route:::news', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('news');
  });
  i18n.addRoute('/:lng/route:::co-construct', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('co-construct');
  });
  i18n.addRoute('/:lng/route:::projects', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('projects');
  });
  i18n.addRoute('/:lng/route:::contact', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('contact');
  });
  i18n.addRoute('/:lng/route:::contact', allLanguages, app, 'post', contactFormParser, function(req, res) {
    console.log('Sending contact email from ' + req.body.email + ' (' + req.body.subject + ')');
    var phone = req.body.phone ? req.body.phone : '';
    transporter.sendMail({
      from: 'portal@ozwillo.org', // TODO : use contact@ozwillo address
      to: 'contact@ozwillo.org',
      replyTo: req.body.email,
      subject: i18n.t('contact:::mail.subject', { subject: req.body.subject }),
      text: i18n.t('contact:::mail.body', { name: req.body.name, email: req.body.email, phone: phone, message: req.body.message })
    }, function(error, response) {
      if (error) {
        console.log(error);
        res.locals.mail_sending_failed = true;
      } else {
        console.log('Message ' + response.messageId + ' sent');
        res.locals.mail_sending_succeeded = true;
      }
      res.locals.host = req.get('host');
      res.render('contact');
    }.bind(res));
  });
  i18n.addRoute('/:lng/route:::legal-notices', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('legal-notices');
  });
  i18n.addRoute('/:lng/route:::terms', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('terms');
  });
});


app.get('/', function (req, res) {
  res.redirect('/' + req.locale);
});

app.get('/header.xml', function (req, res) {
  res.sendFile('xml/header.xml', { root: __dirname + '/public/' });
});
app.get('/footer.xml', function (req, res) {
  res.sendFile('xml/footer.xml', { root: __dirname + '/public/' });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Ozwillo site listening at http://%s:%s', host, port);
});
