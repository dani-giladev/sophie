Ext.define('App.view.main.MainController', {
    extend: 'App.view.viewController',
    alias: 'controller.Main',
    
    requires: [
        'App.controller.controller'
    ],

    onClickLogoutButton: function() {
        // Remove Main View
        //this.getView().destroy();
        
        App.app.getController('App.controller.controller').logout();
    }
    
});
