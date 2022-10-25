Ext.define('App.modules.[MODULE_NAME].UI.view.userGroup.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.[MODULE_NAME]-userGroup-toolbar',
    
    requires: [
        'App.modules.[MODULE_NAME].UI.controller.userGroup',
        'App.view.maintenance.toolbar'
    ],
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.[MODULE_NAME].UI.controller.userGroup');
        return controller;
    }

});