Ext.define('App.modules.cryptos.UI.view.robotGroup.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-robotGroup-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.robotGroup',
        'App.modules.cryptos.UI.store.robotGroup',
        'App.modules.cryptos.UI.model.robotGroup'
    ],
    
    getGridStore: function()
    {
        return this.getMaintenanceController().getStore();
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robotGroup');
        return controller;
    }
});
