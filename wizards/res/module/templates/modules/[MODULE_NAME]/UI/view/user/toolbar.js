Ext.define('App.modules.[MODULE_NAME].UI.view.user.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.[MODULE_NAME]-user-toolbar',
    
    requires: [
        'App.modules.[MODULE_NAME].UI.controller.user',
        'App.view.maintenance.toolbar'
    ],
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.[MODULE_NAME].UI.controller.user');
        return controller;
    }

});