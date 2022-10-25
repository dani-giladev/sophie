Ext.define('App.modules.admin.UI.view.userGroup.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.admin-userGroup-grid',
    
    requires: [
        'App.modules.admin.UI.controller.userGroup',
        'App.modules.admin.UI.store.userGroup',
        'App.modules.admin.UI.model.userGroup'
    ],
    
    getGridStore: function()
    {
        return Ext.create('App.modules.admin.UI.store.userGroup');
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.admin.UI.controller.userGroup');
        return controller;
    }
});