Ext.define('App.modules.cryptos.UI.view.reportProfit.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-reportProfit-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportProfit',
        'App.modules.cryptos.UI.store.reportProfit',
        'App.modules.cryptos.UI.model.reportProfit'
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
            }/* 
            {
                ftype: 'groupingsummary',
                groupHeaderTpl: '<div class="custom-grid-feature-grouping">{groupValue}</div>'
            }*/                   
        ];
        
        return ret;
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportProfit');
        return controller;
    }
});
