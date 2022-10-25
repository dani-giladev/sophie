Ext.define('App.modules.admin.UI.view.plugin.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.admin-plugin-grid',
    
    requires: [
        'App.modules.admin.UI.controller.plugin',
        'App.modules.admin.UI.store.plugin',
        'App.modules.admin.UI.model.plugin'
    ],
    
    getGridStore: function()
    {
        return Ext.create('App.modules.admin.UI.store.plugin');
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.admin.UI.controller.plugin');
        return controller;
    }
});