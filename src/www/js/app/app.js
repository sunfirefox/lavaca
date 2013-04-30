define(function(require) {
  var Cache = require('lavaca/util/Cache');
  var ExampleController = require('./net/ExampleController');
  var Application = require('lavaca/mvc/Application');
  var Model = require('lavaca/mvc/Model');
  var Connectivity = require('lavaca/net/Connectivity');
  var History = require('lavaca/net/History');
  var LoadingIndicator = require('lavaca/ui/LoadingIndicator');
  var Translation = require('lavaca/util/Translation');
  var State = require('./models/State');
  require('lavaca/ui/DustTemplate');
  require('jquery-mobile/events/touch');
  require('jquery-mobile/events/orientationchange');

  // Uncomment this section to use hash-based browser history instead of HTML5 history.
  // You should use hash-based history if there's no server-side component supporting your app's routes.
  History.overrideStandardsMode();

  /**
   * @class app
   * @super Lavaca.mvc.Application
   * Global application-specific object
   */
  var app = new Application(function() {
    // Initialize the models cache
    this.models = new Cache();
    this.models.set('example', new Model());
    // Initialize the routes
    this.router.add({
      '/': [ExampleController, 'home'],
      '/lang': [ExampleController, 'lang']
    });
    State.set('lang', localStorage.getItem('app:lang') || 'en_US');
    Translation.init(State.get('lang'));
    // Initialize the loading indicator
    this.loadingIndicator = LoadingIndicator.init();
  });

  /**
   * @method showErrors
   * Shows the errors dialog
   *
   * @param {Array} errors  A list of error messages
   * @return {Lavaca.util.Promise}  A promise
   */
  app.showErrors = function(errors) {
    return this.viewManager.load(null, app.ui.views.ErrorsView, {errors: errors}, 900);
  };

  /**
   * @method onOfflineAjax
   * Handles attempts to make an AJAX request when the application is offline
   */
  app.onOfflineAjax = function() {
    var hasLoaded = Translation.hasLoaded;
    window.plugins.notification.alert(hasLoaded ? Translation.get('error_offline') : 'No internet connection available. Please check your settings and connection and try again.');
  };

  // Setup offline AJAX handler
  Connectivity.registerOfflineAjaxHandler(app.onOfflineAjax);

  return app;

});
