Ext.define('App.modules.[MODULE_NAME].UI.view.user.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.[MODULE_NAME]-user-grid',
    
    requires: [
        'App.modules.[MODULE_NAME].UI.controller.user',
        'App.modules.[MODULE_NAME].UI.store.user',
        'App.modules.[MODULE_NAME].UI.model.user'
    ],
    
    getGridStore: function()
    {
        return Ext.create('App.modules.[MODULE_NAME].UI.store.user');
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.[MODULE_NAME].UI.controller.user');
        return controller;
    }
});