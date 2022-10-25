Ext.define('App.modules.cryptos.UI.view.dashboard.toolbar', {
    extend: 'App.view.dashboard.toolbar',
    alias: 'widget.cryptos-dashboard-toolbar',
    
    requires: [
        'App.view.dashboard.toolbar'
    ],

    getDashboardController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.dashboard');
        return controller;
    }

});