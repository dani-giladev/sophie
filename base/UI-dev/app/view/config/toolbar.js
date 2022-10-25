Ext.define('App.view.config.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.config-toolbar',
    
    requires: [

    ],

    show_add_button: false,
    show_edit_button: true,
    show_delete_button: true,
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.controller.config.config');
        return controller;
    }

});