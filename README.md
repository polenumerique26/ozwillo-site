# Ozwillo website

## Integration guide

### Converting HTML files to Jade

To convert an HTML page into a Jade one, use this online converter : http://html2jade.org/

### Pages layout

The common layout of a page is the following

```jade
- var page = 'home'
doctype html
html(lang=i18n.lng())
  include ./header.jade
  body
    include ./menu.jade
    // page content goes here
    include ./footer.jade
    include ./scripts.jade
```

As shown above, inside every page, declare a variable called `page` containing the current page name (it is then used by the language switcher menu), eg :
 
```javascript
- var page = 'home'
```

Each page has an associated translation file for every supported language, located in *locales/lang/namespace.yml* (see below for more details about translations).

### Handling translations

Things to known about translations :
* To get the current locale, call `i8n.lng()` 
* To get a link pointing to another page of the site, call `getPageLink('pagename')`
* To translate a simple key (ie without HTML), call `t('namespace:::key')` where :
 * *namespace* is the page name (whose translations reside in file *locales/lang/namespace.yml*, eg *locales/fr/home.yml*)
 * *key* is the translation key
 * The HTML element containing the text must be suffixed by the *=* character (eg `span= t('menu:::store')`)
* To translate a key containing HTML, call `t('namespace:::key', { postProcess: "jade" })` where :
 * *namespace* and *key* are the same as for simple keys
 * The HTML element containing the text must be suffixed by the *!=* characters (eg `h2!= t('home:::professional_title', { postProcess: "jade" })`)
