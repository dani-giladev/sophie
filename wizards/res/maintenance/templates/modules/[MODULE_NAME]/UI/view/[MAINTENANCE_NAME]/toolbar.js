Ext.define('App.modules.[MODULE_NAME].UI.view.[MAINTENANCE_NAME].toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.[MODULE_NAME]-[MAINTENANCE_NAME]-toolbar',
    
    requires: [
        'App.modules.[MODULE_NAME].UI.controller.[MAINTENANCE_NAME]',
        'App.view.maintenance.toolbar'
    ],
    
    show_delete_button: false,
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.[MODULE_NAME].UI.controller.[MAINTENANCE_NAME]');
        return controller;
    }

});
