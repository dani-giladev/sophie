Ext.define('App.modules.cryptos.UI.view.robot.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-robot-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.robot',
        'App.modules.cryptos.UI.store.robot.robot',
        'App.modules.cryptos.UI.model.robot.robot'
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
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robot');
        return controller;
    }
});
