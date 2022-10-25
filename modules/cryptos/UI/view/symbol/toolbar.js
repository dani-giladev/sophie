Ext.define('App.modules.cryptos.UI.view.symbol.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-symbol-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.symbol',
        'App.view.maintenance.toolbar'
    ],
    
//    show_delete_button: false,
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.symbol');
        return controller;
    }

});
