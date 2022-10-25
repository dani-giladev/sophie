Ext.define('App.modules.cryptos.UI.view.userGroup.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-userGroup-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.userGroup',
        'App.modules.cryptos.UI.store.userGroup',
        'App.modules.cryptos.UI.model.userGroup'
    ],
    
    getGridStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.userGroup');
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.userGroup');
        return controller;
    }
});