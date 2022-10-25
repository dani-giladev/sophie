Ext.define('App.modules.cryptos.UI.view.historyRobotChanges.historyRobotChanges', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-historyRobotChanges',
    
    requires: [
        'App.modules.cryptos.UI.view.historyRobotChanges.filterForm',
        'App.modules.cryptos.UI.view.historyRobotChanges.dynamicFilterForm',
        'App.modules.cryptos.UI.view.historyRobotChanges.grid',
        'App.modules.cryptos.UI.view.historyRobotChanges.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'historyRobotChanges';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.historyRobotChanges.historyRobotChanges);
    },

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
                    Ext.widget('cryptos-historyRobotChanges-filterform', {
                        config: me.config
                    }),

                    Ext.widget('cryptos-historyRobotChanges-dynamicfilterform', {
                        config: me.config
                    })
                ]
        };
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.historyRobotChanges');
        return controller;
    }

});
