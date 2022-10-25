Ext.define('App.modules.cryptos.UI.view.reportRobots.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-reportRobots-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportRobots',
        'App.modules.cryptos.UI.store.reportRobots',
        'App.modules.cryptos.UI.model.reportRobots'
    ],
    
    getGridStore: function()
    {
        return this.getMaintenanceController().getStore();
    },
    
    getGridFeatures: function()
    {
        var ret = 
        [ 
//            {
//                ftype: "summary"
//            },
            {
                ftype: 'groupingsummary',
                groupHeaderTpl: '<div class="custom-grid-feature-grouping">{groupValue}</div>'
            }                     
        ];
        
        return ret;
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportRobots');
        return controller;
    }
});
