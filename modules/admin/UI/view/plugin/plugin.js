Ext.define('App.modules.admin.UI.view.plugin.plugin', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'admin-plugin',
    
    requires: [
        'App.modules.admin.UI.view.plugin.dynamicFilterForm',
        'App.modules.admin.UI.view.plugin.grid',
        'App.modules.admin.UI.view.plugin.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'admin';
        me.config.modelId = 'plugin';        

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.plugin.plugins);
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.admin.UI.controller.plugin');
        return controller;
    }

});