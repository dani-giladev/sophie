Ext.define('App.modules.admin.UI.view.userGroup.userGroup', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'admin-userGroup',
    
    requires: [
        'App.modules.admin.UI.view.userGroup.dynamicFilterForm',
        'App.modules.admin.UI.view.userGroup.grid',
        'App.modules.admin.UI.view.userGroup.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'admin';
        me.config.modelId = 'userGroup';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.userGroup.user_groups);
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.admin.UI.controller.userGroup');
        return controller;
    }

});