Ext.define('App.modules.cryptos.UI.view.historyRobotChanges.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-historyRobotChanges-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.historyRobotChanges',
        'App.modules.cryptos.UI.store.historyRobotChanges',
        'App.modules.cryptos.UI.model.historyRobotChanges'
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
                ftype: 'groupingsummary',
                groupHeaderTpl: '<div class="custom-grid-feature-grouping">{groupValue}</div>'
            }                         
        ];
        
        return ret;
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.historyRobotChanges');
        return controller;
    }
});
