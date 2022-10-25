Ext.define('App.modules.cryptos.UI.view.fiatFloating.grid', {
    extend: 'App.modules.cryptos.UI.view.reportTransaction.grid',
    alias: 'widget.cryptos-fiatFloating-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.fiatFloating',
        'App.modules.cryptos.UI.store.fiatFloating',
        'App.modules.cryptos.UI.model.fiatFloating',
        'App.modules.cryptos.UI.view.reportTransaction.grid'
    ],
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.fiatFloating');
        return controller;
    }
});
