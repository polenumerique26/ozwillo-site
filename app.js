var express = require('express'),
  i18n = require("i18next"),
  yamlSync = require('i18next.yaml'),
  bodyParser = require('body-parser'),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
  compress = require('compression');

/* i18n initialization */

var allLanguages = ['fr'];
var option = {
  supportedLngs: allLanguages,
  preload: allLanguages,
  fallbackLng: 'fr',
  detectLngFromPath: 0,
  ns: {
    namespaces: ['route', 'menu', 'home', 'offer-data', 'offer-portal', 'offer-incubation', 'news',
      'association', 'governance', 'community', 'team', 'common-good', 'technology', 'genesis', 'contributions',
      'legal-notices', 'contact']
  },
  resGetPath: 'locales/__lng__/__ns__.yml',
  keyseparator: '::',
  nsseparator: ':::',
  ignoreRoutes: ['css/', 'img/', 'js/', 'pdf/', 'xml/']
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

app.use(compress());

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
  i18n.addRoute('/:lng/:oz*?/route:::home', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('home');
  });
  i18n.addRoute('/:lng/:oz*?/route:::offer-data', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('offer-data');
  });
  i18n.addRoute('/:lng/:oz*?/route:::offer-portal', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('offer-portal');
  });
  i18n.addRoute('/:lng/:oz*?/route:::offer-incubation', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('offer-incubation');
  });
  i18n.addRoute('/:lng/:oz*?/route:::association', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('association');
  });
  i18n.addRoute('/:lng/:oz*?/route:::governance', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('governance');
  });
  i18n.addRoute('/:lng/:oz*?/route:::community', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('community');
  });
  i18n.addRoute('/:lng/:oz*?/route:::team', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('team');
  });
  i18n.addRoute('/:lng/:oz*?/route:::common-good', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('common-good');
  });
  i18n.addRoute('/:lng/:oz*?/route:::technology', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('technology');
  });
  i18n.addRoute('/:lng/:oz*?/route:::genesis', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('genesis');
  });
  i18n.addRoute('/:lng/:oz*?/route:::contributions', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('contributions');
  });
  i18n.addRoute('/:lng/:oz*?/route:::news', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('news');
  });
  i18n.addRoute('/:lng/:oz*?/route:::contact', allLanguages, app, 'get', function(req, res) {
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
  i18n.addRoute('/:lng/:oz*?/route:::legal-notices', allLanguages, app, 'get', function(req, res) {
    res.locals.host = req.get('host');
    res.render('legal-notices');
  });
});


app.get('/', function (req, res) {
  res.redirect('/' + req.locale);
});

app.get('/twitter', function(req, res) {
  res.redirect('https://twitter.com/ozwillo');
});

app.get('/doc', function(req, res) {
  res.redirect('http://doc.ozwillo.com/');
});

/* routes for header and footer files used by the portal */

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
