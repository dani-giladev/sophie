Ext.define('App.modules.cryptos.UI.view.user.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-user-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.user',
        'App.modules.cryptos.UI.store.user',
        'App.modules.cryptos.UI.model.user'
    ],
    
    getGridStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.user');
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.user');
        return controller;
    }
});