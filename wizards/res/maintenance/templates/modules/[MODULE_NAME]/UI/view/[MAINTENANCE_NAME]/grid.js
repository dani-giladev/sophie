Ext.define('App.modules.[MODULE_NAME].UI.view.[MAINTENANCE_NAME].grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.[MODULE_NAME]-[MAINTENANCE_NAME]-grid',
    
    requires: [
        'App.modules.[MODULE_NAME].UI.controller.[MAINTENANCE_NAME]',
        'App.modules.[MODULE_NAME].UI.store.[MAINTENANCE_NAME]',
        'App.modules.[MODULE_NAME].UI.model.[MAINTENANCE_NAME]'
    ],
    
    getGridStore: function()
    {
        return this.getMaintenanceController().getStore();
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.[MODULE_NAME].UI.controller.[MAINTENANCE_NAME]');
        return controller;
    }
});
