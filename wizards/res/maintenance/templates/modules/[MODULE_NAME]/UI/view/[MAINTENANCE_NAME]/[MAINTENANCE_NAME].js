Ext.define('App.modules.[MODULE_NAME].UI.view.[MAINTENANCE_NAME].[MAINTENANCE_NAME]', {
    extend: 'App.view.maintenance.maintenance',
    xtype: '[MODULE_NAME]-[MAINTENANCE_NAME]',
    
    requires: [
        'App.modules.[MODULE_NAME].UI.view.[MAINTENANCE_NAME].dynamicFilterForm',
        'App.modules.[MODULE_NAME].UI.view.[MAINTENANCE_NAME].filterForm',
        'App.modules.[MODULE_NAME].UI.view.[MAINTENANCE_NAME].grid',
        'App.modules.[MODULE_NAME].UI.view.[MAINTENANCE_NAME].toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = '[MODULE_NAME]';
        me.config.modelId = '[MAINTENANCE_NAME]';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.[MAINTENANCE_NAME].[MAINTENANCE_NAME]_plural);
    },

    /*
    getWestPanel: function()
    {
        var me = this;
        var basetrans = me.getMaintenanceController().getTrans('base').maintenance;

        return {
            xtype: 'panel',
            region: 'west',
            layout: 'border',
            width: 300,
            height: '100%',
            split: true,
            collapsible: true,
            title: basetrans.filters,
            items:
                [
                    Ext.widget('[MODULE_NAME]-[MAINTENANCE_NAME]-filterform', {
                        config: me.config
                    }),

                    Ext.widget('[MODULE_NAME]-[MAINTENANCE_NAME]-dynamicfilterform', {
                        config: me.config
                    })
                ]
        };
    },
    */
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.[MODULE_NAME].UI.controller.[MAINTENANCE_NAME]');
        return controller;
    }

});
