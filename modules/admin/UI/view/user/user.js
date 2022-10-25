Ext.define('App.modules.admin.UI.view.user.user', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'admin-user',
    
    requires: [
        'App.modules.admin.UI.view.user.dynamicFilterForm',
        'App.modules.admin.UI.view.user.grid',
        'App.modules.admin.UI.view.user.toolbar'
    ],

    initComponent: function()
    {
        var me = this;

        me.config.moduleId = 'admin';
        me.config.modelId = 'user';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.user.users);
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.admin.UI.controller.user');
        return controller;
    }

});