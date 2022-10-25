Ext.define('App.modules.admin.UI.view.user.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.admin-user-toolbar',
    
    requires: [
        'App.modules.admin.UI.controller.user',
        'App.view.maintenance.toolbar'
    ],
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.admin.UI.controller.user');
        return controller;
    }

});