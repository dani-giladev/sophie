Ext.define('App.modules.[MODULE_NAME].UI.view.userGroup.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.[MODULE_NAME]-userGroup-grid',
    
    requires: [
        'App.modules.[MODULE_NAME].UI.controller.userGroup',
        'App.modules.[MODULE_NAME].UI.store.userGroup',
        'App.modules.[MODULE_NAME].UI.model.userGroup'
    ],
    
    getGridStore: function()
    {
        return Ext.create('App.modules.[MODULE_NAME].UI.store.userGroup');
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.[MODULE_NAME].UI.controller.userGroup');
        return controller;
    }
});