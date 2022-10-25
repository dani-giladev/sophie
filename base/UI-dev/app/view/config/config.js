Ext.define('App.view.config.config', {
    extend: 'App.view.maintenance.maintenance',
    
    requires: [
        'App.controller.config.config',
        'App.view.config.dynamicFilterForm',
        'App.view.config.grid',
        'App.view.config.toolbar'
    ],

    initComponent: function()
    {
        var me = this;     
        
        me.config.moduleId = 'admin';
        me.config.modelId = 'config';   
        
        me.config.extraParams = {
            module: me.config.module
        };
        
        this.callParent(arguments);
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.controller.config.config');
        return controller;
    }

});