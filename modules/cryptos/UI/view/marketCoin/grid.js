Ext.define('App.modules.cryptos.UI.view.marketCoin.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-marketCoin-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.marketCoin',
        'App.modules.cryptos.UI.store.marketCoin',
        'App.modules.cryptos.UI.model.marketCoin'
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
        var controller = App.app.getController('App.modules.cryptos.UI.controller.marketCoin');
        return controller;
    }
});
