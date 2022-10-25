Ext.define('App.modules.admin.UI.view.user.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.admin-user-grid',
    itemId: 'admin-user-grid',

    requires: [
        'App.modules.admin.UI.controller.user',
        'App.modules.admin.UI.store.user',
        'App.modules.admin.UI.model.user'
    ],
    
    getGridStore: function()
    {
        return Ext.create('App.modules.admin.UI.store.user');
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.admin.UI.controller.user');
        return controller;
    }
});