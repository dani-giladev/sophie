Ext.define('App.modules.cryptos.UI.view.pump.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-pump-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.pump',
        'App.modules.cryptos.UI.store.pump',
        'App.modules.cryptos.UI.model.pump'
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
        var controller = App.app.getController('App.modules.cryptos.UI.controller.pump');
        return controller;
    }
});
