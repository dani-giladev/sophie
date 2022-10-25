Ext.define('App.modules.cryptos.UI.view.manualTransaction.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-manualTransaction-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.manualTransaction',
        'App.modules.cryptos.UI.store.manualTransaction',
        'App.modules.cryptos.UI.model.manualTransaction'
    ],
    
    getGridStore: function()
    {
        return this.getMaintenanceController().getStore();
    },
    
    getGridFeatures: function()
    {
        var ret = 
        [ 
            {
                ftype: "summary"
            }                      
        ];
        
        return ret;
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.manualTransaction');
        return controller;
    }
});
