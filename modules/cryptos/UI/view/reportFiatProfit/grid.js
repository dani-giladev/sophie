Ext.define('App.modules.cryptos.UI.view.reportFiatProfit.grid', {
    extend: 'App.modules.cryptos.UI.view.reportTransaction.grid',
    alias: 'widget.cryptos-reportFiatProfit-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportFiatProfit',
        'App.modules.cryptos.UI.store.reportFiatProfit',
        'App.modules.cryptos.UI.model.reportFiatProfit',
        'App.modules.cryptos.UI.view.reportTransaction.grid'
    ],
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportFiatProfit');
        return controller;
    }
});
