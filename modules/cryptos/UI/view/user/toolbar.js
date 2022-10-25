Ext.define('App.modules.cryptos.UI.view.user.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-user-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.user',
        'App.view.maintenance.toolbar'
    ],
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.user');
        return controller;
    }

});