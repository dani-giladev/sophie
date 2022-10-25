Ext.define('App.modules.[MODULE_NAME].UI.view.user.user', {
    extend: 'App.view.maintenance.maintenance',
    xtype: '[MODULE_NAME]-user',
    
    requires: [
        'App.modules.[MODULE_NAME].UI.view.user.dynamicFilterForm',
        'App.modules.[MODULE_NAME].UI.view.user.grid',
        'App.modules.[MODULE_NAME].UI.view.user.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = '[MODULE_NAME]';
        me.config.modelId = 'user';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.user.users);
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.[MODULE_NAME].UI.controller.user');
        return controller;
    }

});