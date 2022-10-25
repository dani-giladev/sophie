Ext.define('App.modules.cryptos.UI.view.floating.grid', {
    extend: 'App.modules.cryptos.UI.view.reportTransaction.grid',
    alias: 'widget.cryptos-floating-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.floating',
        'App.modules.cryptos.UI.store.floating',
        'App.modules.cryptos.UI.model.floating',
        'App.modules.cryptos.UI.view.reportTransaction.grid'
    ],
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.floating');
        return controller;
    }
});
