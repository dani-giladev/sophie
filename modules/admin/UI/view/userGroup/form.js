Ext.define('App.modules.admin.UI.view.userGroup.form', {
    extend: 'App.view.userGroup.form',
    alias: 'widget.admin-userGroup-form',
    
    requires: [

    ],
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.admin.UI.controller.userGroup');
        return controller;
    }
        
});