Ext.define('App.modules.cryptos.UI.view.symbol.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-symbol-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.symbol',
        'App.modules.cryptos.UI.store.symbol',
        'App.modules.cryptos.UI.model.symbol'
    ],
    
    getGridStore: function()
    {
        return this.getMaintenanceController().getStore();
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.symbol');
        return controller;
    }
});
