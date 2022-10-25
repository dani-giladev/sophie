Ext.define('App.modules.[MODULE_NAME].UI.view.userGroup.form', {
    extend: 'App.view.userGroup.form',
    alias: 'widget.[MODULE_NAME]-userGroup-form',
    
    requires: [

    ],
    
    getSpecialGrants: function()
    {

    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.[MODULE_NAME].UI.controller.userGroup');
        return controller;
    }
        
});