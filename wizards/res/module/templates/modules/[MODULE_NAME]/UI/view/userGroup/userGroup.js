Ext.define('App.modules.[MODULE_NAME].UI.view.userGroup.userGroup', {
    extend: 'App.view.maintenance.maintenance',
    xtype: '[MODULE_NAME]-userGroup',
    
    requires: [
        'App.modules.[MODULE_NAME].UI.view.userGroup.dynamicFilterForm',
        'App.modules.[MODULE_NAME].UI.view.userGroup.grid',
        'App.modules.[MODULE_NAME].UI.view.userGroup.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = '[MODULE_NAME]';
        me.config.modelId = 'userGroup';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.userGroup.user_groups);
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.[MODULE_NAME].UI.controller.userGroup');
        return controller;
    }

});