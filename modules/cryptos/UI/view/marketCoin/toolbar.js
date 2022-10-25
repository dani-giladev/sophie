Ext.define('App.modules.cryptos.UI.view.marketCoin.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-marketCoin-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.marketCoin',
        'App.view.maintenance.toolbar'
    ],
    
    show_delete_button: true,
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.marketCoin');
        return controller;
    }

});
