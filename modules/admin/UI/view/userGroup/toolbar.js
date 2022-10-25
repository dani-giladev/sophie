Ext.define('App.modules.admin.UI.view.userGroup.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.admin-userGroup-toolbar',
    
    requires: [
        'App.modules.admin.UI.controller.userGroup',
        'App.view.maintenance.toolbar'
    ],
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.admin.UI.controller.userGroup');
        return controller;
    }

});